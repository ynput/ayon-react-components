import { FC } from 'react'
import styled from 'styled-components'
import { Icon } from '../Icon'
import { DropdownProps } from './Dropdown'

const DefaultValueStyled = styled.div`
  border: 1px solid var(--color-grey-03);
  border-radius: var(--border-radius);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 8px;
  gap: 8px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  & > * {
    left: -1px;
    position: relative;
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
  displayIcon: string
  style?: React.CSSProperties
  children?: React.ReactNode
  valueStyle?: React.CSSProperties
}

const DefaultValueTemplate: FC<DefaultValueTemplateProps> = ({
  value = [],
  isMultiple,
  dropIcon = 'expand_more',
  displayIcon,
  onClear,
  children,
  style,
  valueStyle,
  placeholder = 'Select an option...',
}) => {
  const noValue = !value.length

  return (
    <DefaultValueStyled style={style}>
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
            {displayIcon && <span className="material-symbols-outlined">{displayIcon}</span>}
            <ValueStyled style={valueStyle}>{children}</ValueStyled>
            {isMultiple && <span>{`)`}</span>}
          </ContentStyled>
          {onClear && <Icon icon="clear" onClick={onClear} id="clear" tabIndex={0} />}
        </>
      )}

      <Icon icon={dropIcon} />
    </DefaultValueStyled>
  )
}

export default DefaultValueTemplate
