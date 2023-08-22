import { forwardRef, useEffect, useState } from 'react'
import { Icon, IconType } from '../Icon'
import * as Styled from './EntityCard.styled'
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
  isActive?: boolean
  isSecondary?: boolean
  isLoading?: boolean
  isError?: boolean
  isHover?: boolean
  isDragging?: boolean
  isDraggable?: boolean
  disabled?: boolean
  variant?: 'thumbnail' | 'basic' | 'full'
  onThumbnailKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onActivate?: () => void
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
      isActive = false,
      isSecondary = false,
      isLoading = false,
      isError = false,
      isHover = false,
      disabled = false,
      variant = 'full',
      isDragging = false,
      isDraggable = false,
      onThumbnailKeyDown,
      onActivate,
      ...props
    },
    ref,
  ) => {
    const notificationIcon = notification && notifications[notification]

    // variants
    const hideIcons = variant === 'basic' || variant === 'thumbnail'
    const hideDescription = variant === 'basic' || variant === 'thumbnail'
    const hideTitles = variant === 'thumbnail'

    // image animation is disabled if the image loads faster than 100ms
    const [isImageLoading, isImageValid, disableImageAnimation] = useImageLoading(
      imageUrl,
      isLoading,
    )

    return (
      <Styled.Card
        {...props}
        ref={ref}
        $isActive={isActive}
        $variant={variant}
        $isSecondary={isSecondary}
        $isLoading={isLoading}
        $isError={isError}
        $disabled={disabled}
        $isHover={isHover}
        $isDragging={isDragging}
        $isDraggable={isDraggable}
        tabIndex={0}
        onClick={(e) => {
          onActivate && onActivate()
          props.onClick && props.onClick(e)
        }}
        onKeyDown={(e) => {
          props.onKeyDown && props.onKeyDown(e)
          if (isDraggable) return
          if (e.code === 'Enter' || e.code === 'Space') {
            onActivate && onActivate()
          }
        }}
      >
        <Styled.Thumbnail
          className="thumbnail"
          style={{ backgroundImage: `url(${imageUrl})` }}
          $isImageLoading={isImageLoading}
          $isImageValid={isImageValid}
          $disableImageAnimation={disableImageAnimation}
          tabIndex={isDraggable ? 0 : undefined}
          onKeyDown={(e) => {
            if (!isDraggable) return
            e.stopPropagation()
            onThumbnailKeyDown && onThumbnailKeyDown(e)
            if (e.code === 'Enter' || e.code === 'Space') {
              onActivate && onActivate()
            }
          }}
        >
          <Styled.Row className="row">
            {/* top left */}
            {!hideTitles && (
              <Styled.Title className="title">
                {titleIcon && <Icon icon={titleIcon} />}
                {title && <span className="title">{title}</span>}
              </Styled.Title>
            )}
            {/* top right icon */}
            {!hideIcons && (
              <Styled.Title className="status">
                {icon && <Icon icon={icon} style={{ color: iconColor }} />}
              </Styled.Title>
            )}
          </Styled.Row>
          {!isImageLoading && !isImageValid && (
            <Styled.NoImageIcon icon="image" className="no-image" />
          )}
          <Styled.Row className="row">
            {/* bottom left */}
            {!hideTitles && (
              <Styled.Title className="subTitle">
                <span>{subTitle}</span>
              </Styled.Title>
            )}
            {/* bottom right icon */}
            {notificationIcon && !hideIcons && (
              <Styled.Title className="notification">
                <Icon icon={notificationIcon?.icon} style={{ color: notificationIcon?.color }} />
              </Styled.Title>
            )}
          </Styled.Row>
        </Styled.Thumbnail>
        {description && !hideDescription && (
          <Styled.Description className="description">
            <span>{description}</span>
          </Styled.Description>
        )}
      </Styled.Card>
    )
  },
)
