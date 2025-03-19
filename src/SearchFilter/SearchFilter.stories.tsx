import { Meta, StoryObj } from '@storybook/react'
import { SearchFilter } from './SearchFilter'
import { useState } from 'react'
import { Filter, Option } from './types'

const meta: Meta<typeof SearchFilter> = {
  component: SearchFilter,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SearchFilter>

const options: Option[] = [
  {
    id: 'status',
    label: 'Status',
    operator: 'OR',
    icon: 'check_circle',
    allowExcludes: true,
    allowHasValue: true,
    allowNoValue: true,
    allowsCustomValues: true,
    operatorChangeable: true,

    values: [
      { id: 'waiting', label: 'Waiting', color: '#FFA500', icon: 'hourglass_empty' },
      { id: 'inProgress', label: 'In Progress', color: '#4CAF50', icon: 'play_circle' },
      { id: 'completed', label: 'Completed', color: '#2196F3', icon: 'check_circle' },
      { id: 'error', label: 'Error', color: '#F44336', icon: 'error' },
      { id: 'paused', label: 'Paused', color: '#9C27B0', icon: 'pause_circle' },
      { id: 'cancelled', label: 'Cancelled', color: '#757575', icon: 'cancel' },
    ],
  },
  {
    id: 'priority',
    label: 'Priority',
    icon: 'star',
    operator: 'AND',
    allowExcludes: false,
    allowHasValue: false,
    allowNoValue: false,
    allowsCustomValues: false,
    operatorChangeable: false,
    values: [
      { id: 'high', label: 'High', color: '#FF0000', icon: 'star' },
      { id: 'medium', label: 'Medium', color: '#FFA500', icon: 'star_half' },
      { id: 'low', label: 'Low', color: '#008000', icon: 'star_outline' },
    ],
  },
]

const Template = (args: Story['args']) => {
  const [filters, setFilters] = useState<Filter[]>([])

  return (
    <SearchFilter
      {...args}
      options={options}
      filters={filters}
      onChange={setFilters}
      enableGlobalSearch
      allowedSearchChildren={['status']}
      globalSearchLabel="Global search"
    />
  )
}

export const Default: Story = {
  args: {},
  render: Template,
}
