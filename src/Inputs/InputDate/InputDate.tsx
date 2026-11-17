import type { ComponentType } from 'react'
import ReactDatePicker, { DatePickerProps } from 'react-datepicker'
import styled from 'styled-components'
import 'react-datepicker/dist/react-datepicker.css'
import './InputDate.scss'

// styled-components can't follow DatePicker's union of props, so the styled component is typed
// with InputDateProps after it is made
const StyledInputDate = styled(ReactDatePicker as ComponentType<{ className?: string }>)<{
  style?: any
}>`
  width: 100%;

  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--base-input-border-radius);
  min-height: var(--base-input-size);
  max-height: var(--base-input-size);
  padding: 0 5px;

  &:focus-visible {
    outline: 1px solid var(--md-sys-color-primary);
  }

  &.error,
  &:invalid {
    border-color: var(--color-hl-error);
  }

  &:disabled {
    opacity: 0.7;
    font-style: italic;
    cursor: not-allowed;
  }

  /* spread style */
  ${({ style }) => style}
` as unknown as ComponentType<InputDateProps>

// react-datepicker's props are a union (single date, range or several dates): a type, not an interface
export type InputDateProps = DatePickerProps & {
  style?: React.CSSProperties
}

export const InputDate = (props: InputDateProps) => (
  <StyledInputDate
    // react-datepicker 4 opened under the input's left edge; newer versions centre it
    popperPlacement="bottom-start"
    {...props}
    style={props.style}
    dateFormat={props.dateFormat || 'dd/MM/yyyy'}
  />
)
