import {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Icon, IconType } from '../Icon'
import * as Styled from './EntityCard.styled'
import { User } from '../User/UserImagesStacked'
import clsx from 'clsx'
import useImageLoader from '../helpers/useImageLoader'
import useUserImagesLoader from './useUserImagesLoader'
import { EnumDropdown, EnumDropdownOption, EnumDropdownProps } from '../Dropdowns/EnumDropdown'
import { DropdownRef } from '../Dropdowns/Dropdown'
import { AssigneeSelect, AssigneeSelectProps } from '../Dropdowns/AssigneeSelect'
import { Status, StatusSelect, StatusSelectProps } from '../Dropdowns/StatusSelect'
import { UserImage } from '../User/UserImage'
import { NotificationDot, NotificationProps } from './Notification/Notification'

type Section = 'title' | 'header' | 'users' | 'status' | 'priority'

export interface EntityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: string // top header
  path?: string // top header
  project?: string // top header
  showPath?: boolean // always show path
  title?: string // top left
  titleIcon?: IconType // top left
  isPlayable?: boolean // top right - play icon
  users?: User[] | null // bottom left
  status?: Status // bottom right
  statusMiddle?: boolean // puts status in the center and priority in the bottom right
  statusNameOnly?: boolean // only show the status name unless it's too small to show, then use icon
  priority?: EnumDropdownOption // bottom left after users
  hidePriority?: boolean
  imageUrl?: string
  imageAlt?: string
  imageIcon?: IconType
  notification?: NotificationProps['notification']
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
  priorityOptions?: EnumDropdownOption[]
  editOnHover?: boolean
  editAutoClose?: boolean
  // editing callbacks
  onAssigneeChange?: (added: string[], removed: string[]) => void
  onStatusChange?: (status: string[]) => void
  onPriorityChange?: (priority: string[]) => void
  // other functions
  onActivate?: () => void
  onTitleClick?: (e: MouseEvent<HTMLDivElement>) => void
  pt?: {
    thumbnail?: HTMLAttributes<HTMLDivElement>
    image?: HTMLAttributes<HTMLImageElement>
    assigneeSelect?: Partial<AssigneeSelectProps>
    statusSelect?: Partial<StatusSelectProps>
    prioritySelect?: Partial<EnumDropdownProps>
    title?: HTMLAttributes<HTMLDivElement>
    topRow?: HTMLAttributes<HTMLDivElement>
    playableTag?: HTMLAttributes<HTMLDivElement>
    bottomRow?: HTMLAttributes<HTMLDivElement>
    usersTag?: HTMLAttributes<HTMLDivElement>
    statusTag?: HTMLAttributes<HTMLDivElement>
    priorityTag?: HTMLAttributes<HTMLDivElement>
    notificationDot?: HTMLAttributes<HTMLDivElement>
  }
}

