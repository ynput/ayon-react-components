import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { StyledInput, StyledToggleInput } from '../styles'
import { Icon } from '../../Icon';

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  canToggle?: boolean;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(({ canToggle, ...props}, ref) => {

  const [isVisible, setIsVisible] = useState(false)
  const resolveIcon = isVisible ? 'visibility_off' : 'visibility'
  const handleVisible = () => setIsVisible(!isVisible)
  
  return (
    !!canToggle ?
    <StyledToggleInput>
      <StyledInput $isHidden={!isVisible} type="text" ref={ref} {...props} />
      <Icon className="eyeIcon" onClick={handleVisible} icon={resolveIcon}/>
    </StyledToggleInput>
    :
    <StyledInput type="text" ref={ref} {...props} />
  )
}
)
InputText.displayName = 'InputText'
