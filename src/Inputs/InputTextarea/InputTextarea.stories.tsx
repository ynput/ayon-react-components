import type { Meta, StoryObj } from '@storybook/react'
import { InputTextarea } from '.'

const meta: Meta<typeof InputTextarea> = {
  component: InputTextarea,
}

export default meta

type Story = StoryObj<typeof InputTextarea>

export const Default: Story = {
  args: {
    value: 'For longer input, use textarea.',
    placeholder: 'Start typing here...',
    disabled: false,
    onChange: () => console.log('Text Changed'),
  },
}
