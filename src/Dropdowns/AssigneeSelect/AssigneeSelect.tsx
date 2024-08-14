import { AssigneeField, AssigneeDropdownTemplate, AssigneeFieldProps } from '.'
import { Dropdown, DropdownProps, DropdownRef } from '../Dropdown'
import { forwardRef, useMemo } from 'react'

export interface AssigneeSelectProps extends Omit<DropdownProps, 'onChange' | 'emptyMessage'> {
  value: string[]
  options: {
    name: string
    fullName?: string | null
    avatarUrl?: string
  }[]
  readOnly?: boolean
  onChange?: (names: string[]) => void
  widthExpand?: boolean
  disabled?: boolean
  align?: 'left' | 'right'
  isMultiple?: boolean
  placeholder?: string
  sortBySelected?: boolean
  emptyIcon?: AssigneeFieldProps['emptyIcon']
  emptyMessage?: AssigneeFieldProps['emptyMessage']
  size?: AssigneeFieldProps['size']
  assigneeProps?: AssigneeFieldProps
  onAssigneeFieldClick?: AssigneeFieldProps['onClick']
}

export const AssigneeSelect = forwardRef<DropdownRef, AssigneeSelectProps>(
  (
    {
      value = [],
      options = [],
      onChange,
      widthExpand,
      disabled,
      readOnly,
      align,
      isMultiple,
      placeholder,
      emptyIcon,
      emptyMessage: assigneeEmptyMessage,
      size,
      assigneeProps,
      sortBySelected = true,
      onAssigneeFieldClick,
      selectAllKey = '__all__',
      multiSelect = true,
      disabledValues = [],
      className,
      ...props
    },
    ref,
  ) => {
    // useMemo assignedUsers Objects
    const assignedUsers = useMemo(
      () => options.filter((option) => value.includes(option.name)),
      [value, options],
    )

    // sort options by fullName || name
    const sortedOptions = useMemo(
      () =>
        [...options].sort((a, b) => {
          const aName = a.fullName || a.name
          const bName = b.fullName || b.name
          return aName.localeCompare(bName)
        }),
      [options],
    )

    const assigneeFieldProps = {
      users: assignedUsers,
      disabled,
      isMultiple,
      placeholder,
      emptyIcon,
      onClick: onAssigneeFieldClick,
      emptyMessage: assigneeEmptyMessage,
      size,
      align,
      widthExpand,
      ...assigneeProps,
    }

    if (readOnly) return <AssigneeField {...assigneeFieldProps} className={className} />

    const isAllSelected = value.length >= options.length

    return (
      <Dropdown
        value={value}
        valueTemplate={(value, selected, isOpen) => (
          <AssigneeField
            {...assigneeFieldProps}
            users={
              isOpen ? options.filter((option) => selected.includes(option.name)) : assignedUsers
            }
            value={value}
            allSelected={!!(isAllSelected && props.onSelectAll)}
          />
        )}
        options={sortedOptions}
        dataKey={'name'}
        disabled={disabled}
        itemTemplate={(ops, isActive, isSelected) => (
          <AssigneeDropdownTemplate
            {...ops}
            isSelected={isSelected}
            selectAll={props.onSelectAll && selectAllKey}
            allSelected={!!(isAllSelected && props.onSelectAll)}
          />
        )}
        onChange={(names) => onChange && onChange(names.map((name) => name.toString() as string))}
        widthExpand={widthExpand}
        align={align}
        multiSelect={multiSelect}
        multiSelectClose={value.length === 0}
        search
        searchFields={['fullName', 'name', 'email']}
        ref={ref}
        sortBySelected={sortBySelected}
        selectAllKey={selectAllKey}
        missingValueMessage={'Some users no longer exist. Click to remove.'}
        className={className}
        {...props}
      />
    )
  },
)
