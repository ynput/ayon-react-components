import type { Meta, StoryObj } from '@storybook/react'
import { UserImagesStacked } from '.'

const meta: Meta<typeof UserImagesStacked> = {
  component: UserImagesStacked,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof UserImagesStacked>

// create array of random users using avatars from 	https://repo.imm.cz/avatars/demouser[10-99].jpg
// use random names
// one user is self

const users = Array.from({ length: 10 }, (_, i) => ({
  avatarUrl: `https://repo.imm.cz/avatars/demouser${i + 10}.jpg`,
  fullName: `User ${i + 1}`,
  name: `Name ${i + 1}`,
  self: i === 0,
}))

export const Default: Story = {
  args: {
    users,
  },
}
