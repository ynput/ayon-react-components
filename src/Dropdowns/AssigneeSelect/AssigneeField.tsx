import styled, { css } from 'styled-components'
import { UserImagesStacked } from '../../User/UserImagesStacked'
import { forwardRef } from 'react'
import { Icon, IconType } from '../../Icon'

const FieldStyled = styled.div<{
  disabled?: boolean
  isMultiple?: boolean
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

  ${({ isMultiple }) =>
    isMultiple &&
    css`
      ::before {
        content: 'Mixed (';
        margin-right: 4px;
      }

      ::after {
        content: ')';
        margin-left: 4px;
      }
    `}

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
  value: {
    name: string
    fullName?: string
    avatarUrl?: string
  }[]
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  disabled?: boolean
  isMultiple?: boolean
  placeholder?: string
  emptyMessage?: string
  emptyIcon?: IconType | null
  size?: number
  align?: 'left' | 'right'
}

export const AssigneeField = forwardRef<HTMLDivElement, AssigneeFieldProps>(
  (
    {
      value = [],
      onClick,
      disabled,
      isMultiple,
      placeholder,
      emptyIcon = 'person_add',
      emptyMessage = '',
      size = 21,
      align,
      ...props
    },
    ref,
  ) => {
    return (
      <FieldStyled
        onClick={!disabled ? (e) => onClick && onClick(e) : undefined}
        disabled={disabled}
        isMultiple={isMultiple && (!disabled || !placeholder)}
        $align={align}
        {...props}
        ref={ref}
      >
        {!(disabled && placeholder) ? (
          value.length ? (
            <>
              <UserImagesStacked
                users={value}
                size={size}
                gap={-0.3}
                userStyle={{
                  minWidth: size,
                  minHeight: size,
                  maxHeight: size,
                  maxWidth: size,
                }}
              />
              {value.length < 2 && <span className="name">{value[0]?.fullName}</span>}
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
