import styled from 'styled-components'
import { AssigneeSelect as AS } from '../AssigneeSelect'
import { theme } from '../..'

export const AssigneeSelect = styled(AS)`
  button.button {
    width: fit-content;
  }
`

export const WatcherButton = styled.div`
  user-select: none;
  /* button reset */
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  height: max-content;

  /* layout */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: var(--base-gap-large);
  /* padding */
  padding: 6px;

  /* border radius */
  border-radius: var(--base-input-border-radius);

  cursor: pointer;
  white-space: nowrap;

  &.text {
    width: fit-content;
  }

  &.watching {
    background-color: unset;
    .icon {
      color: var(--md-sys-color-primary);
      font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 200, 'opsz' 20;
    }
  }

  &.open {
    background-color: var(--md-sys-color-primary-container-hover);
  }
`

export const StartContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--base-gap-small);
`

export const WatchStateButton = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--base-gap-large);

  /* padding */
  padding: 6px 12px;

  /* border radius */
  border-radius: var(--base-input-border-radius);

  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: var(--md-sys-color-surface-container-hover);
  }

  &:active {
    background-color: var(--md-sys-color-surface-container-active);
  }
  &:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
  }

  &.selected {
    background-color: var(--md-sys-color-primary-container);
    &,
    .icon {
      color: var(--md-sys-color-on-primary-container);
    }
    &:hover {
      background-color: var(--md-sys-color-primary-container);
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .title {
      ${theme.labelLarge}
    }

    .description {
      ${theme.labelSmall}
      color: var(--md-sys-color-outline)
    }
  }

  [icon='notifications_active'] {
    font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 200, 'opsz' 20;
  }
`
