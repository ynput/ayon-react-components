import type { Meta, StoryObj } from '@storybook/react'
import { randomStatus, statuses, StatusSelect, StatusSelectProps } from '.'
import { useState } from 'react'
import { Panel } from '../../Panels/Panel'

const meta: Meta<typeof StatusSelect> = {
  component: StatusSelect,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof StatusSelect>

type TemplateProps = StatusSelectProps & { width?: number }

const initArgs: StatusSelectProps = {
  value: [randomStatus.name],
  options: statuses,
}

const Template = ({ value, width, ...args }: TemplateProps) => {
  const [status, setStatus] = useState(value)

  return (
    <Panel style={{ margin: 32, maxWidth: 200, padding: 16, width: width || 'fit-content' }}>
      <StatusSelect {...args} value={status} onChange={(names) => setStatus([names])} />
    </Panel>
  )
}

export const Default: Story = {
  args: { ...initArgs },
  render: (args) => <Template {...args} width={500} />,
}
export const Inverted: Story = {
  args: { ...initArgs, invert: true },
  render: (args) => <Template {...args} />,
}

export const Multiple: Story = {
  args: { ...initArgs, multipleSelected: 2 },
  render: (args) => <Template {...args} width={500} />,
}
