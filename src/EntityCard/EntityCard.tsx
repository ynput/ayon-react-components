import { forwardRef, useEffect, useState } from 'react'
import { Icon, IconType } from '../Icon'
import * as Styled from './EntityCard.styled'
import { User, UserImagesStacked } from '../User/UserImagesStacked'
import clsx from 'clsx'

type NotificationType = 'comment' | 'due' | 'overdue'

const notifications: {
  [key in NotificationType]: {
    color: string
    icon: IconType
  }
} = {
  comment: {
    color: 'var(--md-sys-color-primary)',
    icon: 'mark_unread_chat_alt',
  },
  due: {
    color: 'var(--md-custom-color-warning)',
    icon: 'schedule',
  },
  overdue: {
    color: 'var(--md-sys-color-error-container)',
    icon: 'alarm',
  },
}

export interface EntityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  titleIcon?: IconType
  subTitle?: string
  subTitleIcon?: IconType
  isPlayable?: boolean // shows subtitle icon
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
  assignees?: User[]
  variant?: 'thumbnail' | 'basic' | 'full'
  isFullHighlight?: boolean
  isActiveAnimate?: boolean
  onThumbnailKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onActivate?: () => void
}

export const EntityCard = forwardRef<HTMLDivElement, EntityCardProps>(
  (
    {
      title = '',
      titleIcon,
      subTitleIcon,
      isPlayable,
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
      isFullHighlight = false,
      isActiveAnimate = false,
      onThumbnailKeyDown,
      onActivate,
      assignees,
      ...props
    },
    ref,
  ) => {
    const notificationIcon = notification && notifications[notification]

    // variants
    const hideIcons = variant === 'basic' || variant === 'thumbnail'
    const hideDescription = variant === 'basic' || variant === 'thumbnail'
    const hideTitles = variant === 'thumbnail'

    const [isImageError, setIsImageError] = useState(false)
    const [isImageLoading, setIsImageLoading] = useState(!!imageUrl)

    const setLoadingStates = (loading: boolean, error: boolean) => {
      setIsImageLoading(loading)
      setIsImageError(error)
    }

    useEffect(() => {
      // Reset loaded and error states when src changes
      setLoadingStates(true, false)

      if (!imageUrl) return setLoadingStates(false, false)

      // Function to fetch image and check status code
      const fetchImage = async () => {
        try {
          const response = await fetch(imageUrl, { cache: 'force-cache' })
          if (response.status === 200) {
            setLoadingStates(false, false)
          } else {
            throw new Error('Image not OK')
          }
        } catch (error) {
          setLoadingStates(false, true)
        }
      }

      if (imageUrl) {
        fetchImage()
      }
    }, [imageUrl])

    return (
      <Styled.Card
        {...props}
        ref={ref}
        className={clsx(
          {
            isActive,
            isSecondary,
            isLoading,
            isError,
            disabled,
            isHover,
            isDragging,
            isDraggable,
            isFullHighlight,
            isActiveAnimate,
          },
          'entity-card',
          props.className,
        )}
        $variant={variant}
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
          className={clsx('thumbnail', { loading: isLoading })}
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
          {/* middle Icon */}
          <Styled.NoImageIcon
            icon={titleIcon || 'image'}
            className={clsx('no-image', { loading: isImageLoading })}
          />

          <Styled.Image
            src={imageUrl}
            className={clsx({ loading: isImageLoading || !imageUrl || isImageError })}
          />

          <Styled.Row className="row loading-visible">
            {/* top left */}
            {!hideTitles && (
              <Styled.Title className={clsx('inner-card title', { loading: isLoading })}>
                {titleIcon && <Icon icon={titleIcon} />}
                {title && <span className="inner-text">{title}</span>}
              </Styled.Title>
            )}
            {/* top right icon */}
            {!hideIcons && (
              <Styled.Title className={clsx('inner-card status', { loading: isLoading })}>
                {icon && <Icon icon={icon} style={{ color: iconColor }} />}
              </Styled.Title>
            )}
          </Styled.Row>
          <Styled.Row className="row loading-visible">
            {/* bottom left */}
            {!hideTitles && (
              <Styled.Title className={clsx('inner-card subTitle', { loading: isLoading })}>
                <span className="inner-text">{subTitle}</span>
                {(subTitleIcon || isPlayable) && <Icon icon={subTitleIcon || 'play_circle'} />}
              </Styled.Title>
            )}
            {/* bottom right icon */}
            {notificationIcon && !hideIcons && !assignees?.length && (
              <Styled.Title className="notification">
                <Icon icon={notificationIcon?.icon} style={{ color: notificationIcon?.color }} />
              </Styled.Title>
            )}
            {/* bottom right assignees */}
            {!!assignees?.length && (
              <Styled.Title className={clsx('inner-card assignees', { loading: isLoading })}>
                <UserImagesStacked users={assignees} size={26} gap={-0.5} max={2} />
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
