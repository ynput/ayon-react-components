import type { Meta, StoryObj } from '@storybook/react'
import { EntityCard, EntityCardProps } from '.'
import { MouseEvent, useState } from 'react'
import { Button } from '../Button'
import DnDTemplate from './DnD/DnDTemplate'
import getRandomImage from '../helpers/getRandomImage'
import styled from 'styled-components'
import clsx from 'clsx'
import { allUsers } from '../Dropdowns/helpers'
import prioritiesData from './priorities.json'
import { randomStatus, statuses } from '../Dropdowns/StatusSelect'
import { EnumDropdownOption } from '../Dropdowns/EnumDropdown'

const meta: Meta<typeof EntityCard> = {
  component: EntityCard,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof EntityCard>

interface DataProps extends EntityCardProps {}

const priorities = prioritiesData as EnumDropdownOption[]

// pick 1 - 3 users randomly from the array
const randomUsers = allUsers
  .sort(() => 0.5 - Math.random())
  .slice(0, Math.floor(Math.random() * 3) + 1)

const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]

type TemplateProps = DataProps

const Template = ({ onActivate, ...props }: TemplateProps) => {
  const [isActive, setIsActive] = useState(false)
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ width: '100%', maxWidth: 210 }}>
        <EntityCard
          isActive={isActive}
          onActivate={() => {
            setIsActive(!isActive)
            onActivate && onActivate()
          }}
          {...props}
        />
      </div>
    </div>
  )
}

const StatusWrapper = styled.div`
  display: flex;
  gap: 16px;
`

const StyledCell = styled.div`
  width: 250px;
  padding: 8px;
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  &:hover {
    background-color: var(--md-sys-color-secondary-container);
    border: 1px solid var(--md-sys-color-outline);
  }
  &.selected {
    background-color: var(--md-sys-color-primary-container);
    border-color: var(--md-sys-color-primary);
  }
`

const StatusTemplate = (props: TemplateProps) => {
  const [cellSelected, setCellSelected] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [selectedUsers, setSelectedUsers] = useState(props.users?.map((u) => u.name) || [])
  const [selectedStatus, setSelectedStatus] = useState(props.status?.name)
  const [selectedPriority, setSelectedPriority] = useState(props.priority?.value)

  const handleChange = (change: any, key: string) => {
    console.log('changed:', change, key)
  }

  const users = props.assigneeOptions?.filter((u) => selectedUsers.includes(u.name)) || []
  const status = statuses.find((s) => s.name === selectedStatus)
  const priority = priorities.find((p) => p.value === selectedPriority)

  const handleCellClick = (e: MouseEvent<HTMLDivElement>) => {
    // check if the click is editable item
    const target = e.target as HTMLElement
    if (target.closest('.editable')) {
      return
    }
    setCellSelected(!cellSelected)
  }

  let editingProps = {
    assigneeOptions: props.assigneeOptions,
    statusOptions: props.statusOptions,
    priorityOptions: props.priorityOptions,
  }
  if (!cellSelected)
    editingProps = {
      assigneeOptions: undefined,
      statusOptions: undefined,
      priorityOptions: undefined,
    }

  const handleAssigneeChange = (value: string[]) => {
    setSelectedUsers(value)
    handleChange(value, 'users')
  }

  const handleStatusChange = (value: string[]) => {
    setSelectedStatus(value[0])
    handleChange(value, 'status')
  }

  const handlePriorityChange = (value: string[]) => {
    setSelectedPriority(value[0])
    handleChange(value, 'priority')
  }

  return (
    <StatusWrapper>
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        icon={isCollapsed ? 'expand_all' : 'collapse_all'}
      >
        Collapse Toggle: {isCollapsed ? 'Collapsed' : 'Expanded'}
      </Button>
      <StyledCell onClick={handleCellClick} className={clsx({ selected: cellSelected })}>
        <Template
          {...props}
          isCollapsed={isCollapsed}
          {...editingProps}
          {...{
            users,
            status,
            priority,
          }}
          onAssigneeChange={handleAssigneeChange}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
        />
      </StyledCell>
    </StatusWrapper>
  )
}

const initData: DataProps = {
  header: 'ep103sq002',
  path: 'ep103',
  project: 'com',
  title: 'Lighting',
  titleIcon: 'lightbulb',
  imageIcon: 'lightbulb',
  isPlayable: true,
  users: Math.random() > 0.5 ? randomUsers : [],
  status: randomStatus,
  priority: randomPriority,
  imageUrl: Math.random() > 0.5 ? getRandomImage() : undefined,
}

export const Default: Story = {
  args: {
    ...initData,
    notification: { comment: true },
  },
  render: Template,
}

export const Loading: Story = {
  args: {
    isLoading: true,
    loadingSections: ['title', 'header', 'users', 'status', 'priority'],
  },
  render: Template,
}

export const TaskStatus: Story = {
  args: {
    variant: 'status',
    disabled: false,
    ...initData,
    isPlayable: false,
    header: undefined,
    path: undefined,
    isDraggable: false,
    statusMiddle: true,
  },
  render: (args) => <Template {...args} />,
}

export const ProgressView: Story = {
  args: {
    ...TaskStatus.args,
    variant: 'status',
    isActive: true,
    priorityOptions: priorities,
    assigneeOptions: allUsers,
    statusOptions: statuses,
    statusMiddle: true,
    statusNameOnly: true,
    isPlayable: true,
  },
  render: (args) => <StatusTemplate {...args} />,
}

export const NoImage: Story = {
  args: {
    notification: undefined,
    disabled: false,
    ...initData,
    imageUrl:
      'http://localhost:3000/api/projects/demo_Commercial/tasks/807fb5901dab11ef95ad0242ac180005/thumbnail?updatedAt=2024-07-12T11:19:27.045329+00:00',
  },
  render: Template,
}

export const Version: Story = {
  args: {
    ...initData,
    title: 'v001',
    titleIcon: undefined,
    header: 'animationChar1',
    priority: undefined,
    hidePriority: true,
    users: [allUsers[0]],
  },
  render: Template,
}

const columns = [
  { id: '1', items: ['1'] },
  { id: '2', items: ['2', '3'] },
  { id: '3', items: [] },
]

export const DnD: Story = {
  name: 'Drag and Drop',
  args: { ...Default.args },
  render: () => DnDTemplate({ ...Default.args, columns }),
}

const moreColumns = [
  { id: '1', items: ['1'] },
  { id: '2', items: ['2', '3'] },
  { id: '3', items: ['4', '5', '6'] },
  { id: '4', items: ['7'] },
  { id: '5', items: ['8', '9', '10', '11', '12'] },
  { id: '6', items: ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'] },
]

export const KanBan: Story = {
  name: 'KanBan',
  args: { ...Default.args },
  render: () =>
    DnDTemplate({
      ...Default.args,
      columns: moreColumns,
    }),
}
