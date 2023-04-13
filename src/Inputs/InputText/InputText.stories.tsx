import type { Meta, StoryObj } from '@storybook/react'
import { InputText } from '.'

const meta: Meta<typeof InputText> = {
  component: InputText,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof InputText>

export const Default: Story = {
  args: {
    value: 'Hello World',
    placeholder: 'Enter text here...',
    disabled: false,
    onChange: () => console.log('Text Changed'),
  },
}
