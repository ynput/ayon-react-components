import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Panel } from '../../Panels/Panel'
import { WatcherSelect, WatcherSelectProps } from './WatcherSelect'
import { allUsers, selectedUsers } from '../helpers'

const meta: Meta<typeof WatcherSelect> = {
  component: WatcherSelect,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof WatcherSelect>

const currentUser = allUsers[0].name

const initArgs: WatcherSelectProps = {
  options: allUsers,
  value: selectedUsers,
  currentUser,
}

const Template = (args: WatcherSelectProps) => {
  const [value, setValue] = useState(args.value)

  return (
    <Panel style={{ margin: 32, maxWidth: 200, padding: 16 }}>
      <WatcherSelect {...initArgs} {...args} value={value} onChange={(names) => setValue(names)} />
    </Panel>
  )
}

export const Default: Story = {
  render: Template,
  args: {
    value: selectedUsers,
  },
}
