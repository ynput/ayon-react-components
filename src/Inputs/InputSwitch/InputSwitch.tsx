import { CSSProperties, InputHTMLAttributes, forwardRef } from 'react'
import * as Styled from './InputSwitch.styled'

// types
export interface InputSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  switchClassName?: string
  switchStyle?: CSSProperties
  compact?: boolean
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => void
}

export const InputSwitch = forwardRef<HTMLInputElement, InputSwitchProps>(
  ({ switchStyle, switchClassName, compact, onChange, ...props }, ref) => (
    <Styled.Switch
      style={switchStyle}
      className={`${switchClassName} ${props.className} ${compact ? 'compact' : ''}`}
    >
      <label className="switch-body">
        <input
          type="checkbox"
          {...props}
          ref={ref}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !props.disabled) {
              e.preventDefault()
              e.stopPropagation()
              onChange && onChange(e)
            }
          }}
        />
        <span className="slider"></span>
      </label>
    </Styled.Switch>
  ),
)
