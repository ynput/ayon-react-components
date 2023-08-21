import { ButtonHTMLAttributes, forwardRef } from 'react'
import * as Styled from './Button.styled'
import { Icon, IconType } from '../Icon'
import clsx from 'clsx'
import Typography from '../theme/Typography.module.css'

// TYPES
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  icon?: IconType
  tooltip?: string
  link?: boolean
  disabled?: boolean
  iconStyle?: React.CSSProperties
  variant?: 'surface' | 'tonal' | 'filled' | 'nav' | 'text' | 'tertiary'
  className?: string
  selected?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { label, icon, tooltip, link, iconStyle, variant = 'surface', className, selected, ...props },
    ref,
  ) => {
    return (
      <Styled.Button
        title={tooltip}
        $link={link}
        $icon={!!icon}
        className={clsx(className, variant, Typography.labelLarge, selected && 'selected')}
        {...props}
        ref={ref}
      >
        {!link && icon && <Icon icon={icon} />} {label} {props.children}
      </Styled.Button>
    )
  },
)
