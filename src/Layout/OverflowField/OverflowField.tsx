import { Icon, IconType } from '../../Icon'
import * as Styled from './OverflowField.styled'
import { MouseEvent, forwardRef, isValidElement } from 'react'

export interface OverflowFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  value?: string | number | React.ReactNode
  align?: 'left' | 'right'
  onClick?: (value: string, e: MouseEvent<HTMLSpanElement>) => void
  icon?: IconType
  isCopy?: boolean
}

export const OverflowField = forwardRef<HTMLDivElement, OverflowFieldProps>(
  ({ value = '', align = 'right', onClick, icon, isCopy, ...props }, ref) => {
    let isNode = false

    //   check if value is a react node
    if (value && typeof value === 'object' && !Array.isArray(value) && isValidElement(value)) {
      isNode = true
    }

    return (
      <Styled.OverflowField $align={align} $isNode={isNode} ref={ref} {...props}>
        {icon && <Icon icon={icon} />}
        {isNode ? value : <Styled.OverflowString>{value}</Styled.OverflowString>}
        {!isNode && (
          <Styled.RevealString
            onClick={(e) => value && onClick && onClick(value.toString(), e)}
            $align={align}
            $isCopy={!!isCopy}
          >
            {isCopy && <Icon icon="content_copy" className="copy" />}
            {value}
          </Styled.RevealString>
        )}
      </Styled.OverflowField>
    )
  },
)
