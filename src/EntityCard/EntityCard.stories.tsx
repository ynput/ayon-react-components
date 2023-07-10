import type { Meta, StoryObj } from '@storybook/react'
import { EntityCard, EntityCardProps } from '.'
import { useEffect, useState } from 'react'
import { Toolbar } from '../Layout/Toolbar'
import { Button } from '../Button'
import { Panel } from '../Panels/Panel'
// DND
import { DndContext } from '@dnd-kit/core'
import { Droppable } from './DnD/Droppable'
import { Draggable } from './DnD/Draggable'

const meta: Meta<typeof EntityCard> = {
  component: EntityCard,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof EntityCard>

const getRandomImage = () => {
  // random width between 200 and 1000
  const width = Math.floor(Math.random() * 800) + 200
  const height = Math.floor(Math.random() * 800) + 200
  const randomImage = `
https://picsum.photos/${width}/${height}
`

  return randomImage
}

interface DataProps extends EntityCardProps {}

const initData: DataProps = {
  title: 'Lighting',
  titleIcon: 'lightbulb',
  subTitle: 'sc0120sh0130',
  description: 'demo_Big_Episodic/episodes/ep103/ep103sq002',
  imageUrl: getRandomImage(),
  icon: 'visibility',
  iconColor: '#FF982E',
}

interface TemplateProps extends EntityCardProps {
  disableButtons?: boolean
}

const Template = (props: TemplateProps) => {
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
      {!props.disableButtons && (
        <Toolbar
          style={{
            marginBottom: 20,
          }}
        >
          <Button onClick={() => simulateLoading(false, false)}>Simulate No Image</Button>
          <Button onClick={() => simulateLoading(true, false)}>Simulate Success</Button>
          <Button onClick={() => simulateLoading(false, true)}>Simulate Error</Button>
        </Toolbar>
      )}
      <EntityCard
        {...{
          isLoading,
          isError,
          isActive,
        }}
        style={{ width: 225 }}
        onClick={() => setIsActive(!isActive)}
        {...props}
        {...data}
      />
    </Panel>
  )
}

export const Default: Story = {
  args: {
    variant: 'full',
    notification: undefined,
    isSecondary: false,
    disabled: false,
    ...initData,
  },
  render: Template,
}

interface DnDTemplateProps extends TemplateProps {}

const DnDTemplate = (props: DnDTemplateProps) => {
  const [column1, setColumn1] = useState([1])
  const [column2, setColumn2] = useState([])

  return (
    <DndContext>
      <Panel style={{ flexDirection: 'row' }}>
        <Droppable id={1}>
          {column1.map((item, index) => (
            <Draggable key={item} id={item}>
              <EntityCard key={index} {...props} {...initData} />
            </Draggable>
          ))}
        </Droppable>
        <Droppable id={2}>
          {column2.map((item, index) => (
            <Draggable key={item} id={item}>
              <EntityCard key={index} {...props} {...initData} />
            </Draggable>
          ))}
        </Droppable>
      </Panel>
    </DndContext>
  )
}

export const DnD: Story = {
  name: 'Drag and Drop',
  args: { ...Default.args },
  render: () => DnDTemplate({ ...Default.args, disableButtons: true }),
}
