import { CSSProperties, InputHTMLAttributes, forwardRef } from 'react'
import * as Styled from './InputSwitch.styled'

// types
export interface InputSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  switchClassName?: string
  switchStyle?: CSSProperties
  compact?: boolean
}

export const InputSwitch = forwardRef<HTMLInputElement, InputSwitchProps>(
  ({ switchStyle, switchClassName, compact, ...props }, ref) => (
    <Styled.Switch
      style={switchStyle}
      className={`${switchClassName} ${props.className} ${compact ? 'compact' : ''}`}
    >
      <label className="switch-body">
        <input type="checkbox" {...props} ref={ref} />
        <span className="slider"></span>
      </label>
    </Styled.Switch>
  ),
)
