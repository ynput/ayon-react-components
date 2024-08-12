import { forwardRef, KeyboardEvent, MouseEvent } from 'react'
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
  showPath?: boolean // always show path
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
  variant?: 'default' | 'status'
  isCollapsed?: boolean
  onThumbnailKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onActivate?: () => void
  // editing options
  assigneeOptions?: User[]
  statusOptions?: StatusType[]
  priorityOptions?: PriorityType[]
}

export const EntityCard = forwardRef<HTMLDivElement, EntityCardProps>(
  (
    {
      header,
      path,
      showPath,
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
      variant = 'default',
      isCollapsed = false,
      isDragging = false,
      isDraggable = false,
      onThumbnailKeyDown,
      onActivate,
      assigneeOptions,
      statusOptions,
      priorityOptions,
      ...props
    },
    ref,
  ) => {
    // check thumbnail image
    const [isThumbnailLoading, isThumbnailError] = useImageLoader(imageUrl)
    // check first and second user images
    const { users: userWithValidatedImages, isLoading: isUserImagesLoading } =
      useUserImagesLoader(users)
    const statusBGColor = variant === 'status' && status?.color ? status.color : undefined

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
            collapsed: isCollapsed,
          },
          'entity-card',
          variant,
          props.className,
        )}
        $statusColor={statusBGColor}
        tabIndex={0}
        onClick={(e) => {
          if (!clickedEditableElement(e)) {
            onActivate && onActivate()
          }
          props.onClick && props.onClick(e)
        }}
        onKeyDown={(e) => {
          props.onKeyDown && props.onKeyDown(e)
          if (isDraggable) return
          if (e.code === 'Enter' || e.code === 'Space') {
            if (!clickedEditableElement(e)) onActivate && onActivate()
          }
        }}
      >
        {header && (
          <Styled.Header className="header">
            {path && (
              <div className={clsx('expander', { show: showPath })}>
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
            <Styled.Tag className={clsx('tag title', { loading: isLoading })}>
              {titleIcon && <Icon icon={titleIcon} />}
              {title && <span className="inner-text">{title}</span>}
            </Styled.Tag>

            {/* top right */}
            {isPlayable && (
              <Styled.Tag className={clsx('tag playable', { loading: isLoading })}>
                <Icon icon={'play_circle'} />
              </Styled.Tag>
            )}
          </Styled.Row>
          {/* BOTTOM ROW */}
          <Styled.Row className="row row-bottom">
            {/* bottom left - users */}
            {users && (
              <Styled.Tag
                className={clsx('tag users', {
                  loading: isLoading || isUserImagesLoading,
                  editable: assigneeOptions,
                })}
              >
                <UserImagesStacked users={userWithValidatedImages} size={26} gap={-0.5} max={2} />
              </Styled.Tag>
            )}

            {/* bottom center - status */}
            {status && (
              <Styled.StatusContainer>
                <div className="status-wrapper">
                  <Styled.Tag
                    className={clsx('tag status', {
                      loading: isLoading,

                      editable: statusOptions,
                    })}
                  >
                    {status.icon && <Icon icon={status.icon} style={{ color: status.color }} />}
                    <span className="expander status-label">
                      <span>{status.label}</span>
                    </span>
                  </Styled.Tag>
                </div>
              </Styled.StatusContainer>
            )}

            {/* bottom right - priority */}
            {priority && (
              <Styled.Tag
                className={clsx('tag', { loading: isLoading, editable: priorityOptions })}
              >
                <Icon icon={priority.icon} />
              </Styled.Tag>
            )}
          </Styled.Row>
        </Styled.Thumbnail>
      </Styled.Card>
    )
  },
)

// if the element has editable class, then it is editable
const clickedEditableElement = (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
  const target = e.target as HTMLElement
  return target.closest('.editable')
}
