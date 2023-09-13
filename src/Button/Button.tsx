import { ButtonHTMLAttributes, forwardRef } from 'react'
import * as Styled from './Button.styled'
import { Icon, IconProps, IconType } from '../Icon'
import clsx from 'clsx'
import Typography from '../theme/typography.module.css'

// TYPES
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  icon?: IconType
  tooltip?: string
  link?: boolean
  disabled?: boolean
  iconProps?: Omit<IconProps, 'icon'>
  variant?: 'surface' | 'tonal' | 'filled' | 'nav' | 'text' | 'tertiary'
  className?: string
  selected?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { label, icon, tooltip, link, variant = 'surface', className, selected, iconProps, ...props },
    ref,
  ) => {
    return (
      <Styled.Button
        title={tooltip}
        $link={link}
        $icon={!!icon}
        $variant={variant}
        $selected={!!selected}
        className={clsx(className, variant, Typography.labelLarge, selected && 'selected')}
        {...props}
        ref={ref}
      >
        {!link && icon && <Icon icon={icon} {...iconProps} />} {label} {props.children}
      </Styled.Button>
    )
  },
)
