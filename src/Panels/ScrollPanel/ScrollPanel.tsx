import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'
import { PanelStyled } from '../Panel'

const ScrollPanelStyled = styled(PanelStyled)`
  padding: 0;
  padding: 12px;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  gap: var(--base-gap-medium);
`

export interface ScrollPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  scrollStyle?: React.CSSProperties
}

export const ScrollPanel = forwardRef<HTMLDivElement, ScrollPanelProps>((props, ref) => {
  return (
    <PanelStyled
      {...props}
      ref={ref}
      style={{
        padding: 0,
        ...(props.style || {}),
      }}
    >
      <ScrollPanelStyled style={props.scrollStyle}>{props.children}</ScrollPanelStyled>
    </PanelStyled>
  )
})
