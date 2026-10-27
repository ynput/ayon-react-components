import { forwardRef } from 'react'
import clsx from 'clsx'
import { Icon } from '../../Icon'
import { getTextColor } from '../../helpers'
import * as Styled from './ColorPicker.styled'

// colours suggested by default
export const COLOR_SUGGESTIONS = [
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

export interface ColorPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'color'> {
  value?: string
  onChange: (color: string) => void
  // the colours suggested
  colors?: string[]
  // any other colour, from the browser's colour picker
  custom?: boolean
  disabled?: boolean
}

// suggested colours to pick from, and any other one
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    { value, onChange, colors = COLOR_SUGGESTIONS, custom = true, disabled, className, ...props },
    ref,
  ) => {
    // a colour that isn't suggested fills the custom button, so the current one is always marked
    const isCustomValue = !!value && !colors.some((color) => isSameColor(color, value))

    return (
      <Styled.ColorPicker
        ref={ref}
        role="radiogroup"
        className={clsx('color-picker', className)}
        {...props}
      >
        {colors.map((color) => {
          const selected = isSameColor(color, value)
          return (
            <Styled.Swatch
              key={color}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={color}
              data-tooltip={color}
              disabled={disabled}
              className={clsx('swatch', { selected })}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            />
          )
        })}
        {custom && (
          <Styled.CustomSwatch
            className={clsx('swatch custom', { disabled, selected: isCustomValue })}
            data-tooltip={isCustomValue ? value : 'Other colour'}
            style={
              isCustomValue ? { backgroundColor: value, color: getTextColor(value) } : undefined
            }
          >
            <Icon icon="colorize" />
            {/* React's onChange follows the colour while it is dragged in the browser's picker */}
            <input
              type="color"
              aria-label="Other colour"
              disabled={disabled}
              value={value || '#cacaca'}
              onChange={(e) => onChange(e.target.value)}
            />
          </Styled.CustomSwatch>
        )}
      </Styled.ColorPicker>
    )
  },
)
