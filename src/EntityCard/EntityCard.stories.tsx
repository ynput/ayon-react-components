import type { Meta, StoryObj } from '@storybook/react'
import { EntityCard, EntityCardProps, PriorityType } from '.'
import { MouseEvent, useEffect, useState } from 'react'
import { Toolbar } from '../Layout/Toolbar'
import { Button } from '../Button'
import { Panel } from '../Panels/Panel'
import DnDTemplate from './DnD/DnDTemplate'
import getRandomImage from '../helpers/getRandomImage'
import styled from 'styled-components'
import clsx from 'clsx'
import { allUsers } from '../Dropdowns/helpers'
import prioritiesData from './priorities.json'
import { randomStatus, statuses } from '../Dropdowns/StatusSelect'

const meta: Meta<typeof EntityCard> = {
  component: EntityCard,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof EntityCard>

interface DataProps extends EntityCardProps {}

const priorities = prioritiesData as PriorityType[]

// pick 1 - 3 users randomly from the array
const randomUsers = allUsers
  .sort(() => 0.5 - Math.random())
  .slice(0, Math.floor(Math.random() * 3) + 1)

const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]

const initData: DataProps = {
  header: 'ep103sq002',
  path: 'ep103',
  title: 'Lighting',
  titleIcon: 'lightbulb',
  imageIcon: 'lightbulb',
  isPlayable: true,
  users: randomUsers,
  status: randomStatus,
  priority: randomPriority,
  imageUrl: Math.random() > 0.5 ? getRandomImage() : undefined,
}

type TemplateProps = DataProps

const Template = ({ onActivate, ...props }: TemplateProps) => {
  const [isActive, setIsActive] = useState(false)
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ width: 250 }}>
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

const LoadingTemplate = (props: EntityCardProps) => {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const getFakeData = (isImage: boolean) => {
    const newData: DataProps = {}
    for (const key in initData) {
      if (key === 'imageUrl' && !isImage) {
        newData[key as keyof DataProps] = ''
      } else {
        newData[key as keyof DataProps] = props[key as keyof DataProps]
      }
    }

    return newData
  }

  const simulateLoading = (isSuccess: boolean, isError: boolean, duration = 1000) => {
    // reset state
    setIsLoading(true)
    setIsError(false)
    setData({})

    // fake loading
    const timeout = setTimeout(() => {
      setIsLoading(false)
      let newData = getFakeData(isSuccess)

      if (isError) {
        newData = {}
      }
      setData(newData)
      setIsError(isError)
    }, duration)

    return timeout
  }

  useEffect(() => {
    const timeout = simulateLoading(true, false)

    // clear timeout
    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [])

  //   when the user changes the props
  useEffect(() => {
    if (isLoading) return
    const newData = getFakeData(true)
    setData(newData)
  }, [props])

  return (
    <Panel>
      <Toolbar
        style={{
          marginBottom: 20,
        }}
      >
        <Button onClick={() => simulateLoading(false, false)}>Simulate No Image</Button>
        <Button onClick={() => simulateLoading(true, false)}>Simulate Success</Button>
        <Button onClick={() => simulateLoading(false, true)}>Simulate Error</Button>
      </Toolbar>

      <EntityCard
        {...{
          isLoading,
          isError,
          isActive,
        }}
        style={{ width: 210 }}
        {...props}
        {...data}
        onActivate={() => setIsActive(!isActive)}
      />
    </Panel>
  )
}

const StatusWrapper = styled.div`
  display: flex;
  gap: 16px;
`

const StyledCell = styled.div`
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
  const [selectedPriority, setSelectedPriority] = useState(props.priority?.name)

  const handleChange = (change: any, key: string) => {
    console.log('changed:', change, key)
  }

  const users = props.assigneeOptions?.filter((u) => selectedUsers.includes(u.name)) || []
  const status = statuses.find((s) => s.name === selectedStatus)
  const priority = priorities.find((p) => p.name === selectedPriority)

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

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    handleChange(value, 'status')
  }

  const handlePriorityChange = (value: string) => {
    setSelectedPriority(value)
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

export const Default: Story = {
  args: {
    notification: undefined,
    disabled: false,
    ...initData,
  },
  render: LoadingTemplate,
}

export const TaskStatus: Story = {
  args: {
    variant: 'status',
    notification: undefined,
    disabled: false,
    ...initData,
    isPlayable: false,
    header: undefined,
    path: undefined,
    isDraggable: false,
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

export const Grid: Story = {
  args: {
    ...initData,
    notification: undefined,
    disabled: false,
  },
  render: LoadingTemplate,
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
