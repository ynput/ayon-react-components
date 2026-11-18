import styled, { css } from 'styled-components'
import { StatusSize } from './StatusField'
import { getTextColor } from '../../../helpers'

// text on the status colour; a status without one has a theme colour, which follows the theme
const textOn = (color: string) =>
  color.startsWith('var(') ? 'var(--md-sys-color-on-surface)' : getTextColor(color)

// the whole field filled with the status colour
const invertHoverStyle = css<{ $color: string }>`
  background-color: ${({ $color }) => $color};
  color: ${({ $color }) => textOn($color)};
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
    font-variation-settings: 'FILL' 1;
    /* always takes parents color */
    color: inherit;
  }

  border-radius: var(--border-radius-m);
  /* same height as a row */
  height: 27px;
  min-height: 27px;

  /* the status colour is a block behind the icon and name, never their colour, so it reads on any surface */
  .status-texticon {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 6px;
    border-radius: var(--border-radius-m);
    background-color: ${({ $color }) => $color};
    color: ${({ $color }) => textOn($color)};
  }

  .status-text {
    padding-right: 2px;
    &:empty {
      display: none;
    }
  }

  color: var(--md-sys-color-on-surface);
  background-color: transparent;

  /* filled as a whole: the block inside it has nothing to add */
  &.changed,
  &.changing:not(.selecting),
  &.invert {
    .status-texticon {
      background-color: transparent;
      color: inherit;
      padding-left: 0;
      padding-right: 0;
    }
  }

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

  &:hover {
    filter: brightness(110%);
  }

  /* the current status in the list */
  &.active.selecting {
    background-color: var(--md-sys-color-primary-container);
    [icon='expand_more'] {
      transform: rotate(180deg);
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

      /* the icon alone: a square block with even padding */
      .status-texticon {
        margin: auto;
        padding: 2px;
        aspect-ratio: 1;
        justify-content: center;
      }
    `}
`
