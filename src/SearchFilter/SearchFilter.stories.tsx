import { Meta, StoryObj } from '@storybook/react'
import { SearchFilter } from './SearchFilter'
import { useState } from 'react'
import { Filter, Option } from './types'
import { Button } from '../Buttons/Button'

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
    singleSelect: true,
    values: [
      { id: 'high', label: 'High', color: '#FF0000', icon: 'star' },
      { id: 'medium', label: 'Medium', color: '#FFA500', icon: 'star_half' },
      { id: 'low', label: 'Low', color: '#008000', icon: 'star_outline' },
    ],
  },
  {
    id: 'attrib.private',
    type: 'boolean',
    label: 'Private',
    operator: 'OR',
    inverted: false,
    values: [
      {
        id: 'true',
        label: 'Yes',
        icon: 'radio_button_checked',
      },
      {
        id: 'false',
        label: 'No',
        icon: 'radio_button_unchecked',
      },
    ],
    allowsCustomValues: true,
    allowHasValue: false,
    allowNoValue: false,
    allowExcludes: false,
    operatorChangeable: false,
    icon: 'lock',
    singleSelect: true,
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
      globalSearchConfig={{
        label: 'Global search',
      }}
      allowedSearchChildren={['status', 'attrib.private']}
    />
  )
}

export const Default: Story = {
  args: {},
  render: Template,
}

export const OperationsTemplate: Story = {
  args: {
    pt: {
      dropdown: {
        operationsTemplate: (
          <>
            <Button>Custom</Button>
          </>
        ),
      },
    },
  },
  render: Template,
}
