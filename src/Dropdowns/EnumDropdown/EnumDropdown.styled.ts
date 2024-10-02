import styled, { css } from 'styled-components'
import { DefaultValueTemplate } from '../Dropdown'

interface IconStyledProps {
  $color?: string
}

const getSelectedBg = ({ $color }: IconStyledProps) => {
  if ($color)
    return css`
      background: ${$color};
      &:hover {
        filter: brightness(1.1);
      }
      .value-label,
      .icon {
        color: var(--md-sys-color-inverse-on-surface);
      }
    `
  else
    return css`
      background: var(--md-sys-color-primary-container);
      &:hover {
        background: var(--md-sys-color-primary-container-hover);
      }
      .value-label,
      .icon {
        color: var(--md-sys-color-on-primary-container);
      }
    `
}

export const StyledDefaultValueTemplate = styled(DefaultValueTemplate)<IconStyledProps>`
  padding-left: 0;

  &.inverse {
    ${({ $color }) => getSelectedBg({ $color })}
    border-color: ${({ $color }) => $color && 'transparent'};
  }
`

export const Option = styled.div<IconStyledProps>`
  display: flex;
  align-items: center;
  /* justify-content: center; */

  gap: 8px;
  padding-left: 0.5rem;

  height: 32px;

  span:last-child {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  width: 100%;

  .value-label,
  .icon {
    color: ${({ $color }) => ($color ? $color : `var(--md-sys-color-on-surface)`)};
  }

  &.selected {
    ${({ $color }) => getSelectedBg({ $color })}
  }
`
