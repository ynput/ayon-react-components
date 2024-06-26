import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  direction?: 'row' | 'column'
}

export const PanelStyled = styled.div<{ $direction: PanelProps['direction'] }>`
  position: relative;
  padding: var(--padding-m);
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--border-radius-m);
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  gap: var(--base-gap-medium);

  &.transparent {
    background-color: transparent;
  }

  &.nopad {
    padding: 0;
  }

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

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ direction = 'column', ...props }, ref) => {
    return (
      <PanelStyled {...props} ref={ref} $direction={direction}>
        {props.children}
      </PanelStyled>
    )
  },
)
