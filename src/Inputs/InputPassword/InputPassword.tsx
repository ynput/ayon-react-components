import { InputHTMLAttributes, forwardRef } from 'react'
import StyledInput from '../styles'

export const InputPassword = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <StyledInput type="password" ref={ref} {...props} />,
)
InputPassword.displayName = 'InputPassword'
