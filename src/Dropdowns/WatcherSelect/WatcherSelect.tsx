import { AssigneeSelectProps } from '../AssigneeSelect'
import { DropdownRef } from '../Dropdown'
import { forwardRef } from 'react'
import * as Styled from './WatcherSelect.styled'
import clsx from 'clsx'

export interface WatcherSelectProps extends Omit<AssigneeSelectProps, 'emptyMessage'> {
  currentUser: string
  isWatching?: boolean
}

export const WatcherSelect = forwardRef<DropdownRef, WatcherSelectProps>(
  ({ currentUser, isWatching, onSelectionChange, ...props }, ref) => {
    // is the current user a watcher
    const currentUserWatcher = (currentUser && props.value.includes(currentUser)) || isWatching

    const handleWatch = (selected: string[]) => {
      // check if the current user is not a watcher
      if (!currentUserWatcher && currentUser) {
        // add the current user to the watchers
        const newWatchers = [...selected, currentUser]
        // call the onChange function with the new watchers
        props.onChange && props.onChange(newWatchers)
      }
    }

    const handleUnwatch = (selected: string[]) => {
      // check if the current user is a watcher
      if (currentUserWatcher) {
        // remove the current user from the watchers
        const newWatchers = selected.filter((watcher) => watcher !== currentUser)
        // call the onChange function with the new watchers
        props.onChange && props.onChange(newWatchers)
      }
    }

    const handleSelectionChange = (selection: string[]) => {
      // check if currentUser is in the selection
      const currentIsNowWatcher = selection.includes(currentUser)
      // check if this is different to the current state
      if (currentIsNowWatcher !== currentUserWatcher) {
        // call the appropriate function
        currentIsNowWatcher ? handleWatch(selection) : handleUnwatch(selection)
      }

      // forward on original onSelectionChange
      onSelectionChange && onSelectionChange(selection)
    }

    return (
      <Styled.AssigneeSelect
        ref={ref}
        valueTemplate={(value, selected, isOpen) => (
          <Styled.WatcherButton
            variant="text"
            selected={isOpen}
            icon={currentUserWatcher ? 'notifications_active' : 'notifications'}
            className={clsx({ watching: currentUserWatcher })}
          />
        )}
        selectAllKey={null}
        startContent={(value, selected) => (
          <Styled.StartContent>
            <Styled.WatchStateButton
              variant="text"
              icon="notifications_active"
              selected={currentUserWatcher}
              onClick={() => handleWatch(selected as string[])}
              data-tooltip="Notify me to changes."
            >
              <div className="content">
                <span className="title">Watch</span>
                <span className="description">Notify me to all changes.</span>
              </div>
            </Styled.WatchStateButton>
            <Styled.WatchStateButton
              variant="text"
              icon="notifications_off"
              selected={!currentUserWatcher}
              onClick={() => handleUnwatch(selected as string[])}
              data-import="Notify me only on @mentions or assignment."
            >
              <div className="content">
                <span className="title">Unwatch</span>
                <span className="description">Notify me only on @mentions.</span>
              </div>
            </Styled.WatchStateButton>
          </Styled.StartContent>
        )}
        onSelectionChange={(s) => handleSelectionChange(s as string[])}
        multiSelectClose={undefined} // remove autoclose on 1
        {...props}
      />
    )
  },
)
