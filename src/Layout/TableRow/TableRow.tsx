import * as Styled from './TableRow.styled'
import { OverflowField } from '../OverflowField'
import { forwardRef } from 'react'

export interface TableRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onCopy'> {
  name?: string
  value?: string | number | React.ReactNode
  tooltip?: string
  onCopy?: (value: string) => void
}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ name, value, tooltip, onCopy, ...props }, ref) => {
    return (
      <Styled.AttributeTableRow ref={ref} {...props}>
        <Styled.Title $tooltip={tooltip}>{name}</Styled.Title>
        {value ? <OverflowField value={value} onClick={onCopy} /> : '-'}
      </Styled.AttributeTableRow>
    )
  },
)
