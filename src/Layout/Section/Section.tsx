import clsx from 'clsx'
import { HTMLAttributes, forwardRef } from 'react'
import styled, { css } from 'styled-components'

type SectionProps = HTMLAttributes<HTMLElement> & {
  direction?: 'row' | 'column'
  wrap?: boolean
}

type SectionStyleProps = {
  $direction: 'row' | 'column'
  $wrap?: boolean
}

const SectionStyled = styled.section<SectionStyleProps>`
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: var(--base-gap-large);

  // column is implicit

  flex-direction: ${({ $direction }) => ($direction === 'row' ? 'row' : 'column')};
  & > * {
    width: 100%;
  }

  ${({ $wrap }) =>
    $wrap &&
    css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    `}
`

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ direction = 'column', wrap, className, ...props }, ref) => {
    return (
      <SectionStyled
        $direction={direction}
        $wrap={!!wrap}
        className={clsx(
          {
            ['wrap']: wrap,
          },
          direction,
          className,
        )}
        {...props}
        ref={ref}
      >
        {props.children}
      </SectionStyled>
    )
  },
)
