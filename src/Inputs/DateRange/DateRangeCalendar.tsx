import { HTMLAttributes, forwardRef, useState } from 'react'
import clsx from 'clsx'
import { InputDate } from '../InputDate'
import { fromDateString, toDateString } from './dates'
import * as Styled from './DateRange.styled'

/** a range of days, `YYYY-MM-DD`, first to last */
export type DateRange = { from: string; to: string }

/** a named range beside the calendar, such as "This week" */
export type DateRangePreset = { value: string; label: string }

export interface DateRangeCalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** the range shown, `YYYY-MM-DD`; either end may be empty */
  value?: { from?: string | null; to?: string | null }
  /** called once both days are picked: the first and last day, in order */
  onChange: (range: DateRange) => void
  /** named ranges listed beside the calendar */
  presets?: DateRangePreset[]
  /** the preset in use, highlighted in the list */
  preset?: string
  onPreset?: (value: string) => void
  /** months side by side, 2 by default */
  monthsShown?: number
  /** the first day of the week: 0 Sunday … 6 Saturday, Monday by default */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** false: one click picks one day, given as a range of that day; true by default (two clicks) */
  selectsRange?: boolean
}

/**
 * Two clicks pick a range: the first and the last day (or one click one day, with `selectsRange`
 * false). Optional presets (This week, Last month…) are listed beside the calendar. Flat, for a
 * popover or a dialog: no border or background of its own.
 */
export const DateRangeCalendar = forwardRef<HTMLDivElement, DateRangeCalendarProps>(
  (
    {
      value,
      onChange,
      presets,
      preset,
      onPreset,
      monthsShown = 2,
      weekStartsOn = 1,
      selectsRange = true,
      className,
      ...props
    },
    ref,
  ) => {
    /** the first day clicked, until the last one is */
    const [start, setStart] = useState<Date | null>(null)
    // a range half picked is dropped when the mode changes
    const [mode, setMode] = useState(selectsRange)
    if (mode !== selectsRange) {
      setMode(selectsRange)
      setStart(null)
    }
    const from = start ?? fromDateString(value?.from)
    const to = start ? null : fromDateString(value?.to)

    return (
      <Styled.Calendar ref={ref} className={clsx('date-range-calendar', className)} {...props}>
        {!!presets?.length && (
          <ul aria-label="Presets">
            {presets.map(({ value, label }) => (
              <li key={value}>
                <button
                  type="button"
                  className={clsx({ selected: value === preset })}
                  aria-pressed={value === preset}
                  onClick={() => {
                    // a half-picked range gives way to the preset
                    setStart(null)
                    onPreset?.(value)
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}
        {selectsRange ? (
          <InputDate
            inline
            selectsRange
            monthsShown={monthsShown}
            calendarStartDay={weekStartsOn}
            selected={from}
            startDate={from}
            endDate={to}
            openToDate={from ?? new Date()}
            onChange={([first, last]: [Date | null, Date | null]) => {
              if (!first) return
              if (!last) return setStart(first)
              setStart(null)
              onChange({ from: toDateString(first), to: toDateString(last) })
            }}
          />
        ) : (
          <InputDate
            inline
            monthsShown={monthsShown}
            calendarStartDay={weekStartsOn}
            selected={from}
            // the day picked again still reports it
            allowSameDay
            // the day as a range of one: drawn like a range's ends
            startDate={from}
            endDate={to ?? from}
            openToDate={from ?? new Date()}
            onChange={(date: Date | null) => {
              if (!date) return
              const day = toDateString(date)
              onChange({ from: day, to: day })
            }}
          />
        )}
      </Styled.Calendar>
    )
  },
)
