import React, { forwardRef } from 'react'
import { InputSwitch, InputSwitchProps } from '../../Inputs/InputSwitch'
import * as Styled from './SwitchButton.styled'
import { ButtonProps } from '../Button'
import clsx from 'clsx'

export interface SwitchButtonProps
  extends Omit<ButtonProps, 'onChange' | 'label' | 'value' | 'variant'> {
  label: React.ReactNode
  value: boolean
  disabled?: boolean
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'tertiary'
  pt?: {
    switch?: InputSwitchProps
  }
}

export const SwitchButton = forwardRef<HTMLButtonElement, SwitchButtonProps>(
  ({ variant = 'primary', label, value, disabled, className, onClick, pt, ...props }, ref) => {
    const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
      // prevent click events from input
      if (e.target instanceof HTMLElement && e.target.tagName === 'INPUT') return

      onClick()
    }

    return (
      <Styled.ButtonWrapper
        {...props}
        ref={ref}
        className={clsx(className, variant, { selected: value })}
        disabled={disabled}
        onClick={handleChange}
      >
        <span className="label">{label}</span>
        <InputSwitch checked={value} disabled={disabled} readOnly {...pt?.switch} />
      </Styled.ButtonWrapper>
    )
  },
)
