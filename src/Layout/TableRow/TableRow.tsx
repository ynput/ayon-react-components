import * as Styled from './TableRow.styled'
import { OverflowField } from '../OverflowField'
import { forwardRef, isValidElement } from 'react'
import { InputSwitch } from '../../Inputs/InputSwitch'
import { Icon } from '../../Icon'

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
    else if (type === 'object' && Array.isArray(value)) value = value?.join(', ')
    else if (type === 'object' && !value?.$$typeof && !isValidElement(value) && value)
      value = JSON.stringify(value)
    else if (type === 'date') value = new Date(value).toLocaleDateString()

    // check if there are any children
    const hasChildren = children !== undefined

    return (
      <Styled.AttributeTableRow ref={ref} {...props}>
        <Styled.Title $tooltip={tooltip}>{name}</Styled.Title>
        {!hasChildren &&
          (type === 'boolean' ? (
            <InputSwitch checked={!!value} compact disabled />
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
