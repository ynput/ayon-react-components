import { forwardRef } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  color: var(--color-text);
  border: 1px solid var(--color-grey-03);
  background-color: var(--color-grey-00);
  border-radius: var(--base-input-border-radius);
  min-height: var(--base-input-size);
  max-height: var(--base-input-size);
  padding: 0 5px;

  &:focus {
    outline: 1px solid var(--color-hl-00);
  }

  &.error {
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

const InputText = forwardRef(
  ({ className, value, onChange, placeholder, disabled, tooltip, style }, ref) => (
    <StyledInput
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      type="text"
      title={tooltip}
      style={style}
      ref={ref}
    />
  ),
)
InputText.displayName = 'InputText'

const Password = forwardRef(
  ({ className, value, onChange, placeholder, disabled, tooltip, style }, ref) => (
    <StyledInput
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      type="password"
      title={tooltip}
      style={style}
      ref={ref}
    />
  ),
)
Password.displayName = 'Password'

const InputTextarea = styled.textarea`
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

  &.error {
    border-color: var(--color-hl-error);
  }
`

export { InputText, InputTextarea, Password }
