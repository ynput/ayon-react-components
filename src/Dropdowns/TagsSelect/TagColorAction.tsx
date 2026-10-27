import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Icon } from '../../Icon'
import * as Styled from './TagsSelect.styled'

// colours offered for a tag
export const TAG_COLORS = [
  '#ff2450',
  '#ff8f3f',
  '#ffc83d',
  '#7bd35f',
  '#5be1c6',
  '#3ec7ff',
  '#5b8cff',
  '#a97bff',
  '#ff7bd5',
]

const isSameColor = (a?: string, b?: string) => !!a && !!b && a.toLowerCase() === b.toLowerCase()

// the browser's colour picker; its input event fires while dragging, change once a colour is chosen
const CustomColor = ({ color, onPick }: { color?: string; onPick: (color: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const onPickRef = useRef(onPick)
  onPickRef.current = onPick

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    const handleChange = () => onPickRef.current(input.value)
    input.addEventListener('change', handleChange)
    return () => input.removeEventListener('change', handleChange)
  }, [])

  return (
    <Styled.CustomSwatch data-tooltip="Other colour" onClick={(e) => e.stopPropagation()}>
      <Icon icon="colorize" />
      <input ref={inputRef} type="color" defaultValue={color || '#cacaca'} />
    </Styled.CustomSwatch>
  )
}

export interface TagColorActionProps {
  isPicking: boolean
  color?: string
  colors?: string[]
  label: string
  // the "add new" option: a click on a colour also reaches the option, which adds the tag
  isAddNew?: boolean
  onOpen: () => void
  onPick: (color: string) => void
}

// a button on a tag, which opens a row of colours to save the tag with
export const TagColorAction = ({
  isPicking,
  color,
  colors = TAG_COLORS,
  label,
  isAddNew,
  onOpen,
  onPick,
}: TagColorActionProps) => {
  if (!isPicking) {
    return (
      <Styled.ColorAction
        type="button"
        className="color-action"
        icon="palette"
        variant="text"
        data-tooltip={label}
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation()
          onOpen()
        }}
      />
    )
  }

  // the tag's current colour is shown first when it isn't one of the offered ones
  const swatches = color && !colors.some((c) => isSameColor(c, color)) ? [color, ...colors] : colors

  return (
    <Styled.Swatches className="color-swatches">
      {swatches.map((swatch) => (
        <Styled.Swatch
          key={swatch}
          type="button"
          className={clsx({ selected: isSameColor(swatch, color) })}
          style={{ backgroundColor: swatch }}
          aria-label={swatch}
          onClick={(e) => {
            if (!isAddNew) e.stopPropagation()
            onPick(swatch)
          }}
        />
      ))}
      {/* the picker's colour comes after the click, too late to add a new tag with it */}
      {!isAddNew && <CustomColor color={color} onPick={onPick} />}
    </Styled.Swatches>
  )
}
