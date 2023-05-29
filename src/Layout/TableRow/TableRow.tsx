import styled, { css } from 'styled-components'
import { OverflowField } from '../OverflowField'
import { forwardRef } from 'react'

const AttributeTableRow = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
  gap: 8px;
  border-top: 1px solid var(--color-grey-01);
  &:first-child {
    border-top: none !important;
  }
`

const TitleStyled = styled.span`
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
        background-color: var(--color-grey-01);
        color: white;
        border-radius: 3px;
        z-index: 1;
        user-select: none;
        pointer-events: none;
        box-shadow: 0 0 8px 0 rgb(0 0 0 / 20%);
      }
    `}
`

export interface TableRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onCopy'> {
  name?: string
  value?: string | number | React.ReactNode
  tooltip?: string
  onCopy?: (value: string) => void
}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ name, value, tooltip, onCopy, ...props }, ref) => {
    return (
      <AttributeTableRow ref={ref} {...props}>
        <TitleStyled $tooltip={tooltip}>{name}</TitleStyled>
        {value ? <OverflowField value={value} onClick={onCopy} /> : '-'}
      </AttributeTableRow>
    )
  },
)
