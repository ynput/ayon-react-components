import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'
import { ShortcutTag } from '../../ShortcutTag'

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  .label {
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
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
  shortcut?: string | React.ReactNode
  fieldStyle?: React.CSSProperties
  labelStyle?: React.CSSProperties
}

export const FormRow = forwardRef<HTMLDivElement, FormRowProps>(
  ({ label, shortcut, children, fieldStyle, labelStyle, ...props }, ref) => {
    return (
      <StyledRow {...props} ref={ref}>
        <div className="label" style={labelStyle}>
          {label}
          {shortcut &&
            (typeof shortcut === 'string' ? <ShortcutTag>{shortcut}</ShortcutTag> : shortcut)}
        </div>
        <div className="field" style={fieldStyle}>
          {children}
        </div>
      </StyledRow>
    )
  },
)
