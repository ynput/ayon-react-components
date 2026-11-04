import styled, { css } from 'styled-components'

export const ColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`

// the ring sits inside the gap, so a marked swatch doesn't touch its neighbours
const swatch = css`
  position: relative;
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: var(--border-radius-l);
  border: 1px solid var(--md-sys-color-outline-variant);
  cursor: pointer;

  &:hover,
  &:focus-visible,
  &:focus-within,
  &.selected {
    outline: 2px solid var(--md-sys-color-on-surface);
    outline-offset: 1px;
  }

  &:disabled,
  &.disabled {
    cursor: default;
    opacity: 0.5;
    outline: none;
  }
`

export const Swatch = styled.button`
  ${swatch}
`

// opens the browser's colour picker, the input covers it; filled with the colour picked there
export const CustomSwatch = styled.label`
  ${swatch}
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--md-sys-color-surface-container-high);
  border-style: dashed;
  border-color: var(--md-sys-color-outline);

  &.selected {
    border-style: solid;
    border-color: var(--md-sys-color-outline-variant);
  }

  .icon {
    font-size: 16px;
    color: inherit;
  }

  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: inherit;
  }
`
