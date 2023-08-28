import { FC } from 'react'
import styled, { css } from 'styled-components'
import { Icon, IconType } from '../../Icon'
import { DropdownProps } from './Dropdown'

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

  .icon.control {
    transition: transform 0.15s;
    /* scale and opacity goes to 0 when open  */
    ${({ isOpen }: { isOpen: boolean }) =>
      isOpen &&
      css`
        &:not(#clear) {
          transform: rotate(180deg);
        }
      `}
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
    'value' | 'isMultiple' | 'dropIcon' | 'onClear' | 'onClearNoValue' | 'placeholder'
  > {
  displayIcon?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  valueStyle?: React.CSSProperties
  isOpen?: boolean
  className?: string
  childrenCustom?: React.ReactNode
}

export const DefaultValueTemplate: FC<DefaultValueTemplateProps> = ({
  value = [],
  isMultiple,
  dropIcon = 'expand_more',
  displayIcon,
  onClear,
  onClearNoValue,
  children,
  style,
  valueStyle,
  placeholder = 'Select an option...',
  isOpen,
  className,
  childrenCustom,
}) => {
  const noValue = !value.length

  return (
    <DefaultValueStyled style={style} isOpen={!!isOpen} className={className}>
      {noValue ? (
        <>
          <ContentStyled>
            <ValueStyled>{placeholder}</ValueStyled>
          </ContentStyled>
          {onClear && onClearNoValue && (
            <Icon icon={'close'} onClick={onClear} id="clear" className="control" tabIndex={0} />
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
          {onClear && (
            <Icon icon={'close'} onClick={onClear} id="clear" className="control" tabIndex={0} />
          )}
        </>
      )}
      {childrenCustom}
      <Icon icon={dropIcon} className="control" />
    </DefaultValueStyled>
  )
}
