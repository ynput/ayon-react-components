import type { Meta, StoryObj } from '@storybook/react'
import { ScrollPanel } from '.'

const meta: Meta<typeof ScrollPanel> = {
  component: ScrollPanel,
}

export default meta

type Story = StoryObj<typeof ScrollPanel>

const Template = () => (
  <ScrollPanel
    style={{
      maxHeight: '200px',
    }}
  >
    <h2>{'ScrollPanel'}</h2>
    <p>This is a panel that scrolls. It has a background color and padding.</p>
    <ul>
      <li>One</li>
      <li>Two</li>
      <li>Three</li>
      <li>Four</li>
      <li>Five</li>
      <li>Six</li>
      <li>Seven</li>
      <li>Eight</li>
      <li>Nine</li>
      <li>Ten</li>
    </ul>
  </ScrollPanel>
)

export const Default: Story = {
  render: Template,
}
