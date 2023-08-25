import styled, { css } from 'styled-components'

export const OverflowField = styled.div<{ $isNode: boolean; $align: string }>`
  position: relative;

  width: 100%;
  display: flex;
  justify-content: ${({ $align }) => ($align === 'left' ? 'flex-start' : 'flex-end')};
  overflow-x: clip;

  span:first-child {
    white-space: nowrap;
  }

  ${({ $isNode }) =>
    !$isNode &&
    css`
      margin-right: 4px;
    `}
`

export const OverflowString = styled.span`
  /* overflow */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  padding: 0 4px;
`

export const RevealString = styled.span<{ $align: string }>`
  position: absolute;
  background-color: var(--md-sys-color-surface-container-high);
  border-radius: var(--border-radius-m);
  right: ${({ $align }) => ($align === 'left' ? 'unset' : 0)};
  left: ${({ $align }) => ($align === 'left' ? 0 : 'unset')};
  word-break: break-all;
  cursor: pointer;
  max-width: 100%;
  z-index: 10;

  transition: height 0.2s;
  overflow-y: hidden;
  height: 18px;

  opacity: 0;
  padding: 0 4px;

  :hover {
    opacity: 1;
    height: auto;
    box-shadow: 0 0 8px 0 rgb(0 0 0 / 20%);
    transition: opacity 0.2s;
  }
`
