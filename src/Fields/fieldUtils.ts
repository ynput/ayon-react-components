import { useEffect, useRef } from 'react'

export const blurFieldTarget = (target: HTMLElement) => {
  window.setTimeout(() => {
    target.blur()
  }, 0)
}

// Enter commits, Escape cancels. Both blur the field.
export const checkKeydownSubmit = (
  e: React.KeyboardEvent<HTMLElement>,
  onCommit: () => void,
  onCancel?: () => void,
) => {
  if (e.key === 'Enter' && !!onCommit) {
    e.preventDefault()
    e.stopPropagation()
    onCommit()
    blurFieldTarget(e.currentTarget)
    return
  }

  if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    onCancel?.()
    blurFieldTarget(e.currentTarget)
  }
}

// Runs the field's own handler first, then the one the caller passed.
export const chainHandlers =
  <E>(...handlers: (((event: E) => void) | undefined)[]) =>
  (event: E) => {
    handlers.forEach((handler) => handler?.(event))
  }

// Arrays and objects compare by content, so re-parsed lists or JSON count as unchanged.
export const isSameFieldValue = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

/**
 * Tracks the "last committed" value of a field so that pressing Escape can
 * restore it, a commit is skipped when nothing changed, and a keyboard-triggered
 * commit doesn't double-fire when the resulting blur also runs the commit handler.
 *
 * Usage pattern:
 *   onFocus   → call onFocus (snapshots the current value as the cancel target)
 *   onBlur    → guard with blurCommitSuppressed(); skip the handler if it returns true
 *   Enter key → call suppressBlurCommit() then commit (blur will be skipped)
 *   Escape key → call suppressBlurCommit() and restore cancelToLastCommit() (blur will be skipped)
 *   commit(next, onCommit) → calls onCommit only when next differs from the last committed value
 */
export const useCommittedFieldValue = <T>(value: T) => {
  // The value at the time the field was last focused (or last committed).
  // Pressing Escape restores to this value.
  const lastCommittedValue = useRef(value)

  // Whether the field is currently focused. Used to avoid overwriting
  // lastCommittedValue with stale prop updates while the user is editing.
  const isFocusedRef = useRef(false)

  // Set to true by keyboard/option commits so the blur handler knows it can
  // skip re-committing (the commit already happened).
  const blurIsRedundant = useRef(false)

  // Keep lastCommittedValue in sync with external value changes, but only
  // when the field is not focused (i.e. the user isn't mid-edit).
  useEffect(() => {
    if (!isFocusedRef.current) {
      lastCommittedValue.current = value
    }
  }, [value])

  // Call from onFocus: snapshot the current value as the Escape target.
  const onFocus = () => {
    isFocusedRef.current = true
    lastCommittedValue.current = value
  }

  const isFocused = () => isFocusedRef.current

  // Call after a successful commit to advance the Escape target forward.
  const saveCommit = (nextValue: T) => {
    lastCommittedValue.current = nextValue
  }

  // Commits nextValue unless it equals the last committed value. Returns whether it committed.
  const commit = (nextValue: T, onCommit?: (value: T) => void) => {
    if (isSameFieldValue(nextValue, lastCommittedValue.current)) return false
    lastCommittedValue.current = nextValue
    onCommit?.(nextValue)
    return true
  }

  // Call before triggering a commit via keyboard/option click, so the
  // subsequent blur event knows it can skip re-committing.
  const suppressBlurCommit = () => {
    blurIsRedundant.current = true
  }

  // Call at the start of onBlur. Returns true when the blur is redundant
  // (commit already happened) — the caller should skip its commit logic.
  const blurCommitSuppressed = () => {
    isFocusedRef.current = false

    if (!blurIsRedundant.current) return false

    blurIsRedundant.current = false
    return true
  }

  // Call from the Escape handler: the value to restore (the last committed one).
  const cancelToLastCommit = () => lastCommittedValue.current

  return {
    lastCommittedValue,
    onFocus,
    isFocused,
    saveCommit,
    commit,
    suppressBlurCommit,
    blurCommitSuppressed,
    cancelToLastCommit,
  }
}
