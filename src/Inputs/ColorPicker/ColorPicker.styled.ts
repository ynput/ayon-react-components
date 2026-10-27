import styled, { css } from 'styled-components'

export const ColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`

const swatch = css`
  width: 20px;
  height: 20px;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;

  &:hover,
  &:focus-visible,
  &.selected {
    outline: 2px solid var(--md-sys-color-on-surface);
    outline-offset: 2px;
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
  border: 1px solid var(--md-sys-color-outline-variant);
`

// opens the browser's colour picker, the input covers it
export const CustomSwatch = styled.label`
  ${swatch}
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--md-sys-color-outline);

  .icon {
    font-size: 14px;
  }

  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: inherit;
  }

  &:focus-within {
    outline: 2px solid var(--md-sys-color-on-surface);
    outline-offset: 2px;
  }
`
