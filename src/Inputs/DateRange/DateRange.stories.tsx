import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DateRangeCalendar, DateRange } from './DateRangeCalendar'
import { DateRangePicker } from './DateRangePicker'
import { fromDateString, toDateString } from './dates'

const meta: Meta<typeof DateRangeCalendar> = {
  title: 'Inputs/DateRange',
  component: DateRangeCalendar,
}

export default meta

type Story = StoryObj<typeof DateRangeCalendar>

const day = (offset: number) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return toDateString(date)
}

// named ranges, as days from today
const PRESETS = [
  { value: 'today', label: 'Today', range: { from: day(0), to: day(0) } },
  { value: 'last7', label: 'Last 7 days', range: { from: day(-6), to: day(0) } },
  { value: 'last30', label: 'Last 30 days', range: { from: day(-29), to: day(0) } },
]

const format = ({ from, to }: DateRange) =>
  [from, to]
    .map((value) =>
      fromDateString(value)?.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
    )
    .join(' – ')

/** the calendar alone, for a dialog or popover of your own */
export const Calendar: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ from: day(-3), to: day(2) })
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            width: 'fit-content',
            borderRadius: 8,
            background: 'var(--md-sys-color-surface-container-high)',
          }}
        >
          <DateRangeCalendar value={range} onChange={setRange} />
        </div>
        <span>{format(range)}</span>
      </div>
    )
  },
}

/** one click picks one day: for a single date */
export const SingleDay: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ from: day(0), to: day(0) })
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            width: 'fit-content',
            borderRadius: 8,
            background: 'var(--md-sys-color-surface-container-high)',
          }}
        >
          <DateRangeCalendar
            value={range}
            onChange={setRange}
            selectsRange={false}
            monthsShown={1}
          />
        </div>
        <span>{format(range)}</span>
      </div>
    )
  },
}

/** the field with the arrows, opening the presets and calendar */
export const Picker: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>(PRESETS[1].range)
    const [preset, setPreset] = useState<string | undefined>('last7')
    const named = PRESETS.find(({ value }) => value === preset)
    const days =
      (fromDateString(range.to)!.getTime() - fromDateString(range.from)!.getTime()) / 864e5 + 1
    const step = (direction: -1 | 1) => {
      const shift = (value: string) => {
        const date = fromDateString(value)!
        date.setDate(date.getDate() + direction * days)
        return toDateString(date)
      }
      setRange({ from: shift(range.from), to: shift(range.to) })
      setPreset(undefined)
    }

    return (
      <DateRangePicker
        label={named?.label ?? format(range)}
        aria-label={`Period: ${[named?.label, format(range)].filter(Boolean).join(', ')}`}
        tooltip={named ? format(range) : undefined}
        highlighted={range.from <= day(0) && day(0) <= range.to}
        onStep={step}
        popoverLabel="Choose a period"
      >
        {(close) => (
          <DateRangeCalendar
            value={range}
            presets={PRESETS}
            preset={preset}
            onPreset={(value) => {
              setPreset(value)
              setRange(PRESETS.find((p) => p.value === value)!.range)
              close()
            }}
            onChange={(picked) => {
              setPreset(undefined)
              setRange(picked)
              close()
            }}
          />
        )}
      </DateRangePicker>
    )
  },
}
