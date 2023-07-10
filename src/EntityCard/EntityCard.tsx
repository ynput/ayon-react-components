import { forwardRef, useEffect, useState } from 'react'
import { Icon, IconType } from '../Icon'
import {
  NoImageIcon,
  StyledDescription,
  StyledEntityCard,
  StyledRow,
  StyledThumbnail,
  StyledTitle,
} from '.'
import useImageLoading from '../helpers/useImageLoading'

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
  title?: string
  titleIcon?: IconType
  subTitle?: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  icon?: IconType
  iconColor?: string
  notification?: NotificationType
  isActive: boolean
  isSecondary?: boolean
  isLoading: boolean
  isError: boolean
  disabled?: boolean
  variant?: 'thumbnail' | 'basic' | 'full'
}

export const EntityCard = forwardRef<HTMLDivElement, EntityCardProps>(
  (
    {
      title = '',
      titleIcon,
      subTitle,
      description,
      imageUrl,
      imageAlt,
      icon,
      iconColor,
      notification,
      isActive,
      isSecondary,
      isLoading,
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

    const [isImageLoading, isImageValid] = useImageLoading(imageUrl, isLoading)

    return (
      <StyledEntityCard
        {...props}
        ref={ref}
        $isActive={isActive}
        $variant={variant}
        $isSecondary={isSecondary}
        $isLoading={isLoading}
        $isError={isError}
      >
        <StyledThumbnail
          className="thumbnail"
          style={{ backgroundImage: `url(${imageUrl})` }}
          $isImageLoading={isImageLoading}
          $isImageValid={isImageValid}
        >
          <StyledRow className="row">
            {/* top left */}
            {!hideTitles && (
              <StyledTitle className="title">
                {titleIcon && <Icon icon={titleIcon} />}
                {title && <span className="title">{title}</span>}
              </StyledTitle>
            )}
            {/* top right icon */}
            {!hideIcons && (
              <StyledTitle className="status">
                {icon && <Icon icon={icon} style={{ color: iconColor }} />}
              </StyledTitle>
            )}
          </StyledRow>
          {!isImageLoading && !isImageValid && <NoImageIcon icon="image" className="no-image" />}
          <StyledRow className="row">
            {/* bottom left */}
            {!hideTitles && (
              <StyledTitle className="subTitle">
                <span>{subTitle}</span>
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
