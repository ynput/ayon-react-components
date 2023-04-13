import type { Meta, StoryObj } from '@storybook/react'
import { InputSwitch } from '.'

const meta: Meta<typeof InputSwitch> = {
  component: InputSwitch,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof InputSwitch>

export const Default: Story = {
  args: {
    value: 'true',
  },
}
