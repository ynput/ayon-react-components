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
    font-style: italic;
    cursor: not-allowed;
    border-style: dashed;
  }
`

const InputText = ({ className, value, onChange, placeholder, disabled, tooltip }) => {
  return (
    <StyledInput
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      type="text"
      title={tooltip}
    />
  )
}

const InputTextarea = styled.textarea`
  color: var(--color-text);
  border: 1px solid var(--color-grey-03);
  background-color: var(--color-grey-00);
  border-radius: var(--base-input-border-radius);
  min-height: var(--base-input-size);
  max-height: calc(var(--base-input-size) * 4);
  padding: 6px 5px;
  resize: vertical;

  &:focus {
    outline: 1px solid var(--color-hl-00);
  }

  &.error {
    border-color: var(--color-hl-error);
  }
`

const Password = ({ className, value, onChange, placeholder, disabled, tooltip }) => {
  return (
    <StyledInput
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      type="password"
      title={tooltip}
    />
  )
}

export { InputText, InputTextarea, Password }
