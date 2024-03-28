import { forwardRef } from 'react'
import * as Styled from './UserImage.styled'

export interface UserImageProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string
  fullName?: string
  name: string
  size?: number
  highlight?: boolean
}

export const UserImage = forwardRef<HTMLSpanElement, UserImageProps>(
  ({ src, name, fullName, size = 30, highlight, className, ...props }, ref) => {
    const fontSize = Math.round((13 / 30) * size)  
    const nameData = fullName || name
    const hasNameData = !!nameData

    const createInitials = (nameData: string) => {
      // regex handles different type of whitespaces 
      const words = nameData.trim().split(/\s+/)
      const mappedInitials = words.slice(0, 2).map(word => word[0].toUpperCase()).join('')
      return mappedInitials;
    }
    const initials = hasNameData ? createInitials(nameData) : 'N/A'

    return (
      <Styled.CircleImage
        style={{ width: size, maxHeight: size, minHeight: size, ...props.style }}
        $highlight={highlight}
        ref={ref}
        className={`${className ? className : ''} ${src ? '' : 'initials'} user-image`}
        {...props}
      >
        {src ? <img src={src} /> : <span style={{ fontSize: `${fontSize}px` }}>{initials}</span>}
      </Styled.CircleImage>
    )
  },
)
