import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

export const PanelStyled = styled.div`
  position: relative;
  padding: 12px;
  background-color: var(--panel-background);
  border-radius: var(--panel-border-radius);
  display: flex;
  flex-direction: column;
  gap: var(--base-gap-medium);

  &.transparent {
    background-color: transparent;
  }

  &.nopad {
    padding: 0;
  }
`

export const Panel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  return (
    <PanelStyled {...props} ref={ref}>
      {props.children}
    </PanelStyled>
  )
})
