import { HTMLAttributes, forwardRef } from 'react'
import styled, { css } from 'styled-components'

const DividerStyled = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;

  ${(props) =>
    !props.children &&
    css`
      border-bottom: 1px solid var(--color-grey-03);
    `}

  ${(props) =>
    props.children &&
    css`
      &::before,
      &::after {
        content: '';
        height: 1px;
        background-color: var(--color-grey-03);
      }

      &::before {
        margin-right: 2rem;
        flex-basis: 200px;
      }

      &::after {
        margin-left: 2rem;
        flex-grow: 1;
      }
    `}
`

export const Divider = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => {
    return <DividerStyled {...props} ref={ref} />
  },
)
