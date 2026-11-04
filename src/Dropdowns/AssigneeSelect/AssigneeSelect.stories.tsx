import type { Meta, StoryObj } from '@storybook/react'
import { AssigneeSelect, AssigneeSelectProps } from '.'
import { useState } from 'react'
import { Panel } from '../../Panels/Panel'
import { allUsers, selectedUsers } from '../helpers'
import { applyMixedChange, getMixedCounts, type MixedChange } from '../Dropdown/mixedValues'

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

const MixedTemplate = (args: AssigneeSelectProps) => {
  const [value, setValue] = useState(args.value)

  const handleChange = (added: string[], removed: string[]) => {
    const newValue = [...value]

    added.forEach((name) => {
      if (!newValue.includes(name)) {
        newValue.push(name)
      }
    })

    removed.forEach((name) => {
      const index = newValue.indexOf(name)
      if (index !== -1) {
        newValue.splice(index, 1)
      }
    })

    console.log(newValue)

    setValue(newValue)
  }

  return (
    <Panel style={{ margin: 32, maxWidth: 200, padding: 16 }}>
      <AssigneeSelect {...initArgs} {...args} value={value} onChange={handleChange} />
    </Panel>
  )
}

export const Mixed: Story = {
  render: MixedTemplate,
  args: {
    value: ['dgarcia_dev'],
    onSelectAll: undefined,
    isMultiple: true,
    multipleOverride: false,
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

// assigning several tasks: each user is added to, removed from or left on every task
const SeveralTasksTemplate = (args: AssigneeSelectProps) => {
  const names = allUsers.map((user) => user.name)
  const [tasks, setTasks] = useState<string[][]>([
    names.slice(0, 2),
    names.slice(0, 1),
    names.slice(1, 3),
  ])
  const assignees = [...new Set(tasks.flat())]

  const handleMixedChange = (change: MixedChange) => {
    console.log(change)
    setTasks(tasks.map((taskAssignees) => applyMixedChange(taskAssignees, change)))
  }

  return (
    <Panel style={{ margin: 32, maxWidth: 200, padding: 16 }}>
      <AssigneeSelect
        {...initArgs}
        {...args}
        value={assignees}
        mixedCounts={getMixedCounts(tasks)}
        mixedTotal={tasks.length}
        mixedLabel="tasks"
        onMixedChange={handleMixedChange}
      />
      <ul>
        {tasks.map((taskAssignees, i) => (
          <li key={i}>{taskAssignees.join(', ') || '-'}</li>
        ))}
      </ul>
    </Panel>
  )
}

export const SeveralTasks: Story = {
  render: SeveralTasksTemplate,
  args: {
    onSelectAll: undefined,
  },
}
