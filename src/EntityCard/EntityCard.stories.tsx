import type { Meta, StoryObj } from '@storybook/react'
import { EntityCard, EntityCardProps, StatusType } from '.'
import { useEffect, useState } from 'react'
import { Toolbar } from '../Layout/Toolbar'
import { Button } from '../Button'
import { Panel } from '../Panels/Panel'
import DnDTemplate from './DnD/DnDTemplate'
import getRandomImage from '../helpers/getRandomImage'

const meta: Meta<typeof EntityCard> = {
  component: EntityCard,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof EntityCard>

interface DataProps extends EntityCardProps {}

const statuses: { [name: string]: StatusType } = {
  ready: { label: 'Ready to start', color: 'rgb(186, 186, 186)', icon: 'timer' },
  progress: { label: 'In progress', color: 'rgb(52, 152, 219)', icon: 'clock_loader_40' },
  approved: { label: 'Approved', color: 'rgb(0, 240, 180)', icon: 'task_alt' },
  omitted: { label: 'Omitted', color: 'rgb(203, 26, 26)', icon: 'block' },
}

const priorities: { [name: string]: StatusType } = {
  low: { label: 'Low', color: 'rgb(186, 186, 186)', icon: 'keyboard_arrow_down' },
  medium: { label: 'Medium', color: 'rgb(52, 152, 219)', icon: 'check_indeterminate_small' },
  high: { label: 'High', color: 'rgb(0, 240, 180)', icon: 'keyboard_arrow_up' },
  urgent: { label: 'Critical', color: 'rgb(203, 26, 26)', icon: 'keyboard_double_arrow_up' },
}

const initData: DataProps = {
  header: 'ep103sq002',
  path: 'ep103',
  title: 'Lighting',
  titleIcon: 'lightbulb',
  isPlayable: true,
  users: [{ fullName: 'John Doe', name: 'john', avatarUrl: getRandomImage() }],
  status: statuses.approved,
  priority: priorities.urgent,
  imageUrl: getRandomImage(),
  icon: 'visibility',
  iconColor: '#FF982E',
}

const Template = (props: EntityCardProps) => {
  const [isActive, setIsActive] = useState(false)
  return (
    <div style={{ width: 250 }}>
      <EntityCard {...props} isActive={isActive} onActivate={() => setIsActive(!isActive)} />
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
        style={{ width: 225 }}
        {...props}
        {...data}
        onActivate={() => setIsActive(!isActive)}
      />
    </Panel>
  )
}

export const Default: Story = {
  args: {
    variant: 'full',
    notification: undefined,
    disabled: false,
    ...initData,
  },
  render: LoadingTemplate,
}

export const NoImage: Story = {
  args: {
    variant: 'full',
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
    variant: 'full',
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