export const EntityCard = forwardRef<HTMLDivElement, EntityCardProps>(
  (
    {
      header,
      path,
      project,
      showPath,
      title = '',
      titleIcon,
      isPlayable,
      users,
      status,
      statusMiddle,
      statusNameOnly,
      priority,
      hidePriority,
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
      editOnHover,
      editAutoClose,
      onAssigneeChange,
      onStatusChange,
      onPriorityChange,
      onActivate,
      onTitleClick,
      pt = {},
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
      if (editAutoClose) {
        Object.values(dropdownRefs.current).forEach((r) => {
          if (r.current?.isOpen) {
            r.current.close(true)
          }
        })
      }
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

    // used to calculate the width of the status and when to hide it
    const bottomRowRef = useRef<HTMLDivElement>(null)
    const [statusBreakpoints, setStatusBreakpoints] = useState<{
      short?: number
      icon?: number
      status?: string
    }>({})

    useEffect(() => {
      if (!bottomRowRef.current || !status) return

      // if widths for status are already calculated, don't recalculate
      if (statusBreakpoints.status === status.name) return

      const container = bottomRowRef.current
      const containerWidth = container.offsetWidth
      // calculate how much space things other than status take up
      const containerPadding = 2
      const usersWidth =
        (container.querySelector('.tag.users') as HTMLElement)?.offsetWidth + 12 || 0
      const priorityWidth =
        (container.querySelector('.tag.priority') as HTMLElement)?.offsetWidth ||
        (variant === 'status' ? 28 : 0)
      const takenWidth = usersWidth + priorityWidth + containerPadding * 2
      const remainingSpace = containerWidth - takenWidth

      // calculate the width of the status states
      const statusTextWidth =
        (container.querySelector('.tag.status .status-label span') as HTMLElement)?.offsetWidth || 0
      const statusShortWidth =
        (container.querySelector('.tag.status .status-short') as HTMLElement)?.offsetWidth || 0

      setStatusBreakpoints({
        short: takenWidth + statusTextWidth,
        icon: takenWidth + statusShortWidth,
        status: status?.name,
      })
    }, [bottomRowRef.current, status?.name])

    const handleTitleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (!onTitleClick) return

      // prevent the card from being clicked
      e.stopPropagation()
      // call the onTitleClick function
      onTitleClick(e)
    }

    // check thumbnail image
    const [isThumbnailLoading, isThumbnailError] = useImageLoader(imageUrl)
    // check first and second user images
    const { users: userWithValidatedImages, isLoading: isUserImagesLoading } =
      useUserImagesLoader(users)

    const shouldShowTag = (value: any, name: Section) =>
      (!!value && !isLoading) || (isLoading && loadingSections.includes(name))

    return (
      <Styled.Wrapper className="entity-card-wrapper">
        <Styled.Card
          ref={ref}
          $statusColor={status?.color}
          tabIndex={0}
          onMouseLeave={closeEditors}
          {...props}
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
          onClick={(e) => {
            if (!clickedEditableElement(e)) {
              onActivate && onActivate()
            }
            props.onClick && props.onClick(e)
          }}
          onKeyDown={(e) => {
            props.onKeyDown && props.onKeyDown(e)
            if (e.code === 'Enter' || e.code === ' ') {
              if (!clickedEditableElement(e)) onActivate && onActivate()
            }
          }}
        >
          {shouldShowTag(header, 'header') && (
            <Styled.Header className={'header loading-visible'}>
              {path && (
                <div className={clsx('expander', { show: showPath })}>
                  <div className="path">
                    {project && (
                      <>
                        <span>{project}</span>
                        <span className="slash" style={{ marginRight: -2 }}>
                          /
                        </span>
                      </>
                    )}
                    {path && (
                      <>
                        <span>... </span>
                        <span className="slash">/</span>
                        <span>{path}</span>
                        <span className="slash">/</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              <span className="shot">{isLoading ? '' : header}</span>
            </Styled.Header>
          )}
          <Styled.Thumbnail
            {...pt.thumbnail}
            className={clsx('thumbnail', { loading: isLoading }, pt?.thumbnail?.className)}
            onKeyDown={(e) => {
              if (!isDraggable) return
              e.stopPropagation()
              pt.thumbnail?.onKeyDown && pt.thumbnail?.onKeyDown(e)
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
                onMouseEnter={closeEditors}
                {...pt.image}
                className={clsx(
                  { loading: isThumbnailLoading || isThumbnailError },
                  pt?.image?.className,
                )}
              />
            )}
            {/* TOP ROW */}
            <Styled.Row className="row row-top loading-visible full" {...pt.topRow}>
              {/* top left */}
              {(!isLoading || loadingSections.includes('title')) && (
                <Styled.Tag
                  className={clsx('tag title', { isLoading, clickable: !!onTitleClick })}
                  onClick={handleTitleClick}
                  {...pt.title}
                >
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
                <Styled.Tag className={clsx('tag playable')} {...pt.playableTag}>
                  <Icon icon={'play_circle'} />
                </Styled.Tag>
              )}
            </Styled.Row>
            {/* BOTTOM ROW */}
            <Styled.Row
              className={clsx('row row-bottom loading-visible', {
                ['hide-priority']: hidePriority,
              })}
              ref={bottomRowRef}
              {...pt.bottomRow}
            >
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
                        onChange={(added, removed) => onAssigneeChange(added, removed)}
                        tabIndex={0}
                        {...pt.assigneeSelect}
                      />
                    )}

                    {statusEditable && (
                      <StatusSelect
                        value={[status.name]}
                        options={statusOptions}
                        ref={statusDropdownRef}
                        onChange={(value) => onStatusChange([value])}
                        tabIndex={0}
                        {...pt.statusSelect}
                      />
                    )}

                    {/* priority dropdown */}
                    {priorityEditable && (
                      <EnumDropdown
                        ref={priorityDropdownRef}
                        onChange={(value) => onPriorityChange(value as string[])}
                        value={[priority.value]}
                        options={priorityOptions}
                        tabIndex={0}
                        {...pt.prioritySelect}
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
                    empty: !users?.length,
                  })}
                  onMouseEnter={(e) => editOnHover && handleEditableHover(e, 'assignees')}
                  onClick={(e) => handleEditableHover(e, 'assignees')}
                  {...pt.usersTag}
                >
                  {users?.length ? (
                    <Styled.Users className={clsx({ more: users.length > 2 })}>
                      {[...userWithValidatedImages].slice(0, 2).map((user, i) => (
                        <UserImage
                          src={user.avatarUrl}
                          key={i}
                          name={user.name}
                          style={{ zIndex: -i }}
                          fullName={user.fullName || ''}
                          size={22}
                        />
                      ))}
                    </Styled.Users>
                  ) : (
                    <Icon icon="person_add" />
                  )}
                </Styled.Tag>
              )}

              {/* bottom left - priority */}
              {shouldShowTag(priority && !hidePriority, 'priority') && (
                <Styled.Tag
                  onMouseEnter={(e) => editOnHover && handleEditableHover(e, 'priority')}
                  onClick={(e) => handleEditableHover(e, 'priority')}
                  {...pt.priorityTag}
                  className={clsx(
                    'tag priority',
                    { editable: priorityEditable, isLoading },
                    pt.priorityTag?.className,
                  )}
                >
                  {priority?.icon && (
                    <Icon
                      icon={priority.icon}
                      style={{ color: variant == 'default' ? priority?.color : undefined }} // only show priority color in default variant
                    />
                  )}
                </Styled.Tag>
              )}

              {/* bottom right - status */}
              {shouldShowTag(status, 'status') && (
                <Styled.StatusContainer
                  className={clsx(
                    'status-container',
                    {
                      middle: statusMiddle,
                      'name-only': statusNameOnly,
                    },
                    `variant-${variant}`,
                  )}
                  $breakpoints={statusBreakpoints}
                >
                  <div className="status-wrapper">
                    <Styled.Tag
                      className={clsx('tag status', {
                        editable: statusEditable,
                        isLoading,
                      })}
                      onMouseEnter={(e) => editOnHover && handleEditableHover(e, 'status')}
                      onClick={(e) => handleEditableHover(e, 'status')}
                      {...pt.statusTag}
                    >
                      {status?.icon && (
                        <Icon
                          icon={status.icon}
                          className="status-icon"
                          style={{ color: status.color }}
                        />
                      )}
                      {status?.name && (
                        <span className="expander status-label">
                          <span>{status.name}</span>
                        </span>
                      )}
                      {status?.shortName && (
                        <span className="status-short">{status.shortName}</span>
                      )}
                    </Styled.Tag>
                  </div>
                </Styled.StatusContainer>
              )}
            </Styled.Row>
          </Styled.Thumbnail>
        </Styled.Card>
        <NotificationDot notification={notification} {...pt.notificationDot} />
      </Styled.Wrapper>
    )
  },
)

// if the element has editable class, then it is editable
const clickedEditableElement = (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
  const target = e.target as HTMLElement
  return target.closest('.editable')
}
