import styled, { css } from 'styled-components'

export const AttributeTableRow = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
  gap: 8px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  width: 100%;
  &:first-child {
    border-top: none !important;
  }
`

export const Title = styled.span`
  white-space: nowrap;
  position: relative;

  /* when tooltip not null */
  ${({ $tooltip }: { $tooltip?: string }) =>
    $tooltip &&
    css`
      /* show $tooltip on hover as ::after */
      &:hover::after {
        content: '${$tooltip}';
        display: block;
        position: absolute;
        top: -38px; /* adjust as needed */
        left: 0;
        padding: 8px;
        background-color: var(--md-sys-color-surface-container-high);
        color: white;
        border-radius: 3px;
        z-index: 1;
        user-select: none;
        pointer-events: none;
        box-shadow: 0 0 8px 0 rgb(0 0 0 / 20%);
      }
    `}
`
