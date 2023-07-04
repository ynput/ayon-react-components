import React, { forwardRef, Ref } from 'react'
import styled, { css } from 'styled-components'
import { Button, ButtonProps } from '../Button'
import { IconType } from '../Icon'

const spin = css`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

interface StyledSaveButtonProps {
  $active?: boolean
  $saving?: boolean
}

const StyledSaveButton = styled(Button)<StyledSaveButtonProps>`
  transition: background-color 0.3s;
  /* active styles */
  ${({ $active, $saving }) =>
    $active &&
    css`
      transition: background-color 0s;

      background-color: var(--color-hl-00);
      color: black;

      .icon {
        color: black;

        /* saving spine icon */
        ${$saving &&
        css`
          animation: ${spin} 1s linear infinite;
          cursor: not-allowed;
          user-select: none;
        `}
      }

      &:hover {
        background-color: #76cbe8;
      }
    `}
`

export interface SaveButtonProps extends ButtonProps {
  active?: boolean
  saving?: boolean
  icon?: IconType
  onClick?: () => void
  children?: React.ReactNode
}

export const SaveButton = forwardRef(
  ({ active, saving, children, icon, ...props }: SaveButtonProps, ref: Ref<HTMLButtonElement>) => {
    return (
      <StyledSaveButton
        ref={ref}
        disabled={!active}
        icon={icon || (saving ? 'sync' : 'check')}
        $active={active}
        $saving={saving}
        {...props}
      >
        {children}
      </StyledSaveButton>
    )
  },
)
