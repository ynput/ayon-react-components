import styled from 'styled-components'
import { Button } from '../../Button'
import { AssigneeSelect } from '../AssigneeSelect'

export const StyledAssigneeSelect = styled(AssigneeSelect)`
  button {
    width: fit-content;
  }
`

export const StyledButton = styled(Button)`
  &.text {
    width: fit-content;
  }

  &.selected {
    background-color: unset;
    color: var(--md-sys-color-primary);

    .icon {
      font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 200, 'opsz' 20;
    }

    &:hover {
      color: var(--md-sys-color-primary-hover);
    }
  }
`
