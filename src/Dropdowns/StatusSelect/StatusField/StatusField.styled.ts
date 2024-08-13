import styled, { css } from 'styled-components'
import { StatusSize } from './StatusField'

const hoverStyle = css<{ $color: string }>`
  background-color: var(--md-sys-color-surface-container-low-hover);
  color: ${({ $color }) => $color};
`

const invertHoverStyle = css<{ $color: string }>`
  /* flips the bg color for text color */
  background-color: ${({ $color }) => $color};
  color: black;
`
const defaultStyle = css<{ $color: string }>`
  /* default text color */
  color: ${({ $color }) => $color};
  background-color: transparent;
`

type StatusStyledProps = {
  $color: string
  $size: StatusSize
}

export const StatusStyled = styled.div<StatusStyledProps>`
  display: flex;
  align-items: center;
  gap: var(--base-gap-small);
  font-size: var(--base-font-size);
  position: relative;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 8px;
  justify-content: space-between;
  max-height: 160px;
  width: 100%;

  /* STATUS ICON */
  .status-icon {
    font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 300, 'opsz' 20;
    /* always takes parents color */
    color: inherit;
  }

  border-radius: var(--border-radius-m);
  /* same height as a row */
  height: 27px;
  min-height: 27px;

  .status-texticon {
    display: flex;
  }

  .status-text {
    margin-left: 8px;
  }

  ${defaultStyle}

  &.changed {
    background-color: var(--md-sys-color-primary);

    &,
    span,
    .icon {
      color: var(--md-sys-color-on-primary);
    }

    &:hover {
      background-color: var(--md-sys-color-primary-hover);
    }
  }

  &.selecting {
    border-radius: 0;
    height: 27px;
    min-height: 27px;
  }

  /* Only happens when a change has been made and dropdown closed */
  /* or invert prop */
  &.changing:not(.selecting),
  &.invert {
    ${invertHoverStyle}
  }

  /* sets for hover and when active whilst open (top one) */
  &:hover {
    /* ${hoverStyle} */
    filter: brightness(110%);
  }

  &.active.selecting {
    ${invertHoverStyle}

    &:hover {
      ${invertHoverStyle}
    }
    [icon='expand_more'] {
      transform: rotate(180deg);
      ${invertHoverStyle}
    }
  }

  /* ICON ONLY STYLES */
  ${({ $size }) =>
    $size === 'icon' &&
    css`
      width: 100%;

      span {
        margin: auto;
      }
    `}
`
