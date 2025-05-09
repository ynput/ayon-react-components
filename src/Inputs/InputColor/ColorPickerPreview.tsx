import clsx from 'clsx'
import { ChangeEvent, FC, FocusEvent, forwardRef } from 'react'
import styled, { css } from 'styled-components'

// types
export interface ColorPickerPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  backgroundColor?: string
  value?: string
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
}

const Wrapper = styled.div`
  position: relative;
  display: grid;
  margin-right: 5px;
  min-height: var(--base-input-size);
  max-height: var(--base-input-size);
  max-width: var(--base-input-size);
  min-width: var(--base-input-size);

  & > * {
    grid-row: 1;
    grid-column: 1;

    border-radius: var(--base-input-border-radius);
  }
`

const Input = styled.input`
  /* if disabled remove click events */
  pointer-events: ${(props) => props.disabled && 'none'};
  cursor: pointer;

  width: 100%;
  height: 100%;

  &:focus-visible {
    outline: 1px solid var(--md-sys-color-primary);
  }
`

const Checkerboard = styled.span`
  width: 100%;
  height: 100%;
  pointer-events: none;

  /* DOES NOT SUPPORT IE or pre-Chromium Edge */
  background: repeating-conic-gradient(#808080 0% 25%, rgb(51 51 51) 0% 50%) 50% / 15px 15px;
`

const ColorButton = styled.button`
  border: 1px solid var(--md-sys-color-outline-variant);
  cursor: pointer;
  margin: 0;

  /* if disabled remove click events */
  pointer-events: ${(props) => props.disabled && 'none'};

  &:focus-visible {
    outline: 1px solid var(--md-sys-color-primary);
  }

  &.error,
  &:invalid {
    border-color: var(--color-hl-error);
  }
`

const ColorPickerPreview = forwardRef<HTMLDivElement, ColorPickerPreviewProps>(
  ({ onClick, onChange, backgroundColor, value, onBlur, ...props }, ref) => {
    return (
      <Wrapper ref={ref} className={clsx('color-picker-preview', props.className)} {...props}>
        <Input
          type="color"
          disabled={!onChange}
          tabIndex={!onChange ? -1 : 0}
          onChange={onChange && onChange}
          value={value}
          onBlur={onBlur}
          className="color-picker-input"
        />
        <Checkerboard />
        <ColorButton
          style={{
            backgroundColor: backgroundColor,
            pointerEvents: onClick ? 'auto' : 'none',
          }}
          disabled={!onClick}
          tabIndex={!onClick ? -1 : 0}
          onClick={onClick}
          className="color-picker-button"
        />
      </Wrapper>
    )
  },
)

export default ColorPickerPreview
