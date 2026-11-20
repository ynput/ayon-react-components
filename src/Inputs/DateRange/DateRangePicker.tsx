import {
  CSSProperties,
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
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
  /**
   * Typing: the field is this text input instead of a button, and the icon opens the popover. A
   * click in the input opens it too, and ArrowDown moves into it. The focus stays in the input
   * while the popover is clicked.
   */
  input?: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }
  /** open or closed from outside; with `onOpenChange`, told when it opens or closes itself */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
  style?: CSSProperties
}

/** the element to a ref given from outside */
const setRef = <T,>(ref: Ref<T> | undefined, element: T | null) => {
  if (typeof ref === 'function') ref(element)
  else if (ref) (ref as { current: T | null }).current = element
}

/** where the focus goes in the popover: the choice made, else a calendar's day, else its first button */
const focusTarget = (box: HTMLElement) =>
  box.querySelector<HTMLElement>('button.selected') ??
  box.querySelector<HTMLElement>('.react-datepicker__day[tabindex="0"]') ??
  box.querySelector<HTMLElement>('button')

/**
 * A range of dates as one field: a button with the dates that opens a popover to choose them, and
 * the arrows to the range before and after. With `input`, the dates are typed in the field and the
 * popover helps. The popover is rendered in the body, under the field and kept in the window, so
 * panels that clip their contents do not cut it; it moves with the field when a panel scrolls.
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
  input,
  open: openProp,
  onOpenChange,
  disabled,
  className,
  style,
}: DateRangePickerProps) => {
  const [ownOpen, setOwnOpen] = useState(false)
  const open = (openProp ?? ownOpen) && !disabled
  const setOpen = (next: boolean) => {
    setOwnOpen(next)
    onOpenChange?.(next)
  }
  // the listeners added on opening call the latest onOpenChange
  const setOpenNow = useRef(setOpen)
  setOpenNow.current = setOpen
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const textInput = useRef<HTMLInputElement | null>(null)
  const popover = useRef<HTMLDivElement>(null)

  // under the field, or above it when there is no room below, else as low as fits
  const place = () => {
    const box = popover.current
    if (!root.current || !box) return
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
  }

  // placed once it is rendered and its width is known, then focused on the choice made: Tab goes
  // on from there, Escape comes back. Typing keeps the focus in the input.
  useLayoutEffect(() => {
    const box = popover.current
    if (!open || !box) return
    place()
    if (input) return
    const target = focusTarget(box)
    target?.scrollIntoView({ block: 'nearest' })
    target?.focus()
  }, [open])

  // it follows the field when a panel scrolls or the window resizes
  useEffect(() => {
    if (!open) return
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  // closed: back on the field when the focus was in the popover (gone with it), not when a click
  // elsewhere took it or the field was left
  const wasOpen = useRef(false)
  const closedWithFocus = useRef(false)
  // read while the popover is still there
  if (!open && wasOpen.current)
    closedWithFocus.current = !!popover.current?.contains(document.activeElement)
  useEffect(() => {
    const focus = document.activeElement
    if (!open && wasOpen.current && closedWithFocus.current && (!focus || focus === document.body))
      (textInput.current ?? trigger.current)?.focus()
    wasOpen.current = open
  }, [open])

  // a click anywhere else closes it
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!root.current?.contains(target) && !popover.current?.contains(target))
        setOpenNow.current(false)
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
      {input ? (
        <Styled.FieldTyping className={clsx({ open, highlighted })}>
          <Styled.FieldIcon
            ref={trigger}
            type="button"
            // the input is the field for the keyboard; the icon is a shortcut for the mouse
            tabIndex={-1}
            aria-label={popoverLabel}
            aria-haspopup="dialog"
            aria-expanded={open}
            disabled={disabled}
            // the focus stays in the input
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setOpen(!open)
              textInput.current?.focus()
            }}
          >
            <Icon icon={icon} />
          </Styled.FieldIcon>
          <input
            // a <label for> names it too; the label prop is its value here
            aria-label={ariaLabel}
            data-tooltip={tooltip}
            disabled={disabled}
            {...input}
            ref={(element) => {
              textInput.current = element
              setRef(input.ref, element)
            }}
            onClick={(event) => {
              if (!open) setOpen(true)
              input.onClick?.(event)
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' && !event.altKey) {
                event.preventDefault()
                if (!open) setOpen(true)
                else if (popover.current) focusTarget(popover.current)?.focus()
              }
              input.onKeyDown?.(event)
            }}
            onBlur={(event) => {
              // into the popover: still choosing
              if (popover.current?.contains(event.relatedTarget as Node)) return
              input.onBlur?.(event)
            }}
          />
        </Styled.FieldTyping>
      ) : (
        <Styled.FieldButton
          ref={trigger}
          type="button"
          aria-label={ariaLabel ?? label}
          data-tooltip={tooltip}
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={disabled}
          className={clsx({ open, highlighted })}
          onClick={() => setOpen(!open)}
        >
          <Icon icon={icon} />
          <span>{label}</span>
        </Styled.FieldButton>
      )}
      {onStep && (
        <>
          <Button
            icon="chevron_left"
            type="button"
            variant="text"
            className="arrow"
            aria-label={`Previous ${stepName}`}
            data-tooltip={`Previous ${stepName}`}
            disabled={disabled || !canStep}
            onClick={() => onStep(-1)}
          />
          <Button
            icon="chevron_right"
            type="button"
            variant="text"
            className="arrow"
            aria-label={`Next ${stepName}`}
            data-tooltip={`Next ${stepName}`}
            disabled={disabled || !canStep}
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
            // typing: a click in the popover leaves the focus in the input
            onMouseDown={input ? (event) => event.preventDefault() : undefined}
            // typing: the keyboard went from the input into the popover and now leaves both
            onBlur={
              input
                ? (event) => {
                    const next = event.relatedTarget as Node | null
                    if (!next || popover.current?.contains(next) || root.current?.contains(next))
                      return
                    setOpen(false)
                    input.onBlur?.(event as unknown as FocusEvent<HTMLInputElement>)
                  }
                : undefined
            }
          >
            {children(() => setOpen(false))}
          </Styled.Popover>,
          document.body,
        )}
    </Styled.Field>
  )
}
