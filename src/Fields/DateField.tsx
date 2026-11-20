import { forwardRef, useRef, useState } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { DateRangeCalendar } from '../Inputs/DateRange/DateRangeCalendar'
import { DateRangePicker } from '../Inputs/DateRange/DateRangePicker'
import { formatDay, parseTypedDate } from '../Inputs/DateRange/dates'
import { fieldSubmittingStyles, roundedFieldSurfaceStyles } from './fieldStyles'
import { EMPTY_VALUE, ReadOnlyValue } from './common.styled'

/** the date picker's field as a form field: as wide and tall as the other fields */
const StyledPicker = styled(DateRangePicker)`
  && {
    width: 100%;
    min-width: 112px;
    height: auto;
    min-height: calc(var(--field-control-height, 24px) + 2 * var(--field-input-padding-y, 6px));
    border-color: var(--field-border-color, var(--md-sys-color-outline-variant));
    ${roundedFieldSurfaceStyles}
  }
  &&.no-border,
  &&.ghost {
    border-color: transparent;
  }
  &&.no-background,
  &&.ghost {
    background-color: transparent;
  }
  &&.error {
    border-color: var(--md-sys-color-error);
  }
  ${fieldSubmittingStyles}
`

export interface DateFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** Date as `YYYY-MM-DD`, or an empty string */
  value: string
  /** Called with the day typed (on Enter or blur) or picked in the calendar */
  onChange: (value: string) => void
  /** Called on Enter, blur or a day picked when the value changed — use for auto-save */
  onCommit?: (value: string) => void
  isSubmitting?: boolean
  isReadOnly?: boolean
  /**
   * true (default): the date is typed in the field (`17 Nov 2026`, `17/11/2026`, `2026-11-17`,
   * `17/11` for this year) and a calendar opens under it. false: the field is a button that opens
   * the calendar.
   */
  typing?: boolean
  /** The calendar is open when the field appears, e.g. in a table cell's editor */
  defaultOpen?: boolean
}

/**
 * A day: typed, or picked in a calendar under the field. Enter or leaving the field saves a typed
 * date; a date it can't read turns red and is not saved (with `required`, nor is an empty one).
 * Escape closes the calendar, then drops what was typed. onChange and onCommit are called together,
 * with a day other than the value.
 */
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  (
    {
      value,
      onChange,
      onCommit,
      isSubmitting,
      isReadOnly,
      typing = true,
      defaultOpen = false,
      className,
      style,
      title,
      placeholder,
      disabled,
      required,
      readOnly,
      min,
      max,
      name,
      form,
      'aria-label': ariaLabel,
      onBlur,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    // typed and not saved yet; without it the field shows the value
    const [draft, setDraftState] = useState<string | null>(null)
    // the draft now, for a blur right after a change, before the next render
    const draftNow = useRef(draft)
    const setDraft = (next: string | null) => {
      draftNow.current = next
      setDraftState(next)
    }
    const text = draft ?? formatDay(value)
    const [invalid, setInvalid] = useState(false)
    const [openState, setOpen] = useState(defaultOpen)
    const open = openState && !readOnly
    // the days that can be chosen, `YYYY-MM-DD`
    const minDay = min === undefined ? undefined : String(min)
    const maxDay = max === undefined ? undefined : String(max)

    /** the draft dropped, and a day other than the value saved */
    const save = (day: string) => {
      // first: onCommit may move the focus on, and that blur has nothing left to save
      setDraft(null)
      setInvalid(false)
      if (day === value) return
      onChange(day)
      onCommit?.(day)
    }

    /** the typed day, '' for an emptied field; null when it is not a day that can be chosen */
    const readDraft = (typed: string) => {
      if (!typed) return required ? null : ''
      const day = parseTypedDate(typed)
      if (!day || (minDay && day < minDay) || (maxDay && day > maxDay)) return null
      return day
    }

    const pick = (day: string) => {
      save(day)
      setOpen(false)
    }

    if (isReadOnly) {
      return (
        <ReadOnlyValue className={clsx(className, 'read-only')} data-tooltip={title}>
          {value || EMPTY_VALUE}
        </ReadOnlyValue>
      )
    }

    // the calendar shows the day typed so far, else the value
    const shown = (draft !== null && parseTypedDate(draft)) || value
    const calendar = (
      <DateRangeCalendar
        // a new day: the calendar opens on its month, its keyboard on it
        key={shown}
        monthsShown={1}
        selectsRange={false}
        value={{ from: shown, to: shown }}
        min={minDay}
        max={maxDay}
        onChange={({ from }) => pick(from)}
      />
    )

    const pickerProps = {
      label: formatDay(value) || placeholder || '',
      'aria-label': ariaLabel,
      tooltip: title,
      icon: 'calendar_month',
      popoverLabel: 'Choose a date',
      open,
      onOpenChange: setOpen,
      disabled,
      className: clsx('date-field', className, {
        error: typing && invalid,
        submitting: isSubmitting,
      }),
      style,
    }

    // a form gets the day, `YYYY-MM-DD`, not the text shown
    const formValue = name && (
      <input type="hidden" name={name} form={form} value={value} disabled={disabled} />
    )

    if (!typing)
      return (
        <>
          <StyledPicker {...pickerProps}>{() => calendar}</StyledPicker>
          {formValue}
        </>
      )

    return (
      <>
        <StyledPicker
          {...pickerProps}
          input={{
            ...props,
            ref,
            // the text shown; a form gets the day from the hidden input
            type: 'text',
            form,
            value: text,
            placeholder,
            required,
            readOnly,
            'aria-invalid': invalid || undefined,
            onChange: (event) => {
              setDraft(event.target.value)
              setInvalid(false)
            },
            onBlur: (event) => {
              setOpen(false)
              const typed = draftNow.current
              if (typed !== null) {
                const day = readDraft(typed.trim())
                // not a date: back to the value
                if (day === null) {
                  setDraft(null)
                  setInvalid(false)
                } else save(day)
              }
              onBlur?.(event)
            },
            onKeyDown: (event) => {
              if (!event.nativeEvent.isComposing && event.key === 'Enter') {
                event.preventDefault()
                event.stopPropagation()
                const typed = draftNow.current
                const day = readDraft(typed === null ? text : typed.trim())
                if (day === null) setInvalid(true)
                else {
                  save(day)
                  setOpen(false)
                  event.currentTarget.blur()
                }
              } else if (event.key === 'Escape') {
                event.preventDefault()
                event.stopPropagation()
                // the first Escape only closes the calendar
                if (open) setOpen(false)
                else {
                  setDraft(null)
                  setInvalid(false)
                  event.currentTarget.blur()
                }
              }
              onKeyDown?.(event)
            },
          }}
        >
          {() => calendar}
        </StyledPicker>
        {formValue}
      </>
    )
  },
)
DateField.displayName = 'DateField'
