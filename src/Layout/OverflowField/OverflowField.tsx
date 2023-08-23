import * as Styled from './OverflowField.styled'
import { forwardRef, isValidElement } from 'react'

export interface OverflowFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  value?: string | number | React.ReactNode
  align?: 'left' | 'right'
  onClick?: (value: string) => void
}

export const OverflowField = forwardRef<HTMLDivElement, OverflowFieldProps>(
  ({ value = '', style, align = 'right', onClick }, ref) => {
    let isNode = false

    //   check if value is a react node
    if (value && typeof value === 'object' && !Array.isArray(value) && isValidElement(value)) {
      isNode = true
    }

    return (
      <Styled.OverflowField style={style} $align={align} $isNode={isNode} ref={ref}>
        {isNode ? value : <Styled.OverflowString>{value}</Styled.OverflowString>}
        {!isNode && (
          <Styled.RevealString
            onClick={() => value && onClick && onClick(value.toString())}
            $align={align}
          >
            {value}
          </Styled.RevealString>
        )}
      </Styled.OverflowField>
    )
  },
)
