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

export { InputText, Password }
