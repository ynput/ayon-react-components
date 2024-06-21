import { Meta, StoryObj } from '@storybook/react'
import { ShortcutTag } from './ShortcutTag'

const meta: Meta<typeof ShortcutTag> = {
  component: ShortcutTag,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ShortcutTag>

const Template = (args: Story['args']) => {
  return <ShortcutTag {...args} />
}

export const Default: Story = {
  args: {
    children: 'Ctrl + S',
  },
  render: Template,
}
