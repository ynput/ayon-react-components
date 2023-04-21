import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  .label {
    min-width: 120px;
    display: block;
    height: var(--base-input-size);
    line-height: var(--base-input-size);
  }

  .field {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: left;
    overflow: hidden;
    padding: 1px;
    margin: -1px;

    .colorpick-eyedropper-input-trigger {
      display: none;
    }
  }
`

export interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  fieldStyle: React.CSSProperties
  labelStyle: React.CSSProperties
}

export const FormRow = forwardRef<HTMLDivElement, FormRowProps>(
  ({ label, children, fieldStyle, labelStyle, ...props }, ref) => {
    return (
      <StyledRow {...props} ref={ref}>
        <div className="label">{label}</div>
        <div className="field" style={fieldStyle}>
          {children}
        </div>
      </StyledRow>
    )
  },
)
