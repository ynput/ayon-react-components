import { ButtonHTMLAttributes, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { Icon, IconType } from '../Icon'

// STYLES
const ButtonStyled = styled.button<{
  $link?: boolean
  label?: string
}>`
  color: var(--color-text);
  background: var(--button-background);
  min-height: var(--base-input-size);
  max-height: var(--base-input-size);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: var(--base-input-border-radius);
  gap: var(--base-gap-medium);
  cursor: pointer;
  white-space: nowrap;

  .material-symbols-outlined {
    font-size: 1.5rem;
  }

  &:hover {
    background: var(--button-background-hover);
  }

  &:active {
    background: var(--button-background-hover);
  }

  &:focus {
    outline: 1px solid var(--color-hl-00);
  }

  &:disabled {
    color: var(--color-text-dim);
    cursor: not-allowed;

    &:hover {
      background: var(--button-background);
    }

    .material-symbols-outlined {
      color: var(--color-text-dim);
    }
  }

  // Circle tool buttons (for arrows and crosses/pluses in the settings editor)

  &.circle {
    border-radius: 50%;
    border: 1px solid var(--color-grey-03);
    background: transparent;
    padding: 0;
    justify-content: center;
    .material-symbols-outlined {
      font-size: 2rem;
    }
  }

  // Transparent button is used for the top level menus
  // (project sidebar and user menu)

  &.transparent {
    background: transparent;
    border: none;
    color: var(--color-text);
    justify-content: center;
    padding: 0;
    &:hover {
      background: transparent;
      .material-symbols-outlined {
        color: white;
      }
    }
    &:focus {
      outline: none;
      color: var(--color-hl-00);
      .material-symbols-outlined {
        color: var(--color-hl-00);
      }
    }
    .material-symbols-outlined {
      font-size: 2.2rem;
    }
  }

  // Without a label, button is considered an icon button
  // and should be square.
  ${({ label }) =>
    label &&
    css`
      min-width: var(--base-input-size);
      max-width: var(--base-input-size);
    `}

  /* if button is link */
  ${({ $link }) =>
    $link &&
    css`
      display: inline-block;
      border: 0;
      background: none;
      color: var(--color-hl-00);
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    `}
`

// TYPES
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  icon?: IconType
  tooltip?: string
  link?: boolean
  disabled?: boolean
  iconStyle?: React.CSSProperties
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ label, icon, tooltip, link, iconStyle, ...props }, ref) => {
    return (
      <ButtonStyled title={tooltip} $link={link} {...props} ref={ref}>
        {!link && icon && <Icon icon={icon} />} {label} {props.children}
      </ButtonStyled>
    )
  },
)
