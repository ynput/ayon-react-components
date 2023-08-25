import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

export const PanelStyled = styled.div`
  position: relative;
  padding: var(--padding-m);
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--border-radius-m);
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
type PanelProps = HTMLAttributes<HTMLDivElement> & {
  direction?: 'row' | 'column'
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ direction = 'column', ...props }, ref) => {
    return (
      <PanelStyled
        {...props}
        style={{
          flexDirection: direction === 'column' ? 'column' : 'row',
          alignItems: direction === 'column' ? 'flex-start' : 'center',
          justifyContent: direction === 'column' ? 'flex-start' : 'space-between',
          ...props.style,
        }}
        ref={ref}
      >
        {props.children}
      </PanelStyled>
    )
  },
)
