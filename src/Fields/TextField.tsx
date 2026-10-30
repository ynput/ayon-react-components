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
`

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string
  onChange: (value: string) => void
  /** Called on Enter or blur when the value changed — use for auto-save */
  onCommit?: (value: string) => void
  isSubmitting?: boolean
  isReadOnly?: boolean
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
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
    const field = useCommittedFieldValue(value)

    const handleKeyCommit = () => {
      field.suppressBlurCommit()
      field.commit(value, onCommit)
    }

    const handleCancel = () => {
      field.suppressBlurCommit()
      onChange(field.cancelToLastCommit())
    }

    if (isReadOnly) {
      return (
        <ReadOnlyValue className={clsx(className, 'read-only')} data-tooltip={title}>
          {value || EMPTY_VALUE}
        </ReadOnlyValue>
      )
    }

    return (
      <StyledInput
        {...props}
        ref={ref}
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={chainHandlers(field.onFocus, onFocus)}
        onBlur={chainHandlers((_e: React.FocusEvent<HTMLInputElement>) => {
          if (field.blurCommitSuppressed()) return
          field.commit(value, onCommit)
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
TextField.displayName = 'TextField'
