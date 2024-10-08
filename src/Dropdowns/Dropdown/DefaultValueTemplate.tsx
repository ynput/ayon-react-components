import { FC } from 'react'
import styled, { css } from 'styled-components'
import { Icon, IconType } from '../../Icon'
import { DropdownProps } from './Dropdown'
import clsx from 'clsx'

const DefaultValueStyled = styled.div`
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--border-radius-m);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 8px;
  gap: 8px;
  cursor: pointer;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  & > * {
    position: relative;
  }

  transition: border-color 0.2s;
  transition-delay: 0.3s;

  &.error {
    border-color: var(--md-sys-color-error);
  }

  .icon.control {
    transition: transform 0.15s;
  }

  &.open {
    .icon.control {
      &:not(#clear):not(#backspace) {
        transform: rotate(180deg);
      }
    }
  }
`

const ValueStyled = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`

const ContentStyled = styled.div`
  overflow: hidden;
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`

export interface DefaultValueTemplateProps
  extends Pick<
    DropdownProps,
    | 'value'
    | 'isMultiple'
    | 'dropIcon'
    | 'onClear'
    | 'onClearNull'
    | 'nullPlaceholder'
    | 'placeholder'
    | 'clearTooltip'
    | 'clearNullTooltip'
  > {
  displayIcon?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  valueStyle?: React.CSSProperties
  isOpen?: boolean
  className?: string
  childrenCustom?: React.ReactNode
  hasError?: boolean
}

export const DefaultValueTemplate: FC<DefaultValueTemplateProps> = ({
  value = [],
  isMultiple,
  dropIcon = 'expand_more',
  displayIcon,
  onClear,
  clearTooltip,
  onClearNull,
  clearNullTooltip,
  nullPlaceholder,
  children,
  style,
  valueStyle,
  placeholder = 'Select an option...',
  isOpen,
  className,
  childrenCustom,
  hasError,
}) => {
  const noValue = !value?.length

  return (
    <DefaultValueStyled
      style={style}
      className={clsx('template-value', className, { error: hasError, open: isOpen })}
    >
      {noValue ? (
        <>
          <ContentStyled>
            <ValueStyled style={{ opacity: 0.5 }} className="placeholder">
              {value === null ? nullPlaceholder || '(no value)' : placeholder}
            </ValueStyled>
          </ContentStyled>
          {onClearNull && (
            <Icon
              icon={'backspace'}
              onClick={() => onClearNull(null)}
              id={'backspace'}
              className="clear-null"
              tabIndex={0}
              data-tooltip={clearNullTooltip}
            />
          )}
          {onClear && (
            <Icon
              icon={'close'}
              onClick={() => onClear([])}
              id={'clear'}
              className="clear"
              tabIndex={0}
              data-tooltip={clearTooltip}
            />
          )}
        </>
      ) : (
        <>
          <ContentStyled>
            {isMultiple && <span>{`Mixed (`}</span>}
            {displayIcon && <Icon icon={displayIcon as IconType} />}
            <ValueStyled style={valueStyle}>{children}</ValueStyled>
            {isMultiple && <span>{`)`}</span>}
          </ContentStyled>
          {onClearNull && (
            <Icon
              icon={'backspace'}
              onClick={() => onClearNull(null)}
              id={'backspace'}
              className="clear-null"
              tabIndex={0}
              data-tooltip={clearNullTooltip}
            />
          )}
          {onClear && (
            <Icon
              icon={'close'}
              onClick={() => onClear([])}
              id="clear"
              className="clear"
              tabIndex={0}
              data-tooltip={clearTooltip}
            />
          )}
        </>
      )}
      {childrenCustom}

      <Icon icon={dropIcon} className="control" />
    </DefaultValueStyled>
  )
}
