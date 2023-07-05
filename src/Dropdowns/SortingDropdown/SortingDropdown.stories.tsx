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

export const Default: Story = {
  args: {
    value: [
      {
        id: 'shot',
        label: 'Shot',
        sortOrder: true,
      },
    ],
    options: [
      {
        id: 'shot',
        label: 'Shot',
      },
      {
        id: 'dueDate',
        label: 'Due date',
      },
      {
        id: 'status',
        label: 'Status',
      },
      {
        id: 'assignee',
        label: 'Assignee',
      },
    ],
  },
  render: Template,
}
