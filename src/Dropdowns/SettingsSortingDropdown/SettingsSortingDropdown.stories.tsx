import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SettingsSortingDropdown, SettingsSortingDropdownProps } from './SettingsSortingDropdown'
import { SortCardType } from '../SortingDropdown/SortingDropdown'
import { Panel } from '../../Panels/Panel'

const meta: Meta<typeof SettingsSortingDropdown> = {
  title: 'Dropdowns/SettingsSortingDropdown',
  component: SettingsSortingDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SettingsSortingDropdown>

const options: SortCardType[] = [
  { id: 'shot', label: 'Shot', sortOrder: true },
  { id: 'dueDate', label: 'Due date', sortOrder: true },
  { id: 'status', label: 'Status', sortOrder: true },
  { id: 'assignee', label: 'Assignee', sortOrder: true },
  { id: 'project', label: 'Project', sortOrder: true },
]

const Template = ({ value: initialValue, ...props }: SettingsSortingDropdownProps) => {
  const [value, setValue] = useState<SortCardType[]>(initialValue)

  return (
    <Panel style={{ width: '20vw' }}>
      <SettingsSortingDropdown {...props} value={value} onChange={setValue} />
    </Panel>
  )
}

export const SortBy: Story = {
  args: {
    title: 'Sort by',
    icon: 'sort',
    value: [options[0]],
    options,
  },
  render: Template,
}

export const GroupBy: Story = {
  args: {
    title: 'Group by',
    icon: 'workspaces',
    value: [options[4]],
    options,
    maxSelected: 1,
  },
  render: Template,
}

export const HideSort: Story = {
  args: {
    title: 'Group by',
    icon: 'workspaces',
    value: [options[0], options[2]],
    options,
    hideSort: true,
  },
  render: Template,
}

export const DisableSort: Story = {
  args: {
    title: 'Sort by',
    icon: 'sort',
    value: [options[0], options[1]],
    options,
    disableSort: true,
  },
  render: Template,
}
