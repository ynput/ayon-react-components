import styled, { css } from 'styled-components'

export const Item = styled.div<{ $disabled: boolean; $isSelected: boolean }>`
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  white-space: nowrap;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
    `}

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background: var(--md-sys-color-primary-container);
    `}
`
