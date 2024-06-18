import styled, { css } from 'styled-components'
import { UserImage } from '../../User/UserImage'
import { Icon } from '../../Icon'

const RowStyled = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;

  ${({ isSelected }: { isSelected?: boolean }) =>
    isSelected &&
    css`
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
    `}
`

export interface AssigneeDropdownProps {
  name: string
  fullName?: string
  avatarUrl?: string
  isSelected?: boolean
  onClick?: () => void
  size?: number
  selectAll?: string | boolean
  allSelected?: boolean
}

export const AssigneeDropdownTemplate = ({
  name,
  avatarUrl,
  fullName,
  isSelected,
  onClick,
  size = 21,
  selectAll,
  allSelected,
}: AssigneeDropdownProps) => {
  if (selectAll === name) {
    return (
      <RowStyled {...{ isSelected, onClick }}>
        <Icon icon="done_all" />
        {allSelected ? 'Deselect All' : 'Select All'}
      </RowStyled>
    )
  }

  return (
    <RowStyled {...{ isSelected, onClick }}>
      <UserImage src={avatarUrl} fullName={fullName} name={name} size={size} />
      {fullName || name}
    </RowStyled>
  )
}
