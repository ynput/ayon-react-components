import styled from 'styled-components'
import clsx from 'clsx'
import { InputColor, InputColorProps } from '../Inputs/InputColor'
import { fieldSubmittingStyles } from './fieldStyles'
import { EMPTY_VALUE, ReadOnlyValue } from './common.styled'

const StyledColorInput = styled(InputColor)`
  --base-input-size: 32px;

  .color-picker-preview {
    margin: 0;

    .color-picker-button {
      border: none;
    }
  }

  ${fieldSubmittingStyles}
`

const Swatch = styled.span`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
  border-radius: var(--border-radius-m);
`

export interface ColorFieldProps extends Omit<InputColorProps, 'onChange' | 'value' | 'format'> {
  /** Color as a hex string */
  value: string
  onChange: (value: string) => void
  /** Color picks are confirmed in a dialog, so this is called on every change */
  onCommit?: (value: string) => void
  isSubmitting?: boolean
  isReadOnly?: boolean
}

export const ColorField = ({
  value,
  onChange,
  onCommit,
  isSubmitting,
  isReadOnly,
  className,
  title,
  ...props
}: ColorFieldProps) => {
  const handleChange: InputColorProps['onChange'] = (event) => {
    const nextValue = typeof event.target.value === 'string' ? event.target.value : value
    onChange(nextValue)
    onCommit?.(nextValue)
  }

  if (isReadOnly) {
    return (
      <ReadOnlyValue className={clsx(className, 'read-only')} data-tooltip={title}>
        {value ? <Swatch style={{ backgroundColor: value }} /> : null}
        {value || EMPTY_VALUE}
      </ReadOnlyValue>
    )
  }

  return (
    <StyledColorInput
      {...props}
      value={value}
      format="hex"
      onChange={handleChange}
      data-tooltip={title}
      className={clsx(className, { submitting: isSubmitting })}
    />
  )
}
