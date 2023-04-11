import { InputHTMLAttributes, forwardRef } from 'react'
import StyledInput from '../styles'

export const InputText = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <StyledInput type="text" ref={ref} {...props} />,
)
InputText.displayName = 'InputText'
