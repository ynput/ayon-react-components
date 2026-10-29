import { forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { InputNumber } from '../Inputs/InputNumber'
import { textInputStyles, paddedInputStyles, fieldSubmittingStyles } from './fieldStyles'
import { chainHandlers, checkKeydownSubmit, useCommittedFieldValue } from './fieldUtils'
import { EMPTY_VALUE, ReadOnlyValue } from './common.styled'

const StyledInput = styled(InputNumber)`
  ${textInputStyles}
  ${paddedInputStyles}
  ${fieldSubmittingStyles}

  /* Hide browser spin buttons */
  appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export type NumberFieldType = 'integer' | 'float'

export interface NumberFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  type: NumberFieldType
  value: number | undefined
  onChange: (value: number | undefined) => void
  /** Called on Enter or blur when the value changed — use for auto-save */
  onCommit?: (value: number | undefined) => void
  isSubmitting?: boolean
  isReadOnly?: boolean
}

const parseNumber = (raw: string, type: NumberFieldType): number | undefined => {
  if (!raw) return undefined
  const parsed = type === 'integer' ? Number.parseInt(raw, 10) : Number(raw)
  return Number.isNaN(parsed) ? undefined : parsed
}

const toText = (value: number | undefined | null) =>
  value === undefined || value === null ? '' : String(value)

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
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
    const [localValue, setLocalValue] = useState(toText(value))
    const field = useCommittedFieldValue(value)

    useEffect(() => {
      if (!field.isFocused()) setLocalValue(toText(value))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handleCommit = () => field.commit(parseNumber(localValue, type), onCommit)

    const handleKeyCommit = () => {
      field.suppressBlurCommit()
      handleCommit()
    }

    const handleCancel = () => {
      field.suppressBlurCommit()
      const restored = field.cancelToLastCommit()
      setLocalValue(toText(restored))
      onChange(restored)
    }

    if (isReadOnly) {
      return (
        <ReadOnlyValue className={clsx(className, 'read-only')} data-tooltip={title}>
          {toText(value) || EMPTY_VALUE}
        </ReadOnlyValue>
      )
    }

    return (
      <StyledInput
        {...props}
        ref={ref}
        type="number"
        step={type === 'integer' ? 1 : 'any'}
        value={localValue}
        onChange={(e) => {
          const raw = e.target.value
          setLocalValue(raw)
          const parsed = parseNumber(raw, type)
          if (raw === '') {
            onChange(undefined)
          } else if (parsed !== undefined) {
            onChange(parsed)
          }
        }}
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
NumberField.displayName = 'NumberField'
