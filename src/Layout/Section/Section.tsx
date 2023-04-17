import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

const SectionStyled = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: var(--base-gap-large);

  // column is implicit

  flex-direction: column;
  & > * {
    width: 100%;
  }

  &.row {
    flex-direction: row;
    & > * {
      width: 100%;
    }
  }

  &.wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`

export const Section = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(({ ...props }, ref) => {
  return (
    <SectionStyled {...props} ref={ref}>
      {props.children}
    </SectionStyled>
  )
})
