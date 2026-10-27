import { forwardRef } from 'react'
import iconSet from './icons.json'
import clsx from 'clsx'
import styled from 'styled-components'

const StyledIcon = styled.span`
  &.filled {
    font-variation-settings: 'FILL' 1;
  }
`

export type IconType = keyof typeof iconSet
// This trick prevents the union from collapsing into 'string'
export type IconPropType = IconType | (string & {})

// types
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: IconPropType
  filled?: boolean
}

// TODO: link to SVG

// `icon` stays on the element, styles and queries select icons by it
export const Icon = forwardRef<HTMLSpanElement, IconProps>(({ filled, ...props }, ref) => {
  return (
    <StyledIcon
      ref={ref}
      {...props}
      className={clsx('material-symbols-outlined icon', props.className, { filled })}
    >
      {props.icon}
    </StyledIcon>
  )
})
