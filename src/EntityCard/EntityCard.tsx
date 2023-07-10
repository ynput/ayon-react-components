import { forwardRef } from 'react'
import { Icon, IconType } from '../Icon'
import { StyledDescription, StyledEntityCard, StyledRow, StyledThumbnail, StyledTitle } from '.'

type NotificationType = 'comment' | 'due' | 'overdue'

const notifications: {
  [key in NotificationType]: {
    color: string
    icon: IconType
  }
} = {
  comment: {
    color: 'var(--color-hl-00)',
    icon: 'mark_unread_chat_alt',
  },
  due: {
    color: 'var(--color-hl-01)',
    icon: 'schedule',
  },
  overdue: {
    color: 'var(--color-hl-error)',
    icon: 'alarm',
  },
}

export interface EntityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  titleIcon: IconType
  subtitle: string
  description: string
  imageUrl: string
  imageAlt?: string
  icon?: IconType
  iconColor?: string
  notification?: NotificationType
  isActive: boolean
  isSecondary?: boolean
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  disabled?: boolean
  variant?: 'thumbnail' | 'basic' | 'full'
}

export const EntityCard = forwardRef<HTMLDivElement, EntityCardProps>(
  (
    {
      title,
      titleIcon,
      subtitle,
      description,
      imageUrl,
      imageAlt,
      icon,
      iconColor,
      notification,
      isActive,
      isSecondary,
      isLoading,
      isSuccess,
      isError,
      disabled,
      variant = 'full',
      ...props
    },
    ref,
  ) => {
    const notificationIcon = notification && notifications[notification]

    // variants
    const hideIcons = variant === 'basic' || variant === 'thumbnail'
    const hideDescription = variant === 'basic' || variant === 'thumbnail'
    const hideTitles = variant === 'thumbnail'

    return (
      <StyledEntityCard
        {...props}
        ref={ref}
        $isActive={isActive}
        $variant={variant}
        $isSecondary={isSecondary}
        $isLoading={isLoading}
        $isSuccess={isSuccess}
        $isError={isError}
      >
        <StyledThumbnail className="thumbnail">
          <StyledRow className="row">
            {/* top left */}
            {!hideTitles && (
              <StyledTitle className="title">
                {titleIcon && <Icon icon={titleIcon} />}
                {title && <span className="title">{title}</span>}
              </StyledTitle>
            )}
            {/* top right icon */}
            {icon && !hideIcons && (
              <StyledTitle className="card">
                <Icon icon={icon} style={{ color: iconColor }} />
              </StyledTitle>
            )}
          </StyledRow>
          <StyledRow className="row">
            {/* bottom left */}
            {!hideTitles && (
              <StyledTitle className="subtitle">
                <span>{subtitle}</span>
              </StyledTitle>
            )}
            {/* bottom right icon */}
            {notificationIcon && !hideIcons && (
              <StyledTitle className="notification">
                <Icon icon={notificationIcon?.icon} color={notificationIcon?.color} />
              </StyledTitle>
            )}
          </StyledRow>
        </StyledThumbnail>
        {description && !hideDescription && (
          <StyledDescription className="description">
            <span>{description}</span>
          </StyledDescription>
        )}
      </StyledEntityCard>
    )
  },
)
