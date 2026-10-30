import { css } from 'styled-components'

// Defaults for the field CSS variables. Apply to a form container to tune all fields inside it.
export const fieldVariables = css`
  --field-input-radius: var(--border-radius-m);
  --field-chip-radius: var(--border-radius-l);
  --field-input-padding-x: var(--padding-m);
  --field-input-padding-y: 6px;
  --field-row-padding-x: 4px;
  --field-row-padding-y: 2px;
  --field-control-height: 24px;
  --field-label-height: 32px;
  --field-control-color: var(--md-sys-color-on-surface);
  --field-placeholder-color: var(--md-sys-color-outline);
  --field-border-color: var(--md-sys-color-outline-variant);
  --field-hover-color: var(--md-sys-color-surface-container-low-hover);
`

export const inputHoverStyles = css`
  background-color: var(--field-hover-color, var(--md-sys-color-surface-container-low-hover));
`

export const roundedFieldSurfaceStyles = css`
  border-radius: var(--field-input-radius, var(--border-radius-m));
`

export const formControlInteractiveStyles = css`
  &:hover {
    ${inputHoverStyles}
  }
  &:focus-visible {
    box-shadow: var(--md-sys-color-primary) 0px 0px 0px 1px inset;
  }
`

export const formControlBaseStyles = css`
  min-width: 0;
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--field-border-color, var(--md-sys-color-outline-variant));
  color: var(--field-control-color, var(--md-sys-color-on-surface));
  font: inherit;
  outline: none;
  ${roundedFieldSurfaceStyles}

  /* Variant: remove border only */
  &.no-border {
    border: none;
  }

  /* Variant: remove background only */
  &.no-background {
    background-color: transparent;
  }

  /* Variant: remove both border and background */
  &.ghost {
    border: none;
    background-color: transparent;
  }

  ${formControlInteractiveStyles}
`

export const formControlPlaceholderStyles = css`
  &::placeholder {
    color: var(--field-placeholder-color, var(--md-sys-color-outline));
  }
`

export const textInputStyles = css`
  width: 100%;
  ${formControlBaseStyles}
  ${formControlPlaceholderStyles}
`

export const fieldSubmittingStyles = css`
  &.submitting {
    user-select: none;
    pointer-events: none;
  }
`

export const fieldLoadingStyles = css`
  /* uses the .loading shimmer that's already built in */
  overflow: hidden;
  border-radius: var(--border-radius-m);
`

export const paddedInputStyles = css`
  min-height: var(--field-control-height, 24px);
  padding: var(--field-input-padding-y, 6px) var(--field-input-padding-x, 6px);
`

export const readOnlyValueStyles = css`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  min-height: var(--field-control-height, 24px);
  padding: var(--field-input-padding-y, 6px) var(--field-input-padding-x, 6px);
  color: var(--field-control-color, var(--md-sys-color-on-surface));
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`

export const compactFieldRowStyles = css`
  padding: var(--field-row-padding-y, 2px) var(--field-row-padding-x, 4px);
  ${roundedFieldSurfaceStyles}
`

const dropdownNoBackgroundStyles = css`
  &.dropdown {
    button {
      background-color: unset;

      &:hover {
        ${inputHoverStyles}
      }
    }
  }
`

const dropdownNoBorderStyles = css`
  .template-value {
    border: none;
  }
`

export const dropdownVariantStyles = css`
  &.no-background {
    ${dropdownNoBackgroundStyles}
  }

  &.no-border {
    ${dropdownNoBorderStyles}
  }

  &.ghost {
    ${dropdownNoBackgroundStyles}
    ${dropdownNoBorderStyles}
    .icon.control {
      display: none;
      color: var(--field-placeholder-color, var(--md-sys-color-outline));
    }
  }
`

export const searchInputResetStyles = css`
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }
`
