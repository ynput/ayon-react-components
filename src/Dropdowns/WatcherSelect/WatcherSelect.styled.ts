import styled, { keyframes } from 'styled-components'
import { Button } from '../../Button'
import { AssigneeSelect as AS } from '../AssigneeSelect'

export const AssigneeSelect = styled(AS)`
  button.button {
    width: fit-content;
  }
`

export const WatcherButton = styled(Button)`
  &.text {
    width: fit-content;
  }

  &.watching {
    background-color: unset;
    color: var(--md-sys-color-primary);
    &:hover {
      color: var(--md-sys-color-primary-hover);
    }
    .icon {
      font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 200, 'opsz' 20;
    }
  }

  &.selected {
    background-color: var(--md-sys-color-primary-container-hover);
  }
`

export const StartContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--base-gap-small);
`

export const WatchStateButton = styled(Button)`
  justify-content: flex-start;
  background-color: unset;

  &.selected {
    &:hover {
      background-color: var(--md-sys-color-primary-container);
    }
  }

  [icon='notifications_active'] {
    font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 200, 'opsz' 20;
  }
`
