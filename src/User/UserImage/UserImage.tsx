import { forwardRef } from 'react'
import styled, { css } from 'styled-components'

const CircleImage = styled.div`
  border-radius: 100%;
  aspect-ratio: 1/1;

  width: 30px;
  max-height: 30px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
  background-color: var(--color-grey-03);
  border: solid 1px var(--color-grey-06);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* if highlight true make border green */
  ${({ highlight }: { highlight?: boolean }) =>
    highlight &&
    css`
      border-color: var(--toastify-color-success);
    `}
`

export interface UserImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  fullName?: string
  size?: number
  highlight?: boolean
}

export const UserImage = forwardRef<HTMLDivElement, UserImageProps>(
  ({ src, fullName, size = 30, highlight, ...props }, ref) => {
    const fontSize = Math.round((13 / 30) * size)

    const initials = fullName
      ?.split(' ')
      .map((w) => w[0]?.toUpperCase())
      .splice(0, 2)
      .join('')

    return (
      <CircleImage
        style={{ width: size, maxHeight: size, minHeight: size, ...props.style }}
        highlight={highlight}
        ref={ref}
        {...props}
      >
        {src ? <img src={src} /> : <span style={{ fontSize: `${fontSize}px` }}>{initials}</span>}
      </CircleImage>
    )
  },
)
