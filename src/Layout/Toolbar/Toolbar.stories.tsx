import type { Meta, StoryObj } from '@storybook/react'
import { Toolbar } from '.'

const meta: Meta<typeof Toolbar> = {
  component: Toolbar,
}

export default meta

type Story = StoryObj<typeof Toolbar>

const Template = () => (
  <div
    style={{
      display: 'flex',
      width: '100%',
    }}
  >
    <Toolbar
      style={{
        backgroundColor: '#292C2E',
        padding: '4px 16px',
      }}
    >
      <h2>{'Home'}</h2>
      <h2>{'About'}</h2>
      <h2>{'Contact'}</h2>
    </Toolbar>
  </div>
)

export const Default: Story = {
  render: Template,
}
