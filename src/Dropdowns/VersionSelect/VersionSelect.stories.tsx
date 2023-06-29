import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VersionSelectProps, VersionSelect } from './VersionSelect'
import { Button } from '../../Button'

const meta: Meta<typeof VersionSelect> = {
  component: VersionSelect,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VersionSelect>

const Template = ({ value: initValue, versions }: VersionSelectProps) => {
  const [value, setValue] = useState<string[]>(initValue)

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <VersionSelect {...{ value, versions, onChange: setValue }} />
      <Button icon="replay" onClick={() => setValue(initValue)} />
    </div>
  )
}

export const Default: Story = {
  args: {
    versions: [['v001', 'v002', 'v003', 'v010']],
    value: ['v001'],
  },
  render: Template,
}

export const Multiple: Story = {
  args: {
    ...Default.args,
    versions: [...(Default?.args?.versions || []), ['v001', 'v002', 'v010', 'v003', 'v005']],
    value: ['v002', 'v005'],
  },
  render: Template,
}
