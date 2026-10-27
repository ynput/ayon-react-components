import type { Meta, StoryObj } from '@storybook/react'
import { ColorPicker } from '.'
import { useState } from 'react'

const meta: Meta<typeof ColorPicker> = {
  component: ColorPicker,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ColorPicker>

const Template = (args: Story['args'] & { initial?: string }) => {
  const [value, setValue] = useState(args.initial)
  return <ColorPicker {...args} value={value} onChange={setValue} />
}

export const Default: Story = {
  render: (args) => <Template {...args} initial="#5b8cff" />,
}

// a colour that isn't suggested is shown first and marked
export const CustomValue: Story = {
  render: (args) => <Template {...args} initial="#123456" />,
}

export const NoValue: Story = {
  render: (args) => <Template {...args} />,
}
