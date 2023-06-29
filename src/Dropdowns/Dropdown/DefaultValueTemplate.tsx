import { FC } from 'react'
import styled, { css } from 'styled-components'
import { Icon, IconType } from '../../Icon'
import { DropdownProps } from './Dropdown'

const DefaultValueStyled = styled.div`
  border: 1px solid var(--color-grey-03);
  background-color: var(--color-grey-01);
  border-radius: var(--border-radius);
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
  extends Pick<DropdownProps, 'value' | 'isMultiple' | 'dropIcon' | 'onClear' | 'placeholder'> {
  displayIcon?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  valueStyle?: React.CSSProperties
  isOpen?: boolean
  className?: string
}

export const DefaultValueTemplate: FC<DefaultValueTemplateProps> = ({
  value = [],
  isMultiple,
  dropIcon = 'expand_more',
  displayIcon,
  onClear,
  children,
  style,
  valueStyle,
  placeholder = 'Select an option...',
  isOpen,
  className,
}) => {
  const noValue = !value.length

  return (
    <DefaultValueStyled style={style} isOpen={!!isOpen} className={className}>
      {noValue ? (
        <>
          {!value.length && (
            <ContentStyled>
              <ValueStyled>{placeholder}</ValueStyled>
            </ContentStyled>
          )}
        </>
      ) : (
        <>
          <ContentStyled>
            {isMultiple && <span>{`Multiple (`}</span>}
            {displayIcon && <Icon icon={displayIcon as IconType} />}
            <ValueStyled style={valueStyle}>{children}</ValueStyled>
            {isMultiple && <span>{`)`}</span>}
          </ContentStyled>
          {onClear && (
            <Icon icon={'close'} onClick={onClear} id="clear" className="control" tabIndex={0} />
          )}
        </>
      )}

      <Icon icon={dropIcon} className="control" />
    </DefaultValueStyled>
  )
}
