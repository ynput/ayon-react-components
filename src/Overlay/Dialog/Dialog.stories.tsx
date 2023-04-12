import type { Meta, StoryObj } from '@storybook/react'
import { Dialog } from './Dialog'

const meta: Meta<typeof Dialog> = {
  component: Dialog,
}

export default meta

type Story = StoryObj<typeof Dialog>

const Template = () => {
  return (
    <Dialog>
      <span>Hello, This is a Dialog!</span>
    </Dialog>
  )
}

export const Default: Story = {
  render: () => Template(),
}
