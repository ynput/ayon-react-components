import styled from 'styled-components'
import { Button } from '../Button'

export const ButtonWrapper = styled(Button)`
  padding: 6px;
  border-radius: var(--border-radius-l);
  max-height: 32px;

  .label {
    flex: 1;
    text-align: left;
  }

  /* Default unselected state is the same for all variants */

  input {
    pointer-events: none;
  }

  /* Primary variant (default) selected state */
  &.selected,
  &.primary.selected {
    background-color: var(--md-sys-color-on-primary);
    color: var(--md-sys-color-primary);

    &:hover {
      background-color: var(--md-sys-color-on-primary-hover);
    }

    &:active {
      background-color: var(--md-sys-color-on-primary-active);
    }

    &:disabled:hover {
      background-color: var(--md-sys-color-on-primary);
    }

    /* Style for primary switch */
    .switch-body {
      input:checked + .slider {
        background-color: var(--md-sys-color-primary);
        border-color: var(--md-sys-color-primary);
        &::before {
          background-color: var(--md-sys-color-on-primary);
        }
        &:hover {
          &::before {
            background-color: var(--md-sys-color-on-primary-hover);
          }
        }
      }
    }
  }

  /* Secondary variant selected state */
  &.secondary.selected {
    background-color: var(--md-sys-color-on-secondary);
    color: var(--md-sys-color-secondary);

    &:hover {
      background-color: var(--md-sys-color-on-secondary-hover);
    }

    &:active {
      background-color: var(--md-sys-color-on-secondary-active);
    }

    &:disabled:hover {
      background-color: var(--md-sys-color-on-secondary);
    }
  }

  /* Tertiary variant selected state */
  &.tertiary.selected {
    background-color: var(--md-sys-color-on-tertiary);
    color: var(--md-sys-color-tertiary);

    &:hover {
      background-color: var(--md-sys-color-on-tertiary-hover);
    }

    &:active {
      background-color: var(--md-sys-color-on-tertiary-active);
    }

    &:disabled:hover {
      background-color: var(--md-sys-color-on-tertiary);
    }

    /* Style for tertiary switch */
    .switch-body {
      input:checked + .slider {
        background-color: var(--md-sys-color-tertiary);
        border-color: var(--md-sys-color-tertiary);
        &::before {
          background-color: var(--md-sys-color-on-tertiary);
        }
        &:hover {
          &::before {
            background-color: var(--md-sys-color-on-tertiary-hover);
          }
        }
      }
    }
  }
`
