import { forwardRef } from 'react'
import styled from 'styled-components'

const StyledImage = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`

export interface IconImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  icon: string
}

export const isIconImage = (icon: string) => /^(https?:\/\/|\/|\.{1,2}\/)/.test(icon)

export const IconImage = forwardRef<HTMLImageElement, IconImageProps>(({ icon, ...props }, ref) => (
  <StyledImage ref={ref} src={icon} alt="" {...props} />
))
