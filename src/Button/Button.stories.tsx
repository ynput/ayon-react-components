import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '.'

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    icon: 'search',
    label: 'Search Button',
    onClick: () => console.log('Search Button Clicked'),
    disabled: false,
  },
}

export const Link: Story = {
  args: {
    ...Default.args,
    label: 'Link',
    link: true,
  },
}

// icon only
export const Icon: Story = {
  args: {
    ...Default.args,
    label: undefined,
  },
}
