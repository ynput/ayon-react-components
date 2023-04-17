import styled, { css } from 'styled-components'
import { UserImage } from '../User/UserImage'

const RowStyled = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;

  ${({ isSelected }: { isSelected?: boolean }) =>
    isSelected &&
    css`
      background-color: var(--color-row-hl);
    `}
`

export interface AssigneeDropdownProps {
  name: string
  fullName?: string
  avatarUrl?: string
  isSelected?: boolean
  onClick?: () => void
  size?: number
}

export const AssigneeDropdownTemplate = ({
  name,
  avatarUrl,
  fullName,
  isSelected,
  onClick,
  size = 21,
}: AssigneeDropdownProps) => {
  return (
    <RowStyled {...{ isSelected, onClick }}>
      <UserImage src={avatarUrl} fullName={fullName || name} size={size} />
      {fullName || name}
    </RowStyled>
  )
}
