import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  direction?: 'row' | 'column'
}

export const PanelStyled = styled.div<{ $direction: PanelProps['direction'] }>`
  position: relative;
  padding: var(--padding-m);
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--border-radius-m);
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  align-items: ${({ $direction }) => ($direction === 'column' ? 'flex-start' : 'center')};
  justify-content: ${({ $direction }) =>
    $direction === 'column' ? 'flex-start' : 'space-between'};
  gap: var(--base-gap-medium);

  &.transparent {
    background-color: transparent;
  }

  &.nopad {
    padding: 0;
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
