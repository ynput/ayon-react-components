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

const Template = (props: EntityCardProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const simulateLoading = (isSuccess: boolean, isError: boolean) => {
    setIsLoading(true)
    setIsError(false)
    setIsSuccess(false)
    const timeout = setTimeout(() => {
      setIsLoading(false)
      setIsError(isError)
      setIsSuccess(isSuccess)
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
          isSuccess,
          isError,
          isActive,
        }}
        style={{ width: 225 }}
        onClick={() => setIsActive(!isActive)}
        {...props}
      />
    </Panel>
  )
}

export const Default: Story = {
  args: {
    title: 'Lighting',
    titleIcon: 'lightbulb',
    subtitle: 'sc0120sh0130',
    description: 'demo_Big_Episodic/episodes/ep103/ep103sq002',
    imageUrl: 'https://picsum.photos/225/127',
    imageAlt: 'random image',
    icon: 'visibility',
    iconColor: 'FF982E',
    variant: 'full',
  },
  render: Template,
}
