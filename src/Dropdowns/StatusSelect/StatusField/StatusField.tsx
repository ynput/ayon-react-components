import { forwardRef } from 'react'
import { Icon, IconType } from '../../../Icon'
import clsx from 'clsx'
import { StatusStyled } from './StatusField.styled'

export type StatusSize = 'full' | 'short' | 'icon'

export type Status = {
  name: string
  shortName?: string
  state?: 'not_started' | 'in_progress' | 'done' | 'blocked'
  icon?: IconType
  color?: string
  original_name?: string
}

export interface StatusFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  status: Status
  isActive?: boolean
  isChanging?: boolean
  isSelecting?: boolean
  size?: 'full' | 'short' | 'icon'
  style?: React.CSSProperties
  height?: number | string
  placeholder?: string
  invert?: boolean
  className?: string
  showChevron?: boolean
  isChanged?: boolean
}

export const StatusField = forwardRef<HTMLDivElement, StatusFieldProps>(
  (
    {
      status,
      isActive,
      isChanging,
      isSelecting,
      size = 'full',
      style,
      height,
      placeholder,
      invert,
      className,
      showChevron,
      isChanged,
      ...props
    },
    ref,
  ) => {
    const {
      name,
      shortName,
      color = 'var(--md-sys-color-surface-container-highest)',
      icon = 'help_center',
    } = status || {}

    return (
      <StatusStyled
        ref={ref}
        {...props}
        style={{ ...style, height }}
        id={name}
        $color={color}
        $size={size}
        className={clsx(
          'status-field',
          {
            active: isActive,
            selecting: isSelecting,
            changing: isChanging,
            invert: invert,
            changed: isChanged,
          },
          className,
        )}
      >
        <div className="status-texticon">
          {icon && <Icon className="status-icon" icon={icon} />}
          <span className="status-text">
            {size !== 'icon' && (size === 'full' ? name : shortName)}
          </span>
        </div>
        {showChevron && <Icon icon="expand_more" />}
      </StatusStyled>
    )
  },
)
