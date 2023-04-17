import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--base-gap-medium);
`

export const FormLayout = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return (
      <StyledForm {...props} ref={ref}>
        {children}
      </StyledForm>
    )
  },
)
