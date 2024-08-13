import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'
import styled from 'styled-components'
import 'react-datepicker/dist/react-datepicker.css'
import './InputDate.scss'

const StyledInputDate = styled(ReactDatePicker)<{ style?: any }>`
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
`

export interface InputDateProps extends ReactDatePickerProps {
  style?: React.CSSProperties
}

export const InputDate = (props: InputDateProps) => (
  <StyledInputDate {...props} style={props.style} dateFormat={props.dateFormat || 'dd/MM/yyyy'} />
)
