import type { Meta, StoryObj } from '@storybook/react'
import { AssigneeSelect, AssigneeSelectProps } from '.'
import { useState } from 'react'

const meta: Meta<typeof AssigneeSelect> = {
  component: AssigneeSelect,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AssigneeSelect>

const allUsers = Array.from({ length: 100 }, (_, i) => ({
  name: `user${i + 1}`,
  fullName: `User ${i + 1}`,
  avatarUrl: `https://repo.imm.cz/avatars/demouser${i + 10}.jpg`,
  email: `email${i + 1}@email.com`,
}))

const users = Array.from({ length: 3 }, (_, i) => ({
  name: `user${i + 1}`,
  fullName: `User ${i + 1}`,
  avatarUrl: `https://repo.imm.cz/avatars/demouser${i + 10}.jpg`,
  email: `email${i + 1}@email.com`,
}))

const Template = (args: AssigneeSelectProps) => {
  const initValue = users.map((user) => user.name)

  const [value, setValue] = useState(initValue)

  return (
    <AssigneeSelect
      {...args}
      options={allUsers}
      value={value}
      onChange={(names) => setValue(names)}
      editor
    />
  )
}

export const Default: Story = {
  render: Template,
}
