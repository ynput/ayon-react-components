import styled from 'styled-components'

const StyledInput = styled.input`
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--border-radius-m);
  min-height: var(--base-input-size);
  max-height: var(--base-input-size);
  padding: 0 8px;

  &:focus {
    outline: 1px solid var(--md-sys-color-primary);
  }

  &.error,
  &:invalid {
    border-color: var(--md-sys-color-error);
  }

  &:disabled {
    opacity: 0.5;
    font-style: italic;
    cursor: not-allowed;
  }

  &[type='number'] {
    padding-right: 0;
  }
  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    height: var(--base-input-size);
    background-color: var(--md-sys-color-surface-container);
  }
`

export default StyledInput
