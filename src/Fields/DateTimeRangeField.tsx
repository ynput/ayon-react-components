import { useRef } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { DateField } from './DateField'
import { TimeField } from './TimeField'
import { FieldErrorBanner, FieldMixedIndicator } from './FieldRow'
import { ReadOnlyValue } from './common.styled'

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  width: 100%;
  flex-wrap: wrap;
`

const Columns = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1 1 0;
  flex-wrap: wrap;
`

const Column = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex-wrap: wrap;
`

const Errors = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

const Toggle = styled.button`
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 999px;
  background: transparent;
  color: var(--md-sys-color-primary);
  padding: 2px 8px;
  font-size: 11px;
  cursor: pointer;
  flex-shrink: 0;
  margin-left: auto;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`

// "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm" → parts
const splitValue = (value: string) => {
  const [date = '', time = ''] = (value || '').split('T')
  return { date, time: time.slice(0, 5) }
}

const joinValue = (date: string, time: string | undefined) =>
  time && date ? `${date}T${time}` : date

export interface DateTimeRangeFieldValue {
  startValue: string
  endValue: string
  /** True when the values carry a time ("YYYY-MM-DDTHH:mm"), false for whole days */
  withTime: boolean
}

export interface DateTimeRangeFieldProps {
  /**
   * Local start: "YYYY-MM-DD" for a whole day, "YYYY-MM-DDTHH:mm" with a time.
   * The format is the mode: values with a time show the time inputs.
   */
  startValue: string
  /** Local, inclusive end in the same format as startValue */
  endValue: string
  onChange: (next: DateTimeRangeFieldValue) => void
  /** Called with the committed range when an input commits (Enter, blur, option pick) or the mode toggles */
  onCommit?: (next: DateTimeRangeFieldValue) => void
  /** Show the "Add time" / "All day" toggle. When false the range is whole days. Defaults to true. */
  allowTimeToggle?: boolean
  /** Times used when switching a whole-day range to times. Default 00:00 and 23:59. */
  defaultStartTime?: string
  defaultEndTime?: string
  startError?: string
  endError?: string
  startMixed?: boolean
  endMixed?: boolean
  disabled?: boolean
  isReadOnly?: boolean
  isSubmitting?: boolean
  ghost?: boolean
  /** Text of the timezone chip. The chip is shown only when this is set. */
  timezoneLabel?: string
  timezoneTooltip?: string
  onTimezoneClick?: () => void
  className?: string
}

export const DateTimeRangeField = ({
  startValue,
  endValue,
  onChange,
  onCommit,
  allowTimeToggle = true,
  defaultStartTime = '00:00',
  defaultEndTime = '23:59',
  startError,
  endError,
  startMixed = false,
  endMixed = false,
  disabled = false,
  isReadOnly = false,
  isSubmitting = false,
  ghost = false,
  timezoneLabel,
  timezoneTooltip,
  onTimezoneClick,
  className,
}: DateTimeRangeFieldProps) => {
  const start = splitValue(startValue)
  const end = splitValue(endValue)
  const showTime = allowTimeToggle && !!(start.time || end.time)

  // The latest range, so a commit right after a change (option pick) gets it before the parent re-renders
  const latestRange = useRef<DateTimeRangeFieldValue>({ startValue, endValue, withTime: showTime })
  latestRange.current = { startValue, endValue, withTime: showTime }

  const changeRange = (next: DateTimeRangeFieldValue) => {
    latestRange.current = next
    onChange(next)
  }

  const updateRange = ({
    startDate = start.date,
    endDate = end.date,
    startTime = start.time || defaultStartTime,
    endTime = end.time || defaultEndTime,
    withTime = showTime,
  }: {
    startDate?: string
    endDate?: string
    startTime?: string
    endTime?: string
    withTime?: boolean
  }) => {
    changeRange({
      startValue: joinValue(startDate, withTime ? startTime : undefined),
      endValue: joinValue(endDate, withTime ? endTime : undefined),
      withTime,
    })
  }

  // The end is kept after the start on commit, not while editing, so Escape on one input restores the whole range
  const commitRange = () => {
    let next = latestRange.current
    // Both values share one format, so string order is time order
    if (next.startValue && next.endValue && next.endValue < next.startValue) {
      next = { ...next, endValue: next.startValue }
      changeRange(next)
    }
    onCommit?.(next)
  }

  if (isReadOnly) {
    const format = (value: string) => value.replace('T', ' ')
    return (
      <ReadOnlyValue className={clsx(className, 'read-only')}>
        {format(startValue)} - {format(endValue)}
      </ReadOnlyValue>
    )
  }

  const inputClassName = clsx({ ghost })

  return (
    <Container className={className}>
      <Columns>
        <Column>
          <DateField
            value={start.date}
            onChange={(date) => updateRange({ startDate: date })}
            onCommit={commitRange}
            placeholder="Start"
            disabled={disabled}
            isSubmitting={isSubmitting}
            className={inputClassName}
            style={{ width: 'auto' }}
          />
          {showTime && (
            <TimeField
              value={start.time}
              onChange={(time) => updateRange({ startTime: time, withTime: true })}
              onCommit={commitRange}
              isSubmitting={isSubmitting}
              disabled={disabled}
              className={inputClassName}
            />
          )}
          <FieldMixedIndicator show={startMixed} />
        </Column>

        <Column>
          <DateField
            value={end.date}
            onChange={(date) => updateRange({ endDate: date })}
            onCommit={commitRange}
            placeholder="End"
            isSubmitting={isSubmitting}
            disabled={disabled}
            className={inputClassName}
            style={{ width: 'auto' }}
          />
          {showTime && (
            <TimeField
              value={end.time}
              onChange={(time) => updateRange({ endTime: time, withTime: true })}
              onCommit={commitRange}
              isSubmitting={isSubmitting}
              disabled={disabled}
              className={inputClassName}
            />
          )}
          <FieldMixedIndicator show={endMixed} />
        </Column>
      </Columns>

      {allowTimeToggle && (
        <Toggle
          type="button"
          onClick={() => {
            updateRange(
              showTime
                ? { withTime: false }
                : { withTime: true, startTime: defaultStartTime, endTime: defaultEndTime },
            )
            commitRange()
          }}
          disabled={disabled}
        >
          {showTime ? 'All day' : 'Add time'}
        </Toggle>
      )}

      {timezoneLabel && (
        <Toggle
          type="button"
          onClick={onTimezoneClick}
          disabled={disabled}
          data-tooltip={timezoneTooltip}
          data-tooltip-delay={0}
        >
          {timezoneLabel}
        </Toggle>
      )}

      {(startError || endError) && (
        <Errors>
          {startError && <FieldErrorBanner>{startError}</FieldErrorBanner>}
          {endError && <FieldErrorBanner>{endError}</FieldErrorBanner>}
        </Errors>
      )}
    </Container>
  )
}
