import { InputHTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

const TextareaStyled = styled.textarea`
  color: var(--color-text);
  border: 1px solid var(--color-grey-03);
  background-color: var(--color-grey-00);
  border-radius: var(--base-input-border-radius);
  min-height: var(--base-input-size);
  padding: 6px 5px;
  resize: vertical;

  &:focus {
    outline: 1px solid var(--color-hl-00);
  }

  &.error,
  &:invalid {
    border-color: var(--color-hl-error);
  }

  &:disabled {
    color: var(--color-text-dim);
    background-color: var(--input-disabled-background-color);
    border-color: var(--input-disabled-border-color);
    font-style: italic;
    cursor: not-allowed;
  }
`

export const InputTextarea = forwardRef<
  HTMLTextAreaElement,
  InputHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => <TextareaStyled type="text" ref={ref} {...props} />)
InputTextarea.displayName = 'InputTextarea'
