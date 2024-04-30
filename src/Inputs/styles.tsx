import styled, { css } from 'styled-components'

export const StyledInput = styled.input<{ $isHidden?: boolean }>`
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--border-radius-m);
  min-height: var(--base-input-size);
  max-height: var(--base-input-size);
  padding: 0 8px;

  // Password-like conversion of characters to full circles for input type="text"
  ${({ $isHidden }) => $isHidden && `-webkit-text-security: disc;`}

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

export const StyledToggleInput = styled.div`
  display: flex;

  > .eyeIcon {
    position: relative;
    display: flex;
    align-items: center;
    right: 28px;
    cursor: pointer;
    user-select: none;
    color: var(--md-sys-color-outline);
    &:hover { 
      color: var(--md-sys-color-on-surface);
    }
  }
`
