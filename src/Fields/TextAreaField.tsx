import { forwardRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { InputTextarea } from '../Inputs/InputTextarea'
import { textInputStyles, paddedInputStyles, fieldSubmittingStyles } from './fieldStyles'
import { chainHandlers, checkKeydownSubmit, useCommittedFieldValue } from './fieldUtils'
import { EMPTY_VALUE, FieldErrorText, ReadOnlyValue } from './common.styled'

const StyledTextArea = styled(InputTextarea)`
  width: 100%;
  min-height: 56px;
  ${textInputStyles}
  ${paddedInputStyles}
  ${fieldSubmittingStyles}
  resize: vertical;
`

export type TextAreaFieldType = 'list_of_strings' | 'list_of_integers'

export interface TextAreaFieldProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  /** List type: one item per line (or comma separated) */
  type: TextAreaFieldType
  value: string[] | number[]
  onChange: (value: string[] | number[]) => void
  /** Called on Enter or blur when the value changed — use for auto-save */
  onCommit?: (value: string[] | number[]) => void
  isSubmitting?: boolean
  isReadOnly?: boolean
}

// Parse multiline/comma-separated string values
const parseStringList = (raw: string): string[] =>
  raw
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)

// Parse multiline/comma-separated integer values
const parseIntegerList = (raw: string): { value?: number[]; error?: string } => {
  const numbers = parseStringList(raw).map(Number)
  if (numbers.some((n) => Number.isNaN(n) || !Number.isInteger(n))) {
    return { error: 'Each value must be a whole number' }
  }
  return { value: numbers }
}

const parseList = (
  raw: string,
  type: TextAreaFieldType,
): { value?: string[] | number[]; error?: string } =>
  type === 'list_of_integers' ? parseIntegerList(raw) : { value: parseStringList(raw) }

const toText = (value: unknown) => (Array.isArray(value) ? value.join('\n') : '')

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    {
      type,
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
    const text = useMemo(() => toText(value), [value])
    const [draft, setDraft] = useState(text)
    const [parseError, setParseError] = useState<string | null>(null)
    const field = useCommittedFieldValue(value)

    // Sync external value changes into draft
    useEffect(() => {
      setDraft(text)
      setParseError(null)
    }, [text])

    const handleChange = (raw: string) => {
      setDraft(raw)
      const result = parseList(raw, type)
      setParseError(result.error ?? null)
      if (result.value) onChange(result.value)
    }

    const handleCommit = () => {
      const result = parseList(draft, type)
      if (result.value) field.commit(result.value, onCommit)
    }

    const handleKeyCommit = () => {
      field.suppressBlurCommit()
      handleCommit()
    }

    const handleCancel = () => {
      field.suppressBlurCommit()
      const restored = field.cancelToLastCommit()
      setDraft(toText(restored))
      setParseError(null)
      onChange(restored)
    }

    if (isReadOnly) {
      return (
        <ReadOnlyValue className={clsx(className, 'read-only')} data-tooltip={title}>
          {Array.isArray(value) && value.length ? value.join(', ') : EMPTY_VALUE}
        </ReadOnlyValue>
      )
    }

    return (
      <>
        <StyledTextArea
          {...props}
          ref={ref}
          value={draft}
          onChange={(e) => handleChange(e.target.value)}
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
TextAreaField.displayName = 'TextAreaField'
