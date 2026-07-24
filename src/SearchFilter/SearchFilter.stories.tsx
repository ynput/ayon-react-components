import { Meta, StoryObj } from '@storybook/react'
import { SearchFilter, SearchFilterRef } from './SearchFilter'
import { useState, useRef } from 'react'
import { Filter, FilterOperator, Option } from './types'
import { Button } from '../Buttons/Button'
import { Icon } from '../Icon'
import { SearchFilterCustomRangeDebug } from './SearchFilterCustomRangeDebug'
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

const feedOptions: Option[] = [
  {
    id: 'comments',
    label: 'Comments',
    icon: 'chat',
    type: 'boolean',
    singleSelect: true,
    values: [],
  },
  {
    id: 'versions',
    label: 'Versions',
    icon: 'layers',
    type: 'boolean',
    singleSelect: true,
    values: [],
  },
  {
    id: 'updates',
    label: 'Updates',
    icon: 'arrow_circle_right',
    type: 'boolean',
    singleSelect: true,
    values: [],
  },
  {
    id: 'checklists',
    label: 'Checklists',
    icon: 'check_circle',
    type: 'boolean',
    singleSelect: true,
    values: [],
  },
  {
    id: 'has_attachments',
    label: 'Attachments',
    icon: 'attach_file',
    type: 'boolean',
    singleSelect: true,
    values: [],
  },
  {
    id: 'in_review_session',
    label: 'Review session',
    icon: 'subscriptions',
    type: 'boolean',
    singleSelect: true,
    values: [],
  },
  {
    id: 'category',
    label: 'Category',
    icon: 'label',
    type: 'list_of_strings',
    operator: 'OR',
    values: [
      {
        id: '__none__',
        label: 'No category',
        icon: 'crop_square',
      },
      {
        id: 'Guest',
        label: 'Guest',
        icon: 'crop_square',
        color: '#cd8de2',
      },
      {
        id: 'Director',
        label: 'Director',
        icon: 'crop_square',
        color: '#44ee9f',
      },
      {
        id: 'Private',
        label: 'Private',
        icon: 'crop_square',
        color: '#ff9a47',
      },
      {
        id: 'Blocked',
        label: 'Blocked',
        icon: 'crop_square',
        color: '#d51a1a',
      },
      {
        id: 'Sup Review',
        label: 'Sup Review',
        icon: 'crop_square',
        color: '#24b76b',
      },
    ],
  },
  {
    id: 'author',
    label: 'User',
    icon: 'person',
    type: 'list_of_strings',
    operator: 'OR',
    values: [
      {
        id: 'tatiana',
        label: 'Tatiana Phetisova',
        img: '/api/users/tatiana/avatar',
      },
      {
        id: 'tadeas',
        label: 'Tadeáš Hejnic',
        img: '/api/users/tadeas/avatar',
      },
      {
        id: 'sevag',
        label: 'Sevag Chamelian',
        img: '/api/users/sevag/avatar',
      },
      {
        id: 'roy',
        label: 'Roy Nieterau',
        img: '/api/users/roy/avatar',
      },
      {
        id: 'robin',
        label: 'Robin De Lillo',
        img: '/api/users/robin/avatar',
      },
      {
        id: 'philippe',
        label: 'Philippe Leprince',
        img: '/api/users/philippe/avatar',
      },
      {
        id: 'petr.kalis',
        label: 'PK',
        img: '/api/users/petr.kalis/avatar',
      },
      {
        id: 'petr.dvorak',
        label: 'Petr Dvorak',
        img: '/api/users/petr.dvorak/avatar',
      },
      {
        id: 'ondrej.samohel',
        label: 'Ondřej Samohel',
        img: '/api/users/ondrej.samohel/avatar',
      },
      {
        id: 'mustafa.zarkash',
        label: 'Mustafa Taher Zaky',
        img: '/api/users/mustafa.zarkash/avatar',
      },
      {
        id: 'murphy',
        label: 'Martin Ličko (murphy)',
        img: '/api/users/murphy/avatar',
      },
      {
        id: 'milan',
        label: 'Milan Kolar',
        img: '/api/users/milan/avatar',
      },
      {
        id: 'mila',
        label: 'Mila Kudr',
        img: '/api/users/mila/avatar',
      },
      {
        id: 'martin.wacker',
        label: 'Martin Wacker',
        img: '/api/users/martin.wacker/avatar',
      },
      {
        id: 'mahesh.kyadari',
        label: 'Mahesh Kyadari',
        img: '/api/users/mahesh.kyadari/avatar',
      },
      {
        id: 'luke',
        label: 'Luke',
        img: '/api/users/luke/avatar',
      },
      {
        id: 'libor.batek',
        label: 'Libor Batek',
        img: '/api/users/libor.batek/avatar',
      },
      {
        id: 'kayla',
        label: 'Kayla Man',
        img: '/api/users/kayla/avatar',
      },
      {
        id: 'jakub.trllo',
        label: 'Jakub Trllo',
        img: '/api/users/jakub.trllo/avatar',
      },
      {
        id: 'jakubs-test-account',
        label: "Jakub's Test Account",
        img: '/api/users/jakubs-test-account/avatar',
      },
      {
        id: 'jakubjezek001',
        label: 'Jakub Jezek',
        img: '/api/users/jakubjezek001/avatar',
      },
      {
        id: 'jakub.fiala',
        label: 'Jakub Fiala',
        img: '/api/users/jakub.fiala/avatar',
      },
      {
        id: 'jakub2.fiala',
        label: 'Jakub2 Fiala2',
        img: '/api/users/jakub2.fiala/avatar',
      },
      {
        id: 'filip',
        label: 'Filip Vnenčák',
        img: '/api/users/filip/avatar',
      },
      {
        id: 'filiipk0',
        label: 'Filip Vnencak',
        img: '/api/users/filiipk0/avatar',
      },
      {
        id: 'becky',
        label: 'Rebecca',
        img: '/api/users/becky/avatar',
      },
      {
        id: 'admin',
        label: 'AYON Admin',
        img: '/api/users/admin/avatar',
      },
    ],
  },
  {
    id: 'createdAt',
    label: 'Posted date',
    icon: 'calendar_today',
    type: 'datetime',
    values: [
      {
        id: 'custom-range',
        label: 'Custom range...',
        values: [],
        icon: 'tune',
      },
      {
        id: 'today',
        label: 'Today',
        values: [
          {
            label: 'Start of day',
            id: '2026-07-23T23:00:00.000Z',
          },
          {
            label: 'End of day',
            id: '2026-07-24T22:59:59.999Z',
          },
        ],
        icon: 'today',
      },
      {
        id: 'yesterday',
        label: 'Yesterday',
        values: [
          {
            label: 'Start of yesterday',
            id: '2026-07-22T23:00:00.000Z',
          },
          {
            label: 'End of yesterday',
            id: '2026-07-23T22:59:59.999Z',
          },
        ],
        icon: 'date_range',
      },
      {
        id: 'after-now',
        label: 'After today',
        values: [
          {
            label: 'After today',
            id: '2026-07-24T23:46:55.351Z',
          },
          {
            id: 'no-date',
            label: 'no-date',
          },
        ],
        icon: 'event_upcoming',
      },
      {
        id: 'before-now',
        label: 'Before today',
        values: [
          {
            id: 'no-date',
            label: 'no-date',
          },
          {
            label: 'Before today',
            id: '2026-07-23T23:46:55.351Z',
          },
        ],
        icon: 'event_busy',
      },
      {
        id: 'this-week',
        label: 'This week',
        values: [
          {
            label: 'Start of week',
            id: '2026-07-18T23:00:00.000Z',
          },
          {
            label: 'End of week',
            id: '2026-07-25T22:59:59.999Z',
          },
        ],
        icon: 'date_range',
      },
      {
        id: 'last-week',
        label: 'Last week',
        values: [
          {
            label: 'Start of last week',
            id: '2026-07-11T23:00:00.000Z',
          },
          {
            label: 'End of last week',
            id: '2026-07-18T22:59:59.999Z',
          },
        ],
        icon: 'date_range',
      },
      {
        id: 'this-month',
        label: 'This month',
        values: [
          {
            label: 'Start of month',
            id: '2026-06-30T23:00:00.000Z',
          },
          {
            label: 'End of month',
            id: '2026-07-31T22:59:59.999Z',
          },
        ],
        icon: 'calendar_month',
      },
      {
        id: 'last-month',
        label: 'Last month',
        values: [
          {
            label: 'Start of last month',
            id: '2026-05-31T23:00:00.000Z',
          },
          {
            label: 'End of last month',
            id: '2026-06-30T22:59:59.999Z',
          },
        ],
        icon: 'calendar_month',
      },
      {
        id: 'this-year',
        label: 'This year',
        values: [
          {
            label: 'Start of year',
            id: '2026-01-01T00:00:00.000Z',
          },
          {
            label: 'End of year',
            id: '2026-12-31T23:59:59.999Z',
          },
        ],
        icon: 'calendar_month',
      },
      {
        id: 'last-year',
        label: 'Last year',
        values: [
          {
            label: 'Start of last year',
            id: '2025-01-01T00:00:00.000Z',
          },
          {
            label: 'End of last year',
            id: '2025-12-31T23:59:59.999Z',
          },
        ],
        icon: 'calendar_month',
      },
    ],
  },
]

