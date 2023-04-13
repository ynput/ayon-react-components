import type { Meta, StoryObj } from '@storybook/react'
import { Spacer } from '.'

const meta: Meta<typeof Spacer> = {
  component: Spacer,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Spacer>

const Template = () => (
  <div
    style={{
      display: 'flex',
      width: '100%',
    }}
  >
    <h2>{'Spacer ->'}</h2>
    <Spacer
      style={{
        backgroundColor: 'lightblue',
      }}
    />
    <h2>{'<- Spacer'}</h2>
  </div>
)

export const Default: Story = {
  render: Template,
}
