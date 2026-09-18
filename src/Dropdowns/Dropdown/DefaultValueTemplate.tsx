import { FC } from 'react'
import styled, { css } from 'styled-components'
import { Icon, IconImage, IconType, isIconImage } from '../../Icon'
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

const ValueItemStyled = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

export interface DefaultValueItem {
  icon?: string
  label: React.ReactNode
  showLabel?: boolean
}

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
  displayIcons?: string[]
  displayItems?: DefaultValueItem[]
  showValue?: boolean
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
  displayIcons,
  displayItems,
  showValue = true,
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
  const icons = displayIcons ?? (displayIcon ? [displayIcon] : [])

  return (
    <DefaultValueStyled
      style={style}
      className={clsx('template-value', className, { error: hasError, open: isOpen })}
    >
      {childrenCustom ? (
        childrenCustom
      ) : noValue ? (
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
            {displayItems ? (
              displayItems.map((item, index) => (
                <ValueItemStyled key={`${item.icon || 'label'}-${index}`}>
                  {item.icon &&
                    (isIconImage(item.icon) ? (
                      <IconImage icon={item.icon} />
                    ) : (
                      <Icon icon={item.icon as IconType} />
                    ))}
                  {item.showLabel !== false && (
                    <ValueStyled style={valueStyle}>{item.label}</ValueStyled>
                  )}
                </ValueItemStyled>
              ))
            ) : (
              <>
                {showValue && isMultiple && <span>{`Mixed (`}</span>}
                {icons.map((icon, index) =>
                  isIconImage(icon) ? (
                    <IconImage key={`${icon}-${index}`} icon={icon} />
                  ) : (
                    <Icon key={`${icon}-${index}`} icon={icon as IconType} />
                  ),
                )}
                {showValue && <ValueStyled style={valueStyle}>{children}</ValueStyled>}
                {showValue && isMultiple && <span>{`)`}</span>}
              </>
            )}
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

      <Icon icon={dropIcon} className="control" />
    </DefaultValueStyled>
  )
}
