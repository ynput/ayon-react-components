import * as Styled from './TableRow.styled'
import { OverflowField } from '../OverflowField'
import { forwardRef } from 'react'
import { InputSwitch } from '../../Inputs/InputSwitch'

export interface TableRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onCopy'> {
  name?: string
  value?: any
  tooltip?: string
  onCopy?: (value: string) => void
  type?: string
}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ name, value, tooltip, type, onCopy, children, ...props }, ref) => {
    type = type || typeof value
    if (type === 'number') value = value?.toString()
    if (type === 'array') value = value?.join(', ')
    if (type === 'object') value = JSON.stringify(value)
    if (type === 'date') value = new Date(value).toLocaleDateString()

    // check if there are any children
    const hasChildren = children !== undefined

    return (
      <Styled.AttributeTableRow ref={ref} {...props}>
        <Styled.Title $tooltip={tooltip}>{name}</Styled.Title>
        {!hasChildren &&
          (type === 'boolean' ? (
            <InputSwitch checked={value as boolean} disabled compact />
          ) : value ? (
            <OverflowField value={value} onClick={onCopy} />
          ) : (
            '-'
          ))}
        {children}
      </Styled.AttributeTableRow>
    )
  },
)