const Template = (args: Story['args']) => {
  const [filters, setFilters] = useState<Filter[]>([])
  const [operator, setOperator] = useState<FilterOperator>('AND')

  const handleChange = (newFilters: Filter[]) => {
    setFilters(newFilters)
  }

  return (
    <SearchFilter
      options={[]}
      {...args}
      rootOperator={operator}
      onRootOperatorChange={setOperator}
      filters={filters}
      onChange={handleChange}
    />
  )
}

export const Default: Story = {
  args: {
    options: options,
    enableGlobalSearch: true,
    allowedSearchChildren: ['status', 'attrib.private'],
  },
  render: Template,
}
export const FeedOptions: Story = {
  args: {
    options: feedOptions,
    enableGlobalSearch: true,
    allowedSearchChildren: ['status', 'attrib.private'],
    quickActions: [
      'comments',
      {
        id: 'checklists',
        label: '1/2',
        tooltip: 'Checklists',
      },
      {
        id: 'category',
        values: ['Guest', 'Director'],
      },
      'author',
    ],
    compact: true,
  },
  render: Template,
}

export const Scopes: Story = {
  args: {
    // @ts-ignore
    options: TaskFolderOptions,
    enableSearchChildren: true,
    allowedSearchChildren: undefined,
    enableGlobalSearch: true,
    enableAutosuggestion: true,
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

export const CustomRangeDebug: Story = {
  args: {
    enableGlobalSearch: true,
    allowedSearchChildren: ['status', 'attrib.private', 'createdAt'],
  },
  render: (args) => <SearchFilterCustomRangeDebug {...args} baseOptions={options} />,
}
