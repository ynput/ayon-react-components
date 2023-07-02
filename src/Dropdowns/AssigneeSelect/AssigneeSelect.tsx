import { AssigneeField, AssigneeDropdownTemplate, AssigneeFieldProps } from '.'
import { Dropdown, DropdownProps } from '../Dropdown'
import { forwardRef, useMemo } from 'react'

export interface AssigneeSelectProps extends Omit<DropdownProps, 'onChange' | 'emptyMessage'> {
  value: string[]
  options: {
    name: string
    fullName?: string
    avatarUrl?: string
  }[]
  editor?: boolean
  onChange?: (names: string[]) => void
  widthExpand?: boolean
  disabled?: boolean
  align?: 'left' | 'right'
  isMultiple?: boolean
  placeholder?: string
  emptyIcon?: AssigneeFieldProps['emptyIcon']
  emptyMessage?: AssigneeFieldProps['emptyMessage']
  size?: AssigneeFieldProps['size']
  assigneeProps?: AssigneeFieldProps
  onAssigneeFieldClick?: AssigneeFieldProps['onClick']
}

export const AssigneeSelect = forwardRef<HTMLDivElement, AssigneeSelectProps>(
  (
    {
      value = [],
      options = [],
      onChange,
      widthExpand,
      disabled,
      editor,
      align,
      isMultiple,
      placeholder,
      emptyIcon,
      emptyMessage: assigneeEmptyMessage,
      size,
      assigneeProps,
      onAssigneeFieldClick,
      ...props
    },
    ref,
  ) => {
    // useMemo assignedUsers Objects
    const assignedUsers = useMemo(
      () => options.filter((option) => value.includes(option.name)),
      [value, options],
    )

    const assigneeFieldProps = {
      value: assignedUsers,
      disabled,
      isMultiple,
      placeholder,
      emptyIcon,
      onClick: onAssigneeFieldClick,
      emptyMessage: assigneeEmptyMessage,
      size,
      ...assigneeProps,
    }

    if (!editor) return <AssigneeField {...assigneeFieldProps} />

    return (
      <Dropdown
        value={value}
        valueTemplate={(value, selected, isOpen) => (
          <AssigneeField
            {...assigneeFieldProps}
            value={
              isOpen ? options.filter((option) => selected.includes(option.name)) : assignedUsers
            }
          />
        )}
        options={options}
        dataKey={'name'}
        disabled={disabled}
        itemTemplate={(ops, isActive, isSelected) => (
          <AssigneeDropdownTemplate {...ops} isSelected={isSelected} />
        )}
        onChange={(names) => onChange && onChange(names.map((name) => name.toString() as string))}
        widthExpand={widthExpand}
        align={align}
        multiSelect
        search
        searchFields={['name', 'fullName', 'email']}
        ref={ref}
        {...props}
      />
    )
  },
)
