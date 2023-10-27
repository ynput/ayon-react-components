import type { Meta, StoryObj } from '@storybook/react'
import { InputSwitch } from '.'
import { useState } from 'react'

const meta: Meta<typeof InputSwitch> = {
  component: InputSwitch,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof InputSwitch>

const SwitchTemplate: Story = (args: Story['args']) => {
  const [checked, setChecked] = useState(false)
  return <InputSwitch {...args} checked={checked} onChange={() => setChecked(!checked)} />
}
export const Default: Story = {
  args: {},
  render: SwitchTemplate,
}
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: SwitchTemplate,
}
