import type { Meta, StoryObj } from '@storybook/react'
import { InputDate } from '.'
import { useState } from 'react'

const meta: Meta<typeof InputDate> = {
  component: InputDate,
}

export default meta

type Story = StoryObj<typeof InputDate>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(new Date())

    return <InputDate selected={value} onChange={(d: Date | null) => setValue(d)} />
  },
}

export const Range: Story = {
  render: () => {
    const [[startDate, endDate], setRange] = useState<[Date | null, Date | null]>([
      new Date(),
      null,
    ])

    return (
      <InputDate
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(range: [Date | null, Date | null]) => setRange(range)}
      />
    )
  },
}
