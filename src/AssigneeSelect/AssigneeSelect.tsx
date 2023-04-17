import { AssigneeField, AssigneeDropdownTemplate } from '.'
import { Dropdown } from '../Dropdown'
import { forwardRef, useMemo } from 'react'

export interface AssigneeSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
}

export const AssigneeSelect = forwardRef<HTMLDivElement, AssigneeSelectProps>(
  ({ value = [], options = [], onChange, widthExpand, disabled, editor, align, ...props }, ref) => {
    // useMemo assignedUsers Objects
    const assignedUsers = useMemo(
      () => options.filter((option) => value.includes(option.name)),
      [value, options],
    )

    if (!editor) return <AssigneeField value={assignedUsers} {...props} />

    return (
      <Dropdown
        value={value}
        valueTemplate={() => <AssigneeField value={assignedUsers} {...props} />}
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
        searchFields={['name', 'fullName']}
        ref={ref}
      />
    )
  },
)
