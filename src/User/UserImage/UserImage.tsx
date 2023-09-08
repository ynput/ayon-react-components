import { forwardRef } from 'react'
import * as Styled from './UserImage.styled'

export interface UserImageProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string
  fullName?: string
  size?: number
  highlight?: boolean
}

export const UserImage = forwardRef<HTMLSpanElement, UserImageProps>(
  ({ src, fullName, size = 30, highlight, ...props }, ref) => {
    const fontSize = Math.round((13 / 30) * size)

    const initials = fullName
      ?.split(' ')
      .map((w) => w[0]?.toUpperCase())
      .splice(0, 2)
      .join('')

    return (
      <Styled.CircleImage
        style={{ width: size, maxHeight: size, minHeight: size, ...props.style }}
        $highlight={highlight}
        ref={ref}
        {...props}
      >
        {src ? <img src={src} /> : <span style={{ fontSize: `${fontSize}px` }}>{initials}</span>}
      </Styled.CircleImage>
    )
  },
)
