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

  &[type='number'] {
    padding-right: 0;
  }
  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    // opacity: 1;
    height: var(--base-input-size);
    background-color: var(--color-grey-02);
  }
`

export default StyledInput
