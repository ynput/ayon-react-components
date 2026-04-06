import { forwardRef } from 'react'
import iconSet from './icons.json'
import clsx from 'clsx'
import styled from 'styled-components'

const StyledIcon = styled.span`
  &.filled {
    font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 200, 'opsz' 20;
  }
`

export type IconType = keyof typeof iconSet

// types
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: IconType
  filled?: boolean
}

// TODO: link to SVG

export const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
  return (
    <StyledIcon
      ref={ref}
      {...props}
      className={clsx('material-symbols-outlined icon', props.className, { filled: props.filled })}
    >
      {props.icon}
    </StyledIcon>
  )
})
