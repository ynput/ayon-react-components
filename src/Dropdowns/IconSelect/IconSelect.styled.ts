import styled, { css } from 'styled-components'

interface IconStyledProps {
  $valueTemplate?: boolean
  $isActive?: boolean
}

export const Icon = styled.div<IconStyledProps>`
  display: flex;
  align-items: center;
  /* justify-content: center; */

  gap: 8px;
  padding-left: 0.5rem;

  height: 30px;

  span:last-child {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* valueTemplate */
  ${({ $valueTemplate }) =>
    $valueTemplate
      ? css`
          border: 1px solid var(--md-sys-color-outline-variant);
          border-radius: var(--border-radius-m);

          width: 150px;
        `
      : css`
          width: 100%;
        `}

  /* isActive */
      ${({ $isActive }) =>
    $isActive &&
    css`
      background: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
    `}
`
