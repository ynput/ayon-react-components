import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

const StyledToolbar = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
`

export const Toolbar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ children, ...props }, ref) => {
    return (
      <StyledToolbar {...props} ref={ref}>
        {children}
      </StyledToolbar>
    )
  },
)
