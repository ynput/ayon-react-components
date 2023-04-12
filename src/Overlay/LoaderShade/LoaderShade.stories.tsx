import type { Meta, StoryObj } from '@storybook/react'
import { LoaderShade } from '.'

const meta: Meta<typeof LoaderShade> = {
  component: LoaderShade,
}

export default meta

type Story = StoryObj<typeof LoaderShade>

export const Default: Story = {
  args: {
    message: 'Loading...',
  },
}
