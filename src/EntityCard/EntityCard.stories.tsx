import type { Meta, StoryObj } from '@storybook/react'
import { EntityCard, EntityCardProps } from '.'
import { useEffect, useState } from 'react'
import { Toolbar } from '../Layout/Toolbar'
import { Button } from '../Button'
import { Dropdown } from '../Dropdowns/Dropdown'
import { Panel } from '../Panels/Panel'

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

const fakeData = {
  title: 'Lighting',
  titleIcon: 'lightbulb',
  subTitle: 'sc0120sh0130',
  description: 'demo_Big_Episodic/episodes/ep103/ep103sq002',
  imageUrl: getRandomImage(),
  icon: 'visibility',
  iconColor: '#FF982E',
}

const Template = (props: EntityCardProps) => {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const simulateLoading = (isSuccess: boolean, isError: boolean) => {
    // reset state
    setIsLoading(true)
    setIsError(false)
    setData({})

    // fake loading
    const timeout = setTimeout(() => {
      setIsLoading(false)
      let newData = { ...fakeData }
      if (!isSuccess) {
        newData = {
          ...newData,
          imageUrl: '',
        }
      }
      setData(newData)
      setIsError(isError)
    }, 1000)

    return timeout
  }

  useEffect(() => {
    const timeout = simulateLoading(true, false)

    // clear timeout
    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [])

  console.log(data)

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
    isSecondary: false,
  },
  render: Template,
}
