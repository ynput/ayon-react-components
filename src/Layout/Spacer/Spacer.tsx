import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

const StyledSpacer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
`

export const Spacer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  return <StyledSpacer {...props} ref={ref} />
})
