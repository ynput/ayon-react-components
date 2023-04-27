import type { Meta, StoryObj } from '@storybook/react'
import { InputDate } from '.'
import { useState } from 'react'

const meta: Meta<typeof InputDate> = {
  component: InputDate,
}

export default meta

type Story = StoryObj<typeof InputDate>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(new Date())

    return <InputDate {...args} selected={value} onChange={(d) => d && setValue(new Date(d))} />
  },
}
