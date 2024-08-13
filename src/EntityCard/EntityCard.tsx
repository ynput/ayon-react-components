import { forwardRef, KeyboardEvent, MouseEvent, useRef } from 'react'
import { Icon, IconType } from '../Icon'
import * as Styled from './EntityCard.styled'
import { User, UserImagesStacked } from '../User/UserImagesStacked'
import clsx from 'clsx'
import useImageLoader from '../helpers/useImageLoader'
import useUserImagesLoader from './useUserImagesLoader'
import { Dropdown, DropdownRef } from '../Dropdowns/Dropdown'
import { AssigneeSelect } from '../Dropdowns/AssigneeSelect'
import { Status, StatusSelect } from '../Dropdowns/StatusSelect'

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

export type PriorityType = {
  label?: string
  color?: string
  icon: IconType
  name: string
}

type Section = 'title' | 'header' | 'users' | 'status' | 'priority'

export interface EntityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: string // top header
  path?: string // top header
  showPath?: boolean // always show path
  title?: string // top left
  titleIcon?: IconType // top left
  isPlayable?: boolean // top right - play icon
  users?: User[] // bottom left
  status?: Status // bottom center
  priority?: PriorityType // bottom right
  imageUrl?: string
  imageAlt?: string
  imageIcon?: IconType
  notification?: NotificationType
  isActive?: boolean
  isLoading?: boolean
  loadingSections?: Section[]
  isError?: boolean
  isHover?: boolean
  isDragging?: boolean
  isDraggable?: boolean
  disabled?: boolean
  variant?: 'default' | 'status'
  isCollapsed?: boolean
  // editing options
  assigneeOptions?: User[]
  statusOptions?: Status[]
  priorityOptions?: PriorityType[]
  // editing callbacks
  onAssigneeChange?: (users: string[]) => void
  onStatusChange?: (status: string) => void
  onPriorityChange?: (priority: string) => void
  // other functions
  onThumbnailKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onActivate?: () => void
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
      loadingSections = ['title'],
      isError = false,
      isHover = false,
      disabled = false,
      variant = 'default',
      isCollapsed = false,
      isDragging = false,
      isDraggable = false,
      assigneeOptions,
      statusOptions,
      priorityOptions,
      onAssigneeChange,
      onStatusChange,
      onPriorityChange,
      onThumbnailKeyDown,
      onActivate,
      ...props
    },
    ref,
  ) => {
    const assigneesEditable = users && assigneeOptions && !!onAssigneeChange
    const statusEditable = status && statusOptions && !!onStatusChange
    const priorityEditable = priority && priorityOptions && !!onPriorityChange
    const atLeastOneEditable = assigneesEditable || statusEditable || priorityEditable

    const priorityDropdownRef = useRef<DropdownRef>(null)
    const assigneesDropdownRef = useRef<DropdownRef>(null)
    const statusDropdownRef = useRef<DropdownRef>(null)

    const dropdownRefs = useRef({
      priority: priorityDropdownRef,
      assignees: assigneesDropdownRef,
      status: statusDropdownRef,
    })

    const closeEditors = () => {
      Object.values(dropdownRefs.current).forEach((r) => {
        if (r.current?.isOpen) {
          r.current.close(true)
        }
      })
    }

    const handleEditableHover = (
      _e: MouseEvent<HTMLSpanElement>,
      key: 'assignees' | 'priority' | 'status',
    ) => {
      const ref = dropdownRefs.current[key].current
      // get other refs
      const otherRefs = Object.entries(dropdownRefs.current)
        .filter(([k]) => k !== key)
        .map(([key, ref]) => ({ key, ref: ref.current }))

      // check if any other open and close
      otherRefs.forEach(({ key, ref }) => {
        if (ref?.isOpen) {
          const saveOnClose = key === 'assignees'
          ref.close(saveOnClose)
        }
      })

      // open ref
      if (ref) {
        ref.open()
      }
    }

    // check thumbnail image
    const [isThumbnailLoading, isThumbnailError] = useImageLoader(imageUrl)
    // check first and second user images
    const { users: userWithValidatedImages, isLoading: isUserImagesLoading } =
      useUserImagesLoader(users)
    const statusBGColor = variant === 'status' && status?.color ? status.color : undefined

    const shouldShowTag = (value: any, name: Section) =>
      (!!value && !isLoading) || (isLoading && loadingSections.includes(name))

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
        onMouseLeave={closeEditors}
      >
        {shouldShowTag(header, 'header') && (
          <Styled.Header className={'header loading-visible'}>
            {path && (
              <div className={clsx('expander', { show: showPath })}>
                <span className="path">... / {path} / </span>
              </div>
            )}
            <span className="shot">{isLoading ? '' : header}</span>
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
            onMouseEnter={closeEditors}
          />

          {imageUrl && (
            <Styled.Image
              src={imageUrl}
              className={clsx({ loading: isThumbnailLoading || isThumbnailError })}
              onMouseEnter={closeEditors}
            />
          )}
          {/* TOP ROW */}
          <Styled.Row className="row row-top loading-visible">
            {/* top left */}
            {(!isLoading || loadingSections.includes('title')) && (
              <Styled.Tag className={clsx('tag title', { isLoading })}>
                {isLoading ? (
                  'loading card...'
                ) : (
                  <>
                    {titleIcon && <Icon icon={titleIcon} />}
                    {title && <span className="inner-text">{title}</span>}
                  </>
                )}
              </Styled.Tag>
            )}

            {/* top right */}
            {isPlayable && (
              <Styled.Tag className={clsx('tag playable')}>
                <Icon icon={'play_circle'} />
              </Styled.Tag>
            )}
          </Styled.Row>
          {/* BOTTOM ROW */}
          <Styled.Row className="row row-bottom loading-visible">
            {atLeastOneEditable && (
              <>
                {/* EDITORS */}
                <Styled.EditorLeaveZone className="block-leave" />

                <Styled.Editor className="editor">
                  {/* assignees dropdown */}
                  {assigneesEditable && (
                    <AssigneeSelect
                      value={users.map((user) => user.name)}
                      options={assigneeOptions}
                      ref={assigneesDropdownRef}
                      onChange={(value) => onAssigneeChange(value)}
                    />
                  )}

                  {statusEditable && (
                    <StatusSelect
                      value={[status.name]}
                      options={statusOptions}
                      ref={statusDropdownRef}
                      onChange={(value) => onStatusChange(value)}
                    />
                  )}

                  {/* priority dropdown */}
                  {priorityEditable && (
                    <Dropdown
                      value={[priority.name]}
                      options={priorityOptions}
                      dataKey="name"
                      ref={priorityDropdownRef}
                      onChange={(value) => onPriorityChange(value[0]?.toString())}
                    />
                  )}
                </Styled.Editor>
              </>
            )}

            {/* bottom left - users */}
            {shouldShowTag(users, 'users') && (
              <Styled.Tag
                className={clsx('tag users', {
                  isLoading: isUserImagesLoading || isLoading,
                  editable: assigneesEditable,
                })}
                onMouseEnter={(e) => handleEditableHover(e, 'assignees')}
                onClick={(e) => handleEditableHover(e, 'assignees')}
              >
                <UserImagesStacked users={userWithValidatedImages} size={26} gap={-0.5} max={2} />
              </Styled.Tag>
            )}

            {/* bottom center - status */}
            {shouldShowTag(status, 'status') && (
              <Styled.StatusContainer>
                <div className="status-wrapper">
                  <Styled.Tag
                    className={clsx('tag status', {
                      editable: statusEditable,
                      isLoading,
                    })}
                    onMouseEnter={(e) => handleEditableHover(e, 'status')}
                    onClick={(e) => handleEditableHover(e, 'status')}
                  >
                    {status?.icon && <Icon icon={status.icon} style={{ color: status.color }} />}
                    {status?.name && (
                      <span className="expander status-label">
                        <span>{status.name}</span>
                      </span>
                    )}
                  </Styled.Tag>
                </div>
              </Styled.StatusContainer>
            )}

            {/* bottom right - priority */}
            {shouldShowTag(priority, 'priority') && (
              <Styled.Tag
                className={clsx('tag', { editable: priorityEditable, isLoading })}
                onMouseEnter={(e) => handleEditableHover(e, 'priority')}
                onClick={(e) => handleEditableHover(e, 'priority')}
              >
                {priority?.icon && <Icon icon={priority.icon} />}
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
