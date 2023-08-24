import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'
import styled from 'styled-components'
import 'react-datepicker/dist/react-datepicker.css'
import './InputDate.scss'

const StyledInputDate = styled(ReactDatePicker)`
  width: 100%;

  color: var(--color-text);
  border: 1px solid var(--color-grey-03);
  background-color: var(--color-grey-00);
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
  ${({ style }: { style?: any }) => style}
`

export interface InputDateProps extends ReactDatePickerProps {
  style?: React.CSSProperties
}

export const InputDate = (props: InputDateProps) => (
  <StyledInputDate {...props} style={props.style} dateFormat={props.dateFormat || 'dd/MM/yyyy'} />
)
