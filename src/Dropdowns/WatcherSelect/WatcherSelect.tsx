import { AssigneeSelectProps } from '../AssigneeSelect'
import { DropdownRef } from '../Dropdown'
import { forwardRef } from 'react'
import { StyledAssigneeSelect, StyledButton } from './WatcherSelect.styled'

export interface WatcherSelectProps extends Omit<AssigneeSelectProps, 'emptyMessage'> {
  currentUser?: string
  isWatching?: boolean
}

export const WatcherSelect = forwardRef<DropdownRef, WatcherSelectProps>(
  ({ currentUser, isWatching, ...props }, ref) => {
    // is the current user a watcher
    const currentUserWatcher = (currentUser && props.value.includes(currentUser)) || isWatching

    return (
      <StyledAssigneeSelect
        ref={ref}
        valueTemplate={(value, selected, isOpen) => (
          <StyledButton
            variant="text"
            selected={currentUserWatcher}
            icon={currentUserWatcher ? 'notifications_active' : 'notifications'}
          />
        )}
        {...props}
      />
    )
  },
)
