import { forwardRef } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { InputSwitch } from '../Inputs/InputSwitch'
import { fieldSubmittingStyles } from './fieldStyles'

const StyledContainer = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  width: 100%;

  justify-content: flex-end;

  &.left {
    justify-content: flex-start;
  }

  &.read-only {
    pointer-events: none;

    * {
      cursor: default;
    }
  }
`

const StyledSwitch = styled(InputSwitch)`
  ${fieldSubmittingStyles}
`

const StyledCheckbox = styled.input`
  margin: 6px;
  z-index: 1;
  cursor: pointer;

  width: 18px;
  height: 18px;
  background-color: transparent;
  border: 1px solid var(--md-sys-color-outline);
  appearance: none;
  border-radius: 2px;

  &:hover {
    border-color: var(--color-table-boolean-border);
  }

  &:checked {
    background-color: var(--md-sys-color-primary);
    border-color: var(--md-sys-color-primary);
    appearance: auto;
  }

  ${fieldSubmittingStyles}
`

export interface BooleanFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: boolean
  onChange: (value: boolean) => void
  /** Boolean changes are immediate, so this is called on every change */
  onCommit?: (value: boolean) => void
  /** Render a checkbox instead of a switch */
  checkbox?: boolean
  align?: 'left' | 'right'
  isSubmitting?: boolean
  isReadOnly?: boolean
}

export const BooleanField = forwardRef<HTMLInputElement, BooleanFieldProps>(
  (
    {
      value,
      onChange,
      onCommit,
      isSubmitting = false,
      isReadOnly = false,
      checkbox = false,
      align = 'left',
      disabled,
      className,
      title,
      ...props
    },
    ref,
  ) => {
    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
    ) => {
      // InputSwitch also calls onChange on Enter, where the checkbox has not toggled yet
      const next = event.type === 'keydown' ? !value : (event.target as HTMLInputElement).checked
      onChange(next)
      onCommit?.(next)
    }

    const inputProps = {
      ...props,
      ref,
      checked: Boolean(value),
      disabled: disabled || isReadOnly,
      'data-tooltip': title,
      className: clsx(className, { submitting: isSubmitting }),
    }

    return (
      <StyledContainer className={clsx(align, { 'read-only': isReadOnly })}>
        {checkbox ? (
          <StyledCheckbox type="checkbox" {...inputProps} onChange={handleChange} />
        ) : (
          <StyledSwitch {...inputProps} onChange={handleChange} />
        )}
      </StyledContainer>
    )
  },
)
BooleanField.displayName = 'BooleanField'
