import styled from 'styled-components'
import { UserImage } from '../UserImage'
import { forwardRef } from 'react'

const StackedStyled = styled.div<{ $gap: number }>`
  position: relative;
  display: flex;
  z-index: 10;
  & > * + * {
    margin-left: ${({ $gap }) => `${$gap}px`};
  }
`

export interface User {
  avatarUrl?: string
  fullName?: string
  name: string
  self?: boolean
}

export interface UserImagesStackedProps extends React.HTMLAttributes<HTMLDivElement> {
  users: User[]
  size?: number
  gap?: number
  max?: number
  userStyle?: React.CSSProperties
}

export const UserImagesStacked = forwardRef<HTMLDivElement, UserImagesStackedProps>(
  ({ users = [], size = 30, gap = -1, max = 5, userStyle, ...props }, ref) => {
    const length = users.length
    // limit to 5 users
    const usersToShow = [...users].slice(0, max)

    // show extras
    if (length > max) {
      // remove last user
      usersToShow.pop()
      // add a +1 user
      const extraCount = length - max + 1 // +1 for the user we just removed
      const extraString = extraCount > 9 ? '++' : '+ ' + extraCount
      usersToShow.push({
        fullName: extraString,
        name: extraString,
      })
    }

    return (
      <StackedStyled $gap={(gap * 30) / 2} {...props} ref={ref}>
        {usersToShow.map(({ avatarUrl, name, fullName, self }, i) => (
          <UserImage
            src={avatarUrl}
            key={i}
            name={name}
            fullName={fullName || ''}
            style={{ zIndex: -i, width: size, height: size, ...userStyle }}
            highlight={self}
            size={size}
          />
        ))}
      </StackedStyled>
    )
  },
)
