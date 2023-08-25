import styled, { css } from 'styled-components'

// TYPES
export type ButtonProps = {
  label?: string
  $link?: boolean
  $icon?: boolean
  $variant: 'surface' | 'tonal' | 'filled' | 'text' | 'tertiary' | 'nav'
  $selected: boolean
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
  &:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
  }

  &:disabled {
    opacity: 0.5;
  }

  /* SURFACE: surface-container */
  ${({ $variant }) =>
    $variant === 'surface' &&
    css`
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
    `}

  /* TONAL = secondary-container */
  ${({ $variant }) =>
    $variant === 'tonal' &&
    css`
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
    `}

  /* FILLED = primary */
  ${({ $variant }) =>
    $variant === 'filled' &&
    css`
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
      &:focus-visible {
        outline-color: white;
      }
    `}

  /* NAV = primary */
  ${({ $variant, $selected }) =>
    $variant === 'nav' &&
    css`
      border: 1px solid transparent;
      background-color: transparent;
      color: var(--md-sys-color-on-surface);

      &:hover {
        background-color: var(--md-sys-color-background);
      }
      &:active {
        background-color: var(--md-sys-color-background);
        border-color: var(--md-sys-color-outline-variant);
      }

      ${$selected &&
      css`
        background-color: var(--md-sys-color-background);
        border-color: var(--md-sys-color-outline-variant);
      `}

      &:disabled {
        border: 1px solid transparent;
        background-color: transparent;
      }
    `}

  /* TEXT = surface-container */
  ${({ $variant }) =>
    $variant === 'text' &&
    css`
      background-color: transparent;

      &:hover {
        background-color: var(--md-sys-color-surface-container-highest-hover);
      }
      &:active {
        background-color: var(--md-sys-color-surface-container-highest-active);
      }

      &:disabled {
        background-color: transparent;
      }
    `}

  /* TERTIARY = secondary-container */
  ${({ $variant, $selected }) =>
    $variant === 'tertiary' &&
    css`
      background-color: var(--md-sys-color-tertiary);
      color: var(--md-sys-color-on-tertiary);

      &:hover {
        background-color: var(--md-sys-color-tertiary-hover);
      }
      &:active {
        background-color: var(--md-sys-color-tertiary-active);
      }
      &:focus-visible {
        outline-color: white;
      }

      ${$selected &&
      css`
        background-color: var(--md-sys-color-tertiary-container);
        color: var(--md-sys-color-on-tertiary-container);

        &:hover {
          background-color: var(--md-sys-color-tertiary-container-hover);
        }

        &:active {
          background-color: var(--md-sys-color-tertiary-container-active);
        }
      `}

      &:disabled {
        background-color: var(--md-sys-color-tertiary);
      }
    `}

  /* selection */
  ${({ $variant, $selected }) =>
    $selected &&
    ['surface', 'tonal', 'filled', 'text'].includes($variant) &&
    css`
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);

      &:hover {
        background-color: var(--md-sys-color-primary-container-hover);
      }
    `}

  /* icon color should inherit color */
  .icon {
    color: inherit;
  }
`
