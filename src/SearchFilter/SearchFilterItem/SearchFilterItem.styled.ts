import styled from 'styled-components'
import { Button, theme } from '../..'

export const FilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--base-gap-small);
  user-select: none;
  white-space: nowrap;

  background-color: var(--md-sys-color-surface-container-high);
  padding: 2px 4px;
  /* padding-right: 8px; */
  border-radius: 4px;

  cursor: pointer;
  &:hover {
    background-color: var(--md-sys-color-surface-container-high-hover);

    .button {
      background-color: var(--md-sys-color-surface-container-highest-hover);
    }
  }

  &.editing {
    outline: 2px solid #99c8ff;
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`

export const Operator = styled.span`
  ${theme.labelSmall}
  display: flex;
  align-items: center;
  gap: 4px;

  .clickable {
    cursor: pointer;
    text-decoration: underline;
    border-radius: 4px;
    padding: 0 2px;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--md-sys-color-surface-container-high-hover);
    }
  }
`

export const ChipInput = styled.input`
  appearance: none;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  padding: 0;
  margin: 0;
  min-width: 40px;
  width: var(--chip-input-width, 60px);

  &:focus {
    outline: none;
  }
`

export const ChipButton = styled(Button)`
  border-radius: 50%;
  background-color: unset;

  &:hover:not(.disabled) {
    &.button {
      background-color: var(--md-sys-color-primary);
    }
    .icon {
      color: var(--md-sys-color-on-primary);
    }
  }

  &.hasIcon {
    padding: 2px;
  }

  .icon {
    font-size: 16px;
  }
`
