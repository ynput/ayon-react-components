import clsx from 'clsx'
import { forwardRef, Ref } from 'react'
import styled from 'styled-components'

export const StyledShortcut = styled.span`
  background-color: var(--md-sys-color-surface-container);
  padding: 2px 4px;
  border-radius: var(--border-radius-m);
  font-size: 90%;
  margin-left: auto;

  &.left {
    margin-right: auto;
    margin-left: 0;
  }

  &.right {
    margin-left: auto;
    margin-right: 0;
  }
`

export interface ShortcutTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  align?: 'left' | 'right'
}

export const ShortcutTag = forwardRef(
  ({ children, align, className = '', ...props }: ShortcutTagProps, ref: Ref<HTMLSpanElement>) => {
    return (
      <StyledShortcut ref={ref} className={clsx('shortcut', className, align)} {...props}>
        {children}
      </StyledShortcut>
    )
  },
)
