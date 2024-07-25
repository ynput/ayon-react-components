import type { Meta, StoryObj } from '@storybook/react'
import { AssigneeSelect, AssigneeSelectProps } from '.'
import { useState } from 'react'
import usersData from './users.json'
import { Panel } from '../../Panels/Panel'

const meta: Meta<typeof AssigneeSelect> = {
  component: AssigneeSelect,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AssigneeSelect>

// randomly attach an image to the user
export const allUsers = usersData.map((user, i) => {
  let avatarUrl

  if (Math.random() > 0.5) {
    avatarUrl = `https://repo.imm.cz/avatars/demouser${i + 10}.jpg`
  }

  return {
    ...user,
    avatarUrl,
  }
})

const getRandomUsers = (number?: number) => {
  // if no number, create random between 1 and 5
  number = number || Math.floor(Math.random() * 5) + 1
  const randomUsers = []
  for (let i = 0; i < number; i++) {
    randomUsers.push(allUsers[Math.floor(Math.random() * allUsers.length)])
  }
  return randomUsers
}

export const selectedUsers = getRandomUsers().map((user) => user.name)

const initArgs: AssigneeSelectProps = {
  value: selectedUsers,
  options: allUsers,
}

const Template = (args: AssigneeSelectProps) => {
  const [value, setValue] = useState(args.value)

  return (
    <Panel style={{ margin: 32, maxWidth: 200, padding: 16 }}>
      <AssigneeSelect {...initArgs} {...args} value={value} onChange={(names) => setValue(names)} />
    </Panel>
  )
}

export const Default: Story = {
  render: Template,
  args: {
    value: selectedUsers,
  },
}
export const SelectAll: Story = {
  render: Template,
  args: {
    value: [],
    onSelectAll: () => {
      console.log('selected all users')
    },
  },
}
export const MissingUser: Story = {
  render: Template,
  args: {
    value: [...selectedUsers, 'jack.will'],
    onSelectAll: undefined,
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
    readOnly: true,
    align: 'left',
  },
}
