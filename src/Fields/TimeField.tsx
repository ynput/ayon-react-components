import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import clsx from 'clsx'
import { InputText } from '../Inputs/InputText'
import {
  textInputStyles,
  paddedInputStyles,
  fieldSubmittingStyles,
  roundedFieldSurfaceStyles,
} from './fieldStyles'
import {
  blurFieldTarget,
  chainHandlers,
  checkKeydownSubmit,
  useCommittedFieldValue,
} from './fieldUtils'
import { EMPTY_VALUE, ReadOnlyValue } from './common.styled'

const TimeInputContainer = styled.div`
  position: relative;
  width: 77px;
  flex: 0 0 77px;
`

const StyledInput = styled(InputText)`
  ${textInputStyles}
  ${paddedInputStyles}
  ${fieldSubmittingStyles}
`

const TimePopover = styled.div<{
  $left: number
  $top: number
  $width: number
}>`
  position: fixed;
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  /* the overlay layer of dialogs and AYON's menus and popovers: above the one it opens from */
  z-index: 1000;
  display: flex;
  flex-direction: column;
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid var(--field-border-color, var(--md-sys-color-outline-variant));
  ${roundedFieldSurfaceStyles}
  background: var(--md-sys-color-surface-container-high);
  box-shadow: var(--box-shadow);
`

const TimeOption = styled.button`
  border: 0;
  background: transparent;
  color: var(--md-sys-color-on-surface);
  text-align: left;
  padding: 8px;
  cursor: pointer;

  &.selected {
    background: var(--md-sys-color-primary-container);
  }

  &:hover {
    background: var(--md-sys-color-surface-container-high-hover);
  }

  &.selected:hover {
    background: var(--md-sys-color-primary-container-hover);
  }
`

const pad = (value: number) => value.toString().padStart(2, '0')

const formatTime = (hours: number, minutes: number) => `${pad(hours)}:${pad(minutes)}`

// Accepts "9", "930", "09:30", "9:30pm", "12am", …
export const parseTimeValue = (value: string) => {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '')

  if (!normalized) return null

  const match = normalized.match(/^(\d{1,4})(?::?(\d{2}))?(am|pm)?$/)

  if (!match) return null

  const firstPart = match[1] || ''
  const secondPart = match[2]
  const meridiem = match[3]

  let hours = 0
  let minutes = 0

  if (secondPart !== undefined) {
    hours = Number(firstPart)
    minutes = Number(secondPart)
  } else if (firstPart.length <= 2) {
    hours = Number(firstPart)
    minutes = 0
  } else {
    hours = Number(firstPart.slice(0, -2))
    minutes = Number(firstPart.slice(-2))
  }

  if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes > 59) return null

  if (meridiem) {
    if (hours < 1 || hours > 12) return null
    if (meridiem === 'pm' && hours !== 12) hours += 12
    if (meridiem === 'am' && hours === 12) hours = 0
  } else if (hours > 23) {
    return null
  }

  return { hours, minutes }
}

const normalizeTimeSearchValue = (value: string) => {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '')

  if (!normalized) return ''

  if (normalized.includes(':')) {
    const [hours = '', minutes = ''] = normalized.split(':')
    return `${String(Number(hours || '0'))}:${minutes}`
  }

  if (normalized.length >= 3 && /^\d+$/.test(normalized)) {
    const hours = normalized.slice(0, -2)
    const minutes = normalized.slice(-2)
    return `${String(Number(hours || '0'))}:${minutes}`
  }

  return normalized
}

// Whether the draft can be applied while typing. Compact digits ("930", "1230") wait for Enter or blur,
// because "123" may still become "1230".
const isCompleteTimeValue = (value: string) => {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '')
  return /^(\d{1,2}:\d{2}|\d{1,2}(am|pm))$/.test(normalized)
}

const getBestMatchingOption = (value: string, options: string[]) => {
  const normalized = normalizeTimeSearchValue(value)

  if (!normalized) return null

  return (
    options.find((option) => {
      const normalizedOption = normalizeTimeSearchValue(option)
      return option.startsWith(value.trim()) || normalizedOption.startsWith(normalized)
    }) ?? null
  )
}

