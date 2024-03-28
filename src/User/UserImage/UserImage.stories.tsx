import type { Meta, StoryObj } from '@storybook/react'
import { UserImage } from '.'

const meta: Meta<typeof UserImage> = {
  component: UserImage,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof UserImage>

// between 10 and 99
const randomUserNumber = Math.floor(Math.random() * 90) + 10

export const Default: Story = {
  args: {
    src: `https://repo.imm.cz/avatars/demouser${randomUserNumber}.jpg`,
    name: 'John'
  },
}
export const Initials: Story = {
  args: {
    fullName: 'Demo User',
    name: 'John'
  },
}
