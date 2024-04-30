import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { StyledInput, StyledToggleInput } from '../styles'
import { Icon } from '../../Icon'

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  canRevealPassword?: boolean;
}

export const InputPassword = forwardRef<HTMLInputElement, PasswordInputProps>(({ canRevealPassword = true, ...props}, ref) => {

    const [isVisible, setIsVisible] = useState(false)
    const resolveIcon = isVisible ? 'visibility_off' : 'visibility'
    const handleVisible = () => setIsVisible(!isVisible)
    
    return (
      !!canRevealPassword ?
      <StyledToggleInput>
        <StyledInput type={isVisible ? '' : 'password'} ref={ref} {...props} />
        <Icon className="eyeIcon" onClick={handleVisible} icon={resolveIcon}/>
      </StyledToggleInput>
      :
      <StyledInput type={'password'} ref={ref} {...props} />
    )
  }
)
InputPassword.displayName = 'InputPassword'
