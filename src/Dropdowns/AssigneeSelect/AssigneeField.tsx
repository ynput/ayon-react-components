import styled, { css } from 'styled-components'
import { UserImagesStacked } from '../../User/UserImagesStacked'
import { forwardRef } from 'react'
import { Icon } from '../../Icon'

const FieldStyled = styled.div<{ disabled?: boolean; isMultiple?: boolean }>`
  position: relative;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  height: 30px;
  gap: 4px;

  span {
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
  emptyIcon?: boolean
  size?: number
}

export const AssigneeField = forwardRef<HTMLDivElement, AssigneeFieldProps>(
  (
    {
      value = [],
      onClick,
      disabled,
      isMultiple,
      placeholder,
      emptyIcon = true,
      emptyMessage = '',
      size = 21,
      ...props
    },
    ref,
  ) => {
    return (
      <FieldStyled
        onClick={!disabled ? (e) => onClick && onClick(e) : undefined}
        disabled={disabled}
        isMultiple={isMultiple && (!disabled || !placeholder)}
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
              {value.length < 2 && <span>{value[0]?.fullName}</span>}
            </>
          ) : (
            <>
              {emptyIcon && !isMultiple && <Icon icon="add_circle" />}
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
