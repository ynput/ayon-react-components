import type { Meta, StoryObj } from '@storybook/react'
import { SettingsDropdown } from './SettingsDropdown'
import { Panel } from '../../Panels/Panel'

const meta = {
  title: 'Dropdowns/SettingsDropdown',
  component: SettingsDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SettingsDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Car',
    icon: 'car_rental',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    value: ['option1'],
  },
  render: (args) => {
    return (
      <Panel style={{ width: '20vw' }}>
        <SettingsDropdown {...args} />
      </Panel>
    )
  },
}
