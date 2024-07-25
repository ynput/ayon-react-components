import type { Meta, StoryObj } from '@storybook/react'
import { AssigneeSelect, AssigneeSelectProps } from '.'
import { useState } from 'react'
import { Panel } from '../../Panels/Panel'
import { allUsers, selectedUsers } from '../helpers'

const meta: Meta<typeof AssigneeSelect> = {
  component: AssigneeSelect,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AssigneeSelect>

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
