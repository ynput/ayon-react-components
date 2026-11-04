import { forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { textInputStyles, paddedInputStyles, fieldSubmittingStyles } from './fieldStyles'
import { chainHandlers, checkKeydownSubmit, useCommittedFieldValue } from './fieldUtils'
import { EMPTY_VALUE, FieldErrorText, ReadOnlyValue } from './common.styled'

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 56px;
  ${textInputStyles}
  ${paddedInputStyles}
  ${fieldSubmittingStyles}
  resize: vertical;
`

const stringify = (value: unknown): string => {
  if (value === undefined) return ''
  return JSON.stringify(value, null, 2)
}

const parseJson = (raw: string): unknown => {
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  return JSON.parse(trimmed) as unknown
}

export interface JsonFieldProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value: unknown
  onChange: (value: unknown) => void
  /** Called on Ctrl/Cmd+Enter or blur when the value changed — use for auto-save */
  onCommit?: (value: unknown) => void
  isSubmitting?: boolean
  isReadOnly?: boolean
}

export const JsonField = forwardRef<HTMLTextAreaElement, JsonFieldProps>(
  (
    {
      value,
      onChange,
      onCommit,
      isSubmitting,
      isReadOnly,
      className,
      title,
      onFocus,
      onBlur,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const [draft, setDraft] = useState(() => stringify(value))
    const [parseError, setParseError] = useState<string | null>(null)
    const field = useCommittedFieldValue(value)

    // Sync external value changes into draft
    useEffect(() => {
      setDraft(stringify(value))
      setParseError(null)
    }, [value])

    const handleCommit = () => {
      try {
        const parsed = parseJson(draft)
        setParseError(null)
        if (field.commit(parsed, onCommit)) onChange(parsed)
      } catch {
        setParseError('Value must be valid JSON')
      }
    }

    const handleKeyCommit = () => {
      field.suppressBlurCommit()
      handleCommit()
    }

    const handleCancel = () => {
      field.suppressBlurCommit()
      const restored = field.cancelToLastCommit()
      setDraft(stringify(restored))
      setParseError(null)
      onChange(restored)
    }

    if (isReadOnly) {
      return (
        <ReadOnlyValue className={clsx(className, 'read-only')} data-tooltip={title}>
          {stringify(value) || EMPTY_VALUE}
        </ReadOnlyValue>
      )
    }

    return (
      <>
        <StyledTextArea
          rows={6}
          {...props}
          ref={ref}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            setParseError(null)
          }}
          onFocus={chainHandlers(field.onFocus, onFocus)}
          onBlur={chainHandlers((_e: React.FocusEvent<HTMLTextAreaElement>) => {
            if (field.blurCommitSuppressed()) return
            handleCommit()
          }, onBlur)}
          onKeyDown={chainHandlers(
            (e: React.KeyboardEvent<HTMLTextAreaElement>) =>
              // Enter adds a line here; Ctrl/Cmd+Enter commits
              (e.key !== 'Enter' || e.metaKey || e.ctrlKey) &&
              checkKeydownSubmit(e, handleKeyCommit, handleCancel),
            onKeyDown,
          )}
          data-tooltip={title}
          className={clsx(className, { submitting: isSubmitting })}
        />
        {parseError ? <FieldErrorText>{parseError}</FieldErrorText> : null}
      </>
    )
  },
)
JsonField.displayName = 'JsonField'
