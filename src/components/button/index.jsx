import styled from 'styled-components'

const BaseButton = ({ label, icon, className, onClick, disabled, tooltip }) => {
  const iconElement = icon && <span className="material-symbols-outlined">{icon}</span>

  return (
    <button className={className} onClick={onClick} title={tooltip} disabled={disabled}>
      {iconElement} {label}
    </button>
  )
}

const Button = styled(BaseButton)`
  color: var(--color-text);
  background: var(--button-background);
  min-height: var(--base-input-size);
  max-height: var(--base-input-size);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: var(--base-input-border-radius);
  gap: var(--base-gap-small);
  cursor: pointer;
  padding: 0 10px;
  white-space: nowrap;

  &:hover {
    background: var(--button-background-hover);
  }

  &:active {
    background: var(--button-background-hover);
  }

  &:focus {
    outline: 1px solid var(--color-hl-00);
  }

  &:disabled {
    color: var(--color-text-dim);
    cursor: not-allowed;

    &:hover {
      background: var(--button-background);
    }

    .material-symbols-outlined {
      color: var(--color-text-dim);
    }
  }

  .material-symbols-outlined {
    font-size: 1.5rem;
  }

  // Without a label, button is considered an icon button
  // and should be square.
  ${(props) =>
    !props.label &&
    `
    min-width: var(--base-input-size);
    max-width: var(--base-input-size);
  `}
`

const LinkButton = styled(BaseButton)`
  display: inline-block;
  border: 0;
  background: none;
  color: var(--color-hl-00);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export { Button, LinkButton }
