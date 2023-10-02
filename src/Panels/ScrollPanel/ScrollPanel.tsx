import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'
import { PanelStyled } from '../Panel'

const ScrollPanelStyled = styled(PanelStyled)`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  gap: var(--base-gap-medium);
  background-color: transparent;

  /* scrollbar */
  scrollbar-width: 8px;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background: var(--md-sys-color-surface-container-low);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--md-sys-color-outline);
    border-radius: 8px;
  }
`

export interface ScrollPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  scrollStyle?: React.CSSProperties
}

export const ScrollPanel = forwardRef<HTMLDivElement, ScrollPanelProps>((props, ref) => {
  return (
    <PanelStyled
      $direction="column"
      {...props}
      ref={ref}
      style={{
        padding: 0,
        ...(props.style || {}),
      }}
    >
      <ScrollPanelStyled $direction="column" style={props.scrollStyle}>
        {props.children}
      </ScrollPanelStyled>
    </PanelStyled>
  )
})
