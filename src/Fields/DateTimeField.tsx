import { forwardRef } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { InputText } from '../Inputs/InputText'
import { textInputStyles, paddedInputStyles, fieldSubmittingStyles } from './fieldStyles'
import { chainHandlers, checkKeydownSubmit, useCommittedFieldValue } from './fieldUtils'
import { EMPTY_VALUE, ReadOnlyValue } from './common.styled'

const StyledInput = styled(InputText)`
  ${textInputStyles}
  ${paddedInputStyles}
  ${fieldSubmittingStyles}
  min-width: 112px;
  max-width: 100%;

  /* date placeholder color */
  &::placeholder {
    color: var(--md-sys-color-on-surface-variant);
  }
`

const pad = (n: number) => n.toString().padStart(2, '0')

const isValidDate = (value?: string) => !!value && !Number.isNaN(Date.parse(value))

// ISO string → datetime-local input value (shown in UTC)
const toInputValue = (value?: string): string => {
  if (!isValidDate(value)) return ''
  const d = new Date(value as string)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(
    d.getUTCHours(),
  )}:${pad(d.getUTCMinutes())}`
}

// datetime-local input value → ISO string (read as UTC)
const toIsoValue = (value: string): string | undefined => {
  if (!value) return undefined
  const [datePart, timePart = ''] = value.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)
  if (!year || !month || !day || Number.isNaN(hours) || Number.isNaN(minutes)) {
    return undefined
  }
  return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0)).toISOString()
}

export interface DateTimeFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** ISO 8601 date-time string. Shown and edited in UTC. */
  value: string
  onChange: (value: string | undefined) => void
  /** Called on Enter or blur when the value changed — use for auto-save */
  onCommit?: (value: string | undefined) => void
  isSubmitting?: boolean
  isReadOnly?: boolean
}

export const DateTimeField = forwardRef<HTMLInputElement, DateTimeFieldProps>(
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
    const field = useCommittedFieldValue<string | undefined>(value || undefined)

    const handleCommit = () => field.commit(value || undefined, onCommit)

    const handleKeyCommit = () => {
      field.suppressBlurCommit()
      handleCommit()
    }

    const handleCancel = () => {
      field.suppressBlurCommit()
      onChange(field.cancelToLastCommit())
    }

    if (isReadOnly) {
      return (
        <ReadOnlyValue className={clsx(className, 'read-only')} data-tooltip={title}>
          {toInputValue(value).replace('T', ' ') || EMPTY_VALUE}
        </ReadOnlyValue>
      )
    }

    return (
      <StyledInput
        {...props}
        ref={ref}
        type="datetime-local"
        value={toInputValue(value)}
        onChange={(e) => onChange(toIsoValue(e.target.value))}
        onFocus={chainHandlers(field.onFocus, onFocus)}
        onBlur={chainHandlers((_e: React.FocusEvent<HTMLInputElement>) => {
          if (field.blurCommitSuppressed()) return
          handleCommit()
        }, onBlur)}
        onKeyDown={chainHandlers(
          (e: React.KeyboardEvent<HTMLInputElement>) =>
            checkKeydownSubmit(e, handleKeyCommit, handleCancel),
          onKeyDown,
        )}
        data-tooltip={title}
        className={clsx(className, { submitting: isSubmitting })}
      />
    )
  },
)
DateTimeField.displayName = 'DateTimeField'
