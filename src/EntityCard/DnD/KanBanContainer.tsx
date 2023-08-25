import { FC } from 'react'
import * as Styled from './KanBanContainer.styled'

interface KanBanContainerProps {
  children: React.ReactNode
}

const KanBanContainer: FC<KanBanContainerProps> = ({ children }) => {
  return <Styled.KanBan>{children}</Styled.KanBan>
}

export default KanBanContainer
