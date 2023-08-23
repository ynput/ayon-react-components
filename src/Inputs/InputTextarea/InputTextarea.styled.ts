import styled from 'styled-components'

export const Textarea = styled.textarea`
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--border-radius-m);
  min-height: var(--base-input-size);
  padding: 6px 5px;
  resize: vertical;

  &:focus-visible {
    outline: 1px solid var(--md-sys-color-primary);
  }

  &.error,
  &:invalid {
    border-color: var(--md-sys-color-error-container);
  }

  &:disabled {
    opacity: 0.5;
    font-style: italic;
    cursor: not-allowed;
  }
`