const generateTimeOptions = (intervalMinutes: number) =>
  Array.from({ length: Math.floor((24 * 60) / intervalMinutes) }, (_, index) => {
    const totalMinutes = index * intervalMinutes
    return formatTime(Math.floor(totalMinutes / 60), totalMinutes % 60)
  })

const toMinutes = (time: string) => {
  const parsed = parseTimeValue(time)
  return parsed ? parsed.hours * 60 + parsed.minutes : null
}

export interface TimeFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** Time as `HH:mm`, or an empty string */
  value: string
  onChange: (value: string) => void
  /** Called on Enter, blur or option pick when the value changed — use for auto-save */
  onCommit?: (value: string) => void
  isSubmitting?: boolean
  isReadOnly?: boolean
  /** Interval between selectable time options in minutes. Defaults to 15. */
  intervalMinutes?: number
}

export const TimeField = forwardRef<HTMLInputElement, TimeFieldProps>(
  (
    {
      value,
      onChange,
      onCommit,
      isSubmitting,
      isReadOnly,
      disabled = false,
      placeholder = 'hh:mm',
      className,
      title,
      intervalMinutes = 15,
      onFocus,
      onBlur,
      onKeyDown,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [draftValue, setDraftValue] = useState(value)
    const [isOpen, setIsOpen] = useState(false)
    const [popoverPosition, setPopoverPosition] = useState<{
      left: number
      top: number
      width: number
    } | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const popoverRef = useRef<HTMLDivElement | null>(null)
    const bestMatchOptionRef = useRef<HTMLButtonElement | null>(null)
    const field = useCommittedFieldValue(value)

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    // Regenerate options when the interval changes
    const timeOptions = useMemo(() => generateTimeOptions(intervalMinutes), [intervalMinutes])

    useEffect(() => {
      setDraftValue(value)
    }, [value])

    useEffect(() => {
      if (!isOpen) return
      bestMatchOptionRef.current?.scrollIntoView({ block: 'nearest' })
    }, [draftValue, isOpen, popoverPosition])

    const handleClosePopover = () => setIsOpen(false)

    useLayoutEffect(() => {
      if (!isOpen || !inputRef.current) {
        setPopoverPosition(null)
        return
      }

      let animationFrame = 0

      const calculatePosition = () => {
        const input = inputRef.current
        if (!input) return

        const inputRect = input.getBoundingClientRect()
        const width = inputRect.width
        const viewportPadding = 8
        const gap = 4
        const estimatedHeight = 240
        const left = Math.min(
          Math.max(viewportPadding, inputRect.left),
          Math.max(viewportPadding, window.innerWidth - width - viewportPadding),
        )
        const belowTop = inputRect.bottom + gap
        const top =
          belowTop + estimatedHeight <= window.innerHeight - viewportPadding
            ? belowTop
            : Math.max(viewportPadding, inputRect.top - estimatedHeight - gap)

        setPopoverPosition({ left, top, width })
      }

      const recalculatePosition = () => {
        if (animationFrame) cancelAnimationFrame(animationFrame)
        animationFrame = requestAnimationFrame(calculatePosition)
      }

      recalculatePosition()
      window.addEventListener('resize', recalculatePosition)
      window.addEventListener('scroll', recalculatePosition, true)

      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame)
        window.removeEventListener('resize', recalculatePosition)
        window.removeEventListener('scroll', recalculatePosition, true)
      }
    }, [isOpen])

    useEffect(() => {
      if (!isOpen) return

      const handlePointerDown = (event: MouseEvent) => {
        const target = event.target as Node
        if (!containerRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
          handleClosePopover()
        }
      }

      document.addEventListener('mousedown', handlePointerDown)
      return () => document.removeEventListener('mousedown', handlePointerDown)
    }, [isOpen])

    const bestMatchingOption = useMemo(
      () => getBestMatchingOption(draftValue, timeOptions) ?? value,
      [draftValue, value, timeOptions],
    )

    // Parses and normalizes the draft. Returns the formatted time, or false when invalid.
    const applyDraft = (nextValue: string) => {
      if (!nextValue.trim()) {
        setDraftValue('')
        if (value !== '') onChange('')
        return ''
      }

      const parsed = parseTimeValue(nextValue)

      if (!parsed) {
        setDraftValue(value)
        return false
      }

      const formatted = formatTime(parsed.hours, parsed.minutes)
      setDraftValue(formatted)
      if (formatted !== value) onChange(formatted)
      return formatted
    }

    const commitDraft = () => {
      const formatted = applyDraft(draftValue)
      if (formatted !== false) field.commit(formatted, onCommit)
    }

    const pickOption = (option: string) => {
      setDraftValue(option)
      if (option !== value) onChange(option)
      field.commit(option, onCommit)
    }

    const handleCancel = () => {
      field.suppressBlurCommit()
      handleClosePopover()
      const restored = field.cancelToLastCommit()
      setDraftValue(restored)
      if (restored !== value) onChange(restored)
    }

    const handleInputChange = (nextValue: string) => {
      setDraftValue(nextValue)
      if (isCompleteTimeValue(nextValue)) applyDraft(nextValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        const currentMinutes = toMinutes(draftValue || value) ?? -1

        // Next interval strictly after (or before) the current time
        const nextOption =
          e.key === 'ArrowDown'
            ? timeOptions.find((opt) => (toMinutes(opt) ?? -1) > currentMinutes) ??
              timeOptions[timeOptions.length - 1]
            : [...timeOptions].reverse().find((opt) => (toMinutes(opt) ?? -1) < currentMinutes) ??
              timeOptions[0]

        if (nextOption) pickOption(nextOption)
        return
      }

      if (e.key === 'Enter' || e.key === 'Escape') {
        if (e.key === 'Escape') handleClosePopover()
        checkKeydownSubmit(
          e,
          () => {
            field.suppressBlurCommit()
            commitDraft()
            handleClosePopover()
          },
          handleCancel,
        )
      }
    }

    if (isReadOnly) {
      return (
        <ReadOnlyValue className={clsx(className, 'read-only')} data-tooltip={title}>
          {value || EMPTY_VALUE}
        </ReadOnlyValue>
      )
    }

    return (
      <TimeInputContainer ref={containerRef}>
        <StyledInput
          {...props}
          ref={inputRef}
          type="text"
          value={draftValue}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={chainHandlers(() => {
            field.onFocus()
            setIsOpen(true)
          }, onFocus)}
          onClick={chainHandlers(() => setIsOpen(true), onClick)}
          onBlur={chainHandlers(() => {
            if (field.blurCommitSuppressed()) return
            commitDraft()
            handleClosePopover()
          }, onBlur)}
          onKeyDown={chainHandlers(handleKeyDown, onKeyDown)}
          placeholder={placeholder}
          disabled={disabled}
          data-tooltip={title}
          className={clsx(className, { submitting: isSubmitting })}
        />
        {isOpen &&
          !disabled &&
          popoverPosition &&
          createPortal(
            <TimePopover
              ref={popoverRef}
              $left={popoverPosition.left}
              $top={popoverPosition.top}
              $width={popoverPosition.width}
            >
              {timeOptions.map((option) => (
                <TimeOption
                  key={option}
                  type="button"
                  ref={option === bestMatchingOption ? bestMatchOptionRef : null}
                  className={clsx({ selected: option === draftValue })}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    field.suppressBlurCommit()
                    pickOption(option)
                    handleClosePopover()
                    if (inputRef.current) blurFieldTarget(inputRef.current)
                  }}
                >
                  {option}
                </TimeOption>
              ))}
            </TimePopover>,
            document.body,
          )}
      </TimeInputContainer>
    )
  },
)
TimeField.displayName = 'TimeField'
