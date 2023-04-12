import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from '.'

const meta: Meta<typeof Divider> = {
  component: Divider,
}

export default meta

type Story = StoryObj<typeof Divider>

const Template = () => (
  <div>
    <h2>{'vvv Divider vvv'}</h2>
    <Divider
      style={{
        backgroundColor: 'lightblue',
      }}
    />
    <h2>{'^^^ Divider ^^^'}</h2>
  </div>
)

export const Default: Story = {
  render: Template,
}
