import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SortCardType, SortingDropdown, SortingDropdownProps } from './SortingDropdown'

const meta: Meta<typeof SortingDropdown> = {
  component: SortingDropdown,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SortingDropdown>

const Template = ({ value: initialValue, ...props }: SortingDropdownProps) => {
  const [value, setValue] = useState<SortCardType[]>(initialValue)

  return <SortingDropdown {...props} value={value} onChange={setValue} />
}

const options: SortCardType[] = [
  {
    id: 'shot',
    label: 'Shot',
    sortOrder: true,
  },
  {
    id: 'dueDate',
    label: 'Due date',
    sortOrder: true,
  },
  {
    id: 'status',
    label: 'Status',
    sortOrder: true,
  },
  {
    id: 'assignee',
    label: 'Assignee',
    sortOrder: true,
  },
  {
    id: 'project',
    label: 'Project',
    sortOrder: true,
  },
]

export const SortBy: Story = {
  args: {
    value: [options[0]],
    options,
  },
  render: Template,
}

export const GroupBy: Story = {
  args: {
    title: 'Group by',
    value: [options[4]],
    options,
    maxSelected: 1,
  },
  render: Template,
}
