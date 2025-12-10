import { Meta, StoryObj } from '@storybook/react'
import { SearchFilter, SearchFilterRef } from './SearchFilter'
import { useState, useRef } from 'react'
import { Filter, Option } from './types'
import { Button } from '../Buttons/Button'
import { Icon } from '../Icon'
import TaskFolderOptions from './task-folder-options.json'
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
      options={options}
      filters={filters}
      onChange={setFilters}
      enableGlobalSearch
      globalSearchConfig={{
        label: 'Global search',
      }}
      allowedSearchChildren={['status', 'attrib.private']}
      {...args}
    />
  )
}

export const Default: Story = {
  args: {
    options: options,
  },
  render: Template,
}

export const Scopes: Story = {
  args: {
    // @ts-ignore
    options: TaskFolderOptions,
    enableSearchChildren: true,
    allowedSearchChildren: undefined,
  },
  render: Template,
}

export const WithExternalControl: Story = {
  args: {},
  render: (args) => {
    const [filters, setFilters] = useState<Filter[]>([])
    const filterRef = useRef<SearchFilterRef>(null)

    return (
      <div>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
          <Button onClick={() => filterRef.current?.open()}>Open Filter</Button>
          <Button onClick={() => filterRef.current?.close()}>Close Filter</Button>
        </div>
        <SearchFilter
          ref={filterRef}
          options={options}
          filters={filters}
          onChange={setFilters}
          enableGlobalSearch
          globalSearchConfig={{
            label: 'Global search',
          }}
          allowedSearchChildren={['status', 'attrib.private']}
        />
      </div>
    )
  },
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

export const OptionsContent: Story = {
  args: {
    options: options.map((o) => ({ ...o, contentAfter: <Icon icon="circle" /> })),
    pt: {
      dropdown: {
        pt: {
          hasNoOption: {
            contentAfter: <Icon icon="bolt" />,
          },
          hasSomeOption: {
            contentAfter: <Icon icon="bolt" />,
          },
          item: {
            onClick: (event) => {
              const id = (event.target as HTMLLIElement).id
              if (id === 'noValue' || id === 'hasValue') {
                window.alert('You clicked on ' + id)
                return false
              } else return true
            },
          },
        },
      },
    },
  },
  render: Template,
}
