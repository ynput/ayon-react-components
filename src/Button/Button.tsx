import { ButtonHTMLAttributes, forwardRef } from 'react'
import * as Styled from './Button.styled'
import { Icon, IconProps, IconType } from '../Icon'
import clsx from 'clsx'
import Typography from '../theme/typography.module.css'
import { ShortcutTag, ShortcutTagProps } from '../ShortcutTag/ShortcutTag'

// TYPES
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  icon?: IconType
  tooltip?: string
  link?: boolean
  disabled?: boolean
  iconProps?: Omit<IconProps, 'icon'>
  variant?: 'surface' | 'tonal' | 'filled' | 'nav' | 'text' | 'tertiary' | 'danger'
  className?: string
  selected?: boolean
  shortcut?: {
    children: React.ReactNode
    side?: 'left' | 'right'
    align?: ShortcutTagProps['align']
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      icon,
      tooltip,
      link,
      variant = 'surface',
      className,
      selected,
      iconProps,
      shortcut,
      ...props
    },
    ref,
  ) => {
    const shortcutComponent = shortcut?.children && (
      <ShortcutTag align={shortcut?.align || 'right'}>{shortcut.children}</ShortcutTag>
    )
    const shortcutSide = shortcut?.children ? shortcut?.side || 'right' : undefined

    return (
      <Styled.Button
        title={tooltip}
        $variant={variant}
        className={clsx(className, variant, Typography.labelLarge, {
          selected,
          link,
          icon: !!icon,
        })}
        {...props}
        ref={ref}
      >
        {shortcutSide === 'left' && shortcutComponent}
        {!link && icon && <Icon icon={icon} {...iconProps} />} {label} {props.children}
        {shortcutSide === 'right' && shortcutComponent}
      </Styled.Button>
    )
  },
)
