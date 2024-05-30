import type { Meta, StoryObj } from '@storybook/react'
import { AssigneeSelect, AssigneeSelectProps } from '.'
import { useState } from 'react'
import usersData from './users.json'

const meta: Meta<typeof AssigneeSelect> = {
  component: AssigneeSelect,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AssigneeSelect>

// randomly attach an image to the user
const allUsers = usersData.map((user, i) => {
  let avatarUrl
  if (Math.random() < 0.1) {
    avatarUrl = 'broken-url'
  }

  if (Math.random() > 0.5) {
    avatarUrl = `https://repo.imm.cz/avatars/demouser${i + 10}.jpg`
  }

  return {
    ...user,
    avatarUrl,
  }
})

const getRandomUsers = (number = 2) => {
  const randomUsers = []
  for (let i = 0; i < number; i++) {
    randomUsers.push(allUsers[Math.floor(Math.random() * allUsers.length)])
  }
  return randomUsers
}

const selectedUsers = getRandomUsers().map((user) => user.name)

const initArgs: AssigneeSelectProps = {
  value: selectedUsers,
  options: allUsers,
  editor: true,
}

const Template = (args: AssigneeSelectProps) => {
  const [value, setValue] = useState(args.value)

  return (
    <AssigneeSelect {...initArgs} {...args} value={value} onChange={(names) => setValue(names)} />
  )
}

export const Default: Story = {
  render: Template,
  args: {
    value: [],
  },
}
export const Custom: Story = {
  render: Template,
  args: {
    emptyMessage: 'Assignees',
    emptyIcon: 'group',
    value: [],
  },
}
export const ReadOnly: Story = {
  render: Template,
  args: {
    emptyMessage: 'Assignees',
    emptyIcon: 'group',
    value: [selectedUsers[0]],
    editor: false,
  },
}
