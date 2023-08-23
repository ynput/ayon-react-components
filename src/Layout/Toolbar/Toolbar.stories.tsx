import type { Meta, StoryObj } from '@storybook/react'
import { Toolbar } from '.'
import { Panel } from '../../Panels/Panel'
import { Button } from '../../Button'
import { useState } from 'react'

const meta: Meta<typeof Toolbar> = {
  component: Toolbar,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Toolbar>

const Template = () => {
  const [active, setActive] = useState('home')

  const items = [
    { label: 'Home', value: 'home' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' },
  ]

  return (
    <Panel>
      <Toolbar>
        {items.map((item) => (
          <Button
            key={item.value}
            variant={'nav'}
            selected={active === item.value}
            onClick={() => setActive(item.value)}
            label={item.label}
          />
        ))}
      </Toolbar>
    </Panel>
  )
}

export const Default: Story = {
  render: Template,
}
