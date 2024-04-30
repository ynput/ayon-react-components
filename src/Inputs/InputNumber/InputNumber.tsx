import { InputHTMLAttributes, forwardRef } from 'react'
import { StyledInput } from '../styles'

export const InputNumber = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <StyledInput type="number" ref={ref} {...props} />,
)
InputNumber.displayName = 'InputNumber'
