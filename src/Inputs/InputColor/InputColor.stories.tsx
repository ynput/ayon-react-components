import type { Meta, StoryObj } from '@storybook/react'
import { InputColor } from './InputColor'

const meta: Meta<typeof InputColor> = {
  component: InputColor,
}

export default meta

type Story = StoryObj<typeof InputColor>

export const Default: Story = {
  args: {
    value: '#000000',
    alpha: true,
    onChange: () => console.log('Color Changed'),
  },
}
