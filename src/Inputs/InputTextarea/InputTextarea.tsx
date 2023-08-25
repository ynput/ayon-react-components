import { InputHTMLAttributes, forwardRef } from 'react'
import * as Styled from './InputTextarea.styled'

export const InputTextarea = forwardRef<
  HTMLTextAreaElement,
  InputHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => <Styled.Textarea type="text" ref={ref} {...props} />)
InputTextarea.displayName = 'InputTextarea'
