import { CSSProperties, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Button } from '../../Buttons/Button'
import { Icon } from '../../Icon'
import * as Styled from './DateRange.styled'

export interface DateRangePickerProps {
  /** the dates or the range's name, shown in the field */
  label: string
  /** the field's accessible name, such as `Period: This week, 16–22 Nov 2026`; the label by default */
  'aria-label'?: string
  /** shown on hover, such as the dates of a named range */
  tooltip?: string
  /** the icon in the primary colour, such as for a range that includes today */
  highlighted?: boolean
  icon?: string
  /** what the arrows step through, for their names (`Previous week`): `period` by default */
  stepName?: string
  /** the arrows to the range before and after; without it there are none */
  onStep?: (step: -1 | 1) => void
  /** false disables the arrows, such as when there is nothing before or after */
  canStep?: boolean
  /** the popover's accessible name */
  popoverLabel?: string
  /** the popover's contents, given a way to close it: usually a DateRangeCalendar */
  children: (close: () => void) => ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * A range of dates as one field: a button with the dates that opens a popover to choose them, and
 * the arrows to the range before and after. The popover is rendered in the body, under the field
 * and kept in the window, so panels that clip their contents do not cut it.
 */
export const DateRangePicker = ({
  label,
  'aria-label': ariaLabel,
  tooltip,
  highlighted,
  icon = 'date_range',
  stepName = 'period',
  onStep,
  canStep = true,
  popoverLabel = 'Choose dates',
  children,
  className,
  style,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const popover = useRef<HTMLDivElement>(null)

  // placed once it is rendered and its width is known, then focused on the choice made: Tab goes
  // on from there, Escape comes back
  useLayoutEffect(() => {
    const box = popover.current
    if (!open || !root.current || !box) return
    const field = root.current.getBoundingClientRect()
    // under the field, or above it when there is no room below, else as low as fits
    const below = field.bottom + 4
    const above = field.top - 4 - box.offsetHeight
    const fitsBelow = below + box.offsetHeight <= window.innerHeight - 8
    const top = fitsBelow
      ? below
      : above >= 8
      ? above
      : Math.max(8, window.innerHeight - box.offsetHeight - 8)
    box.style.top = `${top}px`
    box.style.left = `${Math.max(
      8,
      Math.min(field.left, window.innerWidth - box.offsetWidth - 8),
    )}px`
    box.style.visibility = 'visible'
    const selected = box.querySelector<HTMLButtonElement>('button.selected')
    selected?.scrollIntoView({ block: 'nearest' })
    ;(selected ?? box.querySelector('button'))?.focus()
  }, [open])

  // closed: back on the button when the focus was in the popover (gone with it), not when a click
  // elsewhere took it
  const wasOpen = useRef(false)
  useEffect(() => {
    const focus = document.activeElement
    if (!open && wasOpen.current && (!focus || focus === document.body)) trigger.current?.focus()
    wasOpen.current = open
  }, [open])

  // a click anywhere else closes it
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!root.current?.contains(target) && !popover.current?.contains(target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  return (
    // Escape in the popover reaches here too: React portals bubble through the component tree
    <Styled.Field
      ref={root}
      className={clsx('date-range-picker', className)}
      style={style}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation()
          setOpen(false)
        }
      }}
    >
      <Styled.FieldButton
        ref={trigger}
        type="button"
        aria-label={ariaLabel ?? label}
        data-tooltip={tooltip}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={clsx({ open, highlighted })}
        onClick={() => setOpen(!open)}
      >
        <Icon icon={icon} />
        <span>{label}</span>
      </Styled.FieldButton>
      {onStep && (
        <>
          <Button
            icon="chevron_left"
            type="button"
            variant="text"
            className="arrow"
            aria-label={`Previous ${stepName}`}
            data-tooltip={`Previous ${stepName}`}
            disabled={!canStep}
            onClick={() => onStep(-1)}
          />
          <Button
            icon="chevron_right"
            type="button"
            variant="text"
            className="arrow"
            aria-label={`Next ${stepName}`}
            data-tooltip={`Next ${stepName}`}
            disabled={!canStep}
            onClick={() => onStep(1)}
          />
        </>
      )}
      {open &&
        createPortal(
          <Styled.Popover
            ref={popover}
            role="dialog"
            aria-label={popoverLabel}
            style={{ visibility: 'hidden' }}
          >
            {children(() => setOpen(false))}
          </Styled.Popover>,
          document.body,
        )}
    </Styled.Field>
  )
}
