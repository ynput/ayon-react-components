import type { Meta, StoryObj } from '@storybook/react'
import { Panel } from '.'

const meta: Meta<typeof Panel> = {
  component: Panel,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Panel>

const Template = () => (
  <Panel style={{ overflow: 'auto', maxHeight: '50vh' }}>
    <h2>{'Panel'}</h2>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
    <p>This is a panel. It has a background color and padding.</p>
  </Panel>
)

export const Default: Story = {
  render: Template,
}
