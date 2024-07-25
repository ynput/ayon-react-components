import styled, { css } from 'styled-components'
import { UserImage } from '../../User/UserImage'
import { Icon } from '../../Icon'
import clsx from 'clsx'

const RowStyled = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;

  &.selected {
    background-color: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);

    &:hover {
      background-color: var(--md-sys-color-primary-container-hover);
    }
  }

  &.error {
    background-color: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);

    &:hover {
      background-color: var(--md-sys-color-error-container-hover);
    }
  }
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
  error?: string
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
  error,
}: AssigneeDropdownProps) => {
  // SELECT ALL ROW
  if (selectAll && name && selectAll === name) {
    return (
      <RowStyled {...{ isSelected, onClick }}>
        <Icon icon="done_all" />
        {allSelected ? 'Deselect All' : 'Select All'}
      </RowStyled>
    )
  }

  if (!name) return null

  // USER ROW
  return (
    <RowStyled onClick={onClick} className={clsx({ selected: isSelected, error: !!error })}>
      <UserImage src={avatarUrl} fullName={fullName} name={name} size={size} />
      {fullName || name}
      {!!error && ' (missing)'}
    </RowStyled>
  )
}
