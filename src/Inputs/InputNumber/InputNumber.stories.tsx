import type { Meta, StoryObj } from '@storybook/react'
import { InputNumber } from '.'

const meta: Meta<typeof InputNumber> = {
  component: InputNumber,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof InputNumber>

export const Default: Story = {
  args: {
    value: 10,
    disabled: false,
    onChange: () => console.log('Number Changed'),
  },
}
