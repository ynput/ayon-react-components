import type { Meta, StoryObj } from '@storybook/react'
import { EnumDropdown, EnumDropdownProps } from '.'
import { useState } from 'react'
import { useEditOptionDialog } from '../Dropdown/EditOptionDialog.stories.helper'

const meta: Meta<typeof EnumDropdown> = {
  component: EnumDropdown,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof EnumDropdown>

const Template = ({ value: initValue, ...props }: EnumDropdownProps) => {
  const [value, setValue] = useState(initValue)

  return <EnumDropdown value={value} {...props} onChange={(value) => setValue(value)} />
}

const priorities: EnumDropdownProps['options'] = [
  {
    value: 'low',
    label: 'Low',
    icon: 'keyboard_double_arrow_down',
    color: '#9FA7B1',
  },
  {
    value: 'normal',
    label: 'Normal',
    color: '#9AC0E7',
    icon: 'check_indeterminate_small',
  },
  {
    value: 'high',
    label: 'High',
    color: '#FFAD66',
    icon: 'keyboard_arrow_up',
  },
  {
    value: 'urgent',
    label: 'Urgent',
    color: '#FF8585',
    icon: 'keyboard_double_arrow_up',
  },
]

const initArgs: Story['args'] = {
  onClear: undefined,
  onClearNull: undefined,
}

const priorityValue = 'low'

export const Priority: Story = {
  args: {
    ...initArgs,
    value: [priorityValue],
    options: priorities,
  },
  render: Template,
}
export const InverseColors: Story = {
  args: {
    ...initArgs,
    value: [priorityValue],
    options: priorities,
    colorInverse: true,
  },
  render: Template,
}
export const OnlyColors: Story = {
  args: {
    ...initArgs,
    value: [priorityValue],
    options: priorities.map(({ color, value, label }) => ({ color, value, label })),
  },
  render: Template,
}
export const OnlyIcons: Story = {
  args: {
    ...initArgs,
    value: [priorityValue],
    options: priorities.map(({ icon, value, label }) => ({ icon, value, label })),
  },
  render: Template,
}
export const OnlyLabels: Story = {
  args: {
    ...initArgs,
    value: [priorityValue],
    options: priorities.map(({ value, label }) => ({ value, label })),
  },
  render: Template,
}
export const MixedIconsAndColors: Story = {
  args: {
    ...initArgs,
    value: [priorityValue],
    // some options have icons, some have colors, some have both, some have neither
    options: [
      {
        value: 'low',
        label: 'Low',
        icon: 'keyboard_double_arrow_down',
        color: '#9FA7B1',
      },
      {
        value: 'normal',
        label: 'Normal',
        color: '#9AC0E7',
      },
      {
        value: 'high',
        label: 'High',
        icon: 'keyboard_arrow_up',
      },
      {
        value: 'urgent',
        label: 'Urgent',
      },
    ],
  },
  render: Template,
}

export const NoValue: Story = {
  args: {
    ...initArgs,
    value: [],
    options: priorities,
  },
  render: Template,
}

// each option can be edited in a dialog; typing a new one and editing it creates it with details
export const EditOptions: Story = {
  args: { ...initArgs, value: ['high'], search: true },
  render: (args) => {
    const [value, setValue] = useState<EnumDropdownProps['value']>(args.value)
    const [options, setOptions] = useState(priorities)
    const { onEditOption, dialog } = useEditOptionDialog({
      fields: ['label', 'color'],
      onSave: ({ value, label, color }, isNew) =>
        setOptions(
          isNew
            ? [...options, { value, label: label || value, color }]
            : options.map((o) => (o.value === value ? { ...o, label: label || value, color } : o)),
        ),
    })

    return (
      <>
        <EnumDropdown
          {...args}
          value={value}
          options={options}
          editable
          onChange={setValue}
          onEditOption={onEditOption}
        />
        {dialog}
      </>
    )
  },
}
