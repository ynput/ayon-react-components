import styled, { css } from 'styled-components'

// TYPES
export type ButtonProps = {
  label?: string
  $link?: boolean
  $icon?: boolean
}

// STYLES
export const Button = styled.button<ButtonProps>`
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
  padding: 6px 16px;
  padding-left: ${({ $icon }) => ($icon ? '12px' : '16px')};
  /* icon only */
  ${({ $icon, label }) =>
    $icon &&
    !label &&
    css`
      padding: 6px;
    `}

  /* border radius */
  border-radius: var(--base-input-border-radius);

  cursor: pointer;
  white-space: nowrap;

  /* DEFAULTS */
  background-color: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface);

  &:hover {
    background-color: var(--md-sys-color-surface-container-highest-hover);
  }
  &:active {
    background-color: var(--md-sys-color-surface-container-highest-active);
  }

  &.surface,
  &.tonal,
  &.filled,
  &.text {
    /* selected default */
    &.selected {
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);

      &:hover {
        background-color: var(--md-sys-color-primary-container-hover);
      }
    }
  }

  &:disabled {
    opacity: 0.5;
  }

  /* DEFAULTS */

  /* SURFACE: surface-container */
  &.surface {
    background-color: var(--md-sys-color-surface-container-highest);
    color: var(--md-sys-color-on-surface);

    &:hover {
      background-color: var(--md-sys-color-surface-container-highest-hover);
    }
    &:active {
      background-color: var(--md-sys-color-surface-container-highest-active);
    }

    /* disabled default */
    &:disabled {
      opacity: 0.5;

      /* remove hover and active styles */
      &:hover,
      &:active {
        background-color: var(--md-sys-color-surface-container-highest);
      }
    }
  }
  /* TONAL = secondary-container */
  &.tonal {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);

    &:hover {
      background-color: var(--md-sys-color-secondary-container-hover);
    }
    &:active {
      background-color: var(--md-sys-color-secondary-container-active);
    }
    &:disabled {
      background-color: var(--md-sys-color-secondary-container);
    }
  }

  /* FILLED = primary */
  &.filled {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);

    &:hover {
      background-color: var(--md-sys-color-primary-hover);
    }
    &:active {
      background-color: var(--md-sys-color-primary-active);
    }
    &:disabled {
      background-color: var(--md-sys-color-primary);
    }
  }

  /* FILLED = primary */
  &.nav {
    border: 1px solid transparent;
    background-color: transparent;
    color: var(--md-sys-color-on-surface);

    &:hover {
      background-color: var(--md-sys-color-background);
    }
    &:active,
    &.selected {
      background-color: var(--md-sys-color-background);
      border-color: var(--md-sys-color-outline-variant);
    }

    &:disabled {
      border: 1px solid transparent;
      background-color: transparent;
    }
  }

  /* TEXT = surface-container */
  &.text {
    background-color: transparent;

    &:hover {
      background-color: var(--md-sys-color-surface-container-hover);
    }

    &:disabled {
      background-color: transparent;
    }
  }

  /* TERTIARY = secondary-container */
  &.tertiary {
    background-color: var(--md-sys-color-tertiary);
    color: var(--md-sys-color-on-tertiary);

    &:hover {
      background-color: var(--md-sys-color-tertiary-hover);
    }
    &:active {
      background-color: var(--md-sys-color-tertiary-active);
    }

    &.selected {
      background-color: var(--md-sys-color-tertiary-container);
      color: var(--md-sys-color-on-tertiary-container);

      &:hover {
        background-color: var(--md-sys-color-tertiary-container-hover);
      }

      &:active {
        background-color: var(--md-sys-color-tertiary-container-active);
      }
    }

    &:disabled {
      background-color: var(--md-sys-color-tertiary);
    }
  }

  /* icon color should inherit color */
  .icon {
    color: inherit;
  }
`
