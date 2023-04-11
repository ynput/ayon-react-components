import { ChangeEvent, FC, FocusEvent } from 'react'
import styled, { css } from 'styled-components'

// types
export interface ColorPickerPreviewProps {
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

  &:focus {
    outline: 1px solid var(--color-hl-00);
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
  color: var(--color-text);
  border: 1px solid var(--color-grey-03);
  cursor: pointer;
  margin: 0;

  /* if disabled remove click events */
  pointer-events: ${(props) => props.disabled && 'none'};

  &:focus {
    outline: 1px solid var(--color-hl-00);
  }

  &.error,
  &:invalid {
    border-color: var(--color-hl-error);
  }
`

const ColorPickerPreview: FC<ColorPickerPreviewProps> = ({
  onClick,
  onChange,
  backgroundColor,
  value,
  onBlur,
}) => {
  return (
    <Wrapper>
      <Input
        type="color"
        disabled={!onChange}
        tabIndex={!onChange ? -1 : 0}
        onChange={onChange && onChange}
        value={value}
        onBlur={onBlur}
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
      />
    </Wrapper>
  )
}

export default ColorPickerPreview
