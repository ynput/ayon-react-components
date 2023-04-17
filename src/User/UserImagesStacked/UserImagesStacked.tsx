import styled from 'styled-components'
import { UserImage } from '../UserImage'
import { forwardRef } from 'react'

const StackedStyled = styled.div`
  position: relative;
  display: flex;
  z-index: 10;
  & > * + * {
    margin-left: ${({ gap }: { gap: number }) => `${gap}px`};
  }
`

export interface UserImagesStackedProps extends React.HTMLAttributes<HTMLDivElement> {
  users: {
    avatarUrl?: string
    fullName?: string
    self?: boolean
  }[]
  size?: number
  gap?: number
  max?: number
}

export const UserImagesStacked = forwardRef<HTMLDivElement, UserImagesStackedProps>(
  ({ users = [], size = 30, gap = -1, max = 5, ...props }) => {
    const length = users.length
    // limit to 5 users
    users = users.slice(0, max)

    // show extras
    if (length > max) {
      users.push({ fullName: `+ ${length - max > 9 ? '+' : length - max}` })
    }

    return (
      <StackedStyled gap={(gap * 30) / 2} {...props}>
        {users.map((user, i) => (
          <UserImage
            src={user.avatarUrl}
            key={i}
            fullName={user.fullName || ''}
            style={{ zIndex: -i }}
            highlight={user.self}
            size={size}
          />
        ))}
      </StackedStyled>
    )
  },
)
