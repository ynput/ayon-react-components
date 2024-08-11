import { forwardRef } from 'react'
import { Icon, IconType } from '../Icon'
import * as Styled from './EntityCard.styled'
import { User, UserImagesStacked } from '../User/UserImagesStacked'
import clsx from 'clsx'
import useImageLoader from '../helpers/useImageLoader'
import useUserImagesLoader from './useUserImagesLoader'

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

export type StatusType = {
  label: string
  color: string
  icon: IconType
}

export type PriorityType = {
  label: string
  color: string
  icon: IconType
}

export interface EntityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: string // top header
  path?: string // top header
  title?: string // top left
  titleIcon?: IconType // top left
  isPlayable?: boolean // top right - play icon
  users?: User[] // bottom left
  status?: StatusType // bottom center
  priority?: PriorityType // bottom right
  imageUrl?: string
  imageAlt?: string
  imageIcon?: IconType
  notification?: NotificationType
  isActive?: boolean
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
      header,
      path,
      title = '',
      titleIcon,
      isPlayable,
      users,
      status,
      priority,
      imageUrl,
      imageAlt,
      imageIcon,
      notification,
      isActive = false,
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
    const hideTitles = variant === 'thumbnail'

    // check thumbnail image
    const [isThumbnailLoading, isThumbnailError] = useImageLoader(imageUrl)
    // check first and second user images
    const { users: userWithValidatedImages, isLoading: isUserImagesLoading } =
      useUserImagesLoader(users)

    return (
      <Styled.Card
        {...props}
        ref={ref}
        className={clsx(
          {
            isLoading,
            active: isActive,
            error: isError,
            hover: isHover,
            dragging: isDragging,
            draggable: isDraggable,
            disabled,
            variant,
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
        {header && (
          <Styled.Header className="header">
            {path && (
              <div className="expander">
                <span className="path">... / {path} / </span>
              </div>
            )}
            <span className="shot">{header}</span>
          </Styled.Header>
        )}
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
            icon={imageIcon || 'image'}
            className={clsx('no-image', { loading: isThumbnailLoading })}
          />

          <Styled.Image
            src={imageUrl}
            className={clsx({ loading: isThumbnailLoading || !imageUrl || isThumbnailError })}
          />
          {/* TOP ROW */}
          <Styled.Row className="row row-top">
            {/* top left */}
            <Styled.Tag className={clsx('inner-card title', { loading: isLoading })}>
              {titleIcon && <Icon icon={titleIcon} />}
              {title && <span className="inner-text">{title}</span>}
            </Styled.Tag>

            {/* top right */}
            {isPlayable && (
              <Styled.Tag className={clsx('inner-card playable', { loading: isLoading })}>
                <Icon icon={'play_circle'} />
              </Styled.Tag>
            )}
          </Styled.Row>
          {/* BOTTOM ROW */}
          <Styled.Row className="row row-bottom">
            {/* bottom left - users */}
            {users && (
              <Styled.Tag
                className={clsx('inner-card users', { loading: isLoading || isUserImagesLoading })}
              >
                <UserImagesStacked users={userWithValidatedImages} size={26} gap={-0.5} max={2} />
              </Styled.Tag>
            )}

            {/* bottom center - status */}
            {status && (
              <Styled.Tag className={clsx('inner-card status', { loading: isLoading })}>
                <Icon icon={status.icon} style={{ color: status.color }} />
              </Styled.Tag>
            )}

            {/* bottom right - notification */}

            {/* bottom right - priority */}
            {priority && (
              <Styled.Tag className={clsx('inner-card', { loading: isLoading })}>
                <Icon icon={priority.icon} />
              </Styled.Tag>
            )}
          </Styled.Row>
        </Styled.Thumbnail>
      </Styled.Card>
    )
  },
)
