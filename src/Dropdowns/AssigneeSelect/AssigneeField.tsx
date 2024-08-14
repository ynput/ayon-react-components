import styled, { css } from 'styled-components'
import { UserImagesStacked } from '../../User/UserImagesStacked'
import { forwardRef } from 'react'
import { Icon, IconType } from '../../Icon'
import clsx from 'clsx'

const FieldStyled = styled.div<{
  disabled?: boolean
  $align?: 'left' | 'right'
}>`
  position: relative;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  width: fit-content;
  gap: 4px;
  display: flex;

  .name {
    position: relative;
    top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.7;
    `}

  &.multiple {
    ::before {
      content: 'Mixed (';
      margin-right: 4px;
    }

    ::after {
      content: ')';
      margin-left: 4px;
    }
  }

  ${({ $align }) =>
    $align === 'left' &&
    css`
      justify-content: flex-start;
    `}

  ${({ $align }) =>
    $align === 'right' &&
    css`
      justify-content: flex-end;
    `}
`

export interface AssigneeFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  users: {
    name: string
    fullName?: string | null
    avatarUrl?: string
  }[]
  value?: (string | number)[]
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  disabled?: boolean
  isMultiple?: boolean
  placeholder?: string
  emptyMessage?: string
  emptyIcon?: IconType | null
  size?: number
  align?: 'left' | 'right'
  allSelected?: boolean
}

export const AssigneeField = forwardRef<HTMLDivElement, AssigneeFieldProps>(
  (
    {
      users = [],
      value = [],
      onClick,
      disabled,
      isMultiple,
      placeholder,
      emptyIcon = 'person_add',
      emptyMessage = '',
      size = 21,
      align,
      allSelected,
      ...props
    },
    ref,
  ) => {
    if (allSelected)
      return (
        <FieldStyled
          onClick={!disabled ? (e) => onClick && onClick(e) : undefined}
          disabled={disabled}
          $align={align}
          {...props}
          ref={ref}
        >
          <Icon icon="done_all" /> All Users
        </FieldStyled>
      )

    return (
      <FieldStyled
        onClick={!disabled ? (e) => onClick && onClick(e) : undefined}
        disabled={disabled}
        $align={align}
        {...props}
        ref={ref}
        className={clsx('assignee-field', props.className, {
          multiple: isMultiple && (!disabled || !placeholder),
        })}
      >
        {!(disabled && placeholder) ? (
          users.length ? (
            <>
              <UserImagesStacked
                users={users}
                size={size}
                gap={-0.3}
                userStyle={{
                  minWidth: size,
                  minHeight: size,
                  maxHeight: size,
                  maxWidth: size,
                }}
              />
              {users.length < 2 && <span className="name">{users[0]?.fullName}</span>}
            </>
          ) : (
            <>
              {emptyIcon && !isMultiple && <Icon icon={emptyIcon} />}
              {emptyMessage && <span>{emptyMessage}</span>}
            </>
          )
        ) : (
          <span>{placeholder}</span>
        )}
      </FieldStyled>
    )
  },
)
