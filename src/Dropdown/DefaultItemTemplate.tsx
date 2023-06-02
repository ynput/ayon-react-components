import { FC } from 'react'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { DefaultItemStyled, DropdownProps, ListItemStyled, OptionsStyled } from './Dropdown'

export interface DefaultItemTemplateProps
  extends Pick<
    DropdownProps,
    | 'message'
    | 'search'
    | 'editable'
    | 'listStyle'
    | 'maxHeight'
    | 'dataKey'
    | 'labelKey'
    | 'itemTemplate'
    | 'value'
  > {
  displayIcon?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  valueStyle?: React.CSSProperties
  isOpen?: boolean
  className?: string
  selected?: any
  usingKeyboard?: any
  activeIndex?: any
  searchRef?: any
  hiddenLength?: any
  handleChange?: any
  optionsRef?: any
  minWidth?: any
  startAnimation?: any
  optionsHeight?: any
  startAnimationFinished?: any
  showOptions?: any
  setStartAnimationFinished?: any
}

export const DefaultItemTemplate: FC<DefaultItemTemplateProps> = ({
  message,
  search,
  editable,
  optionsRef,
  minWidth,
  listStyle,
  startAnimation,
  optionsHeight,
  maxHeight,
  startAnimationFinished,
  setStartAnimationFinished,
  showOptions,
  dataKey,
  labelKey,
  itemTemplate,
  value,
  selected,
  usingKeyboard,
  activeIndex,
  searchRef,
  hiddenLength,
  handleChange,
}) => {
  return (
    <OptionsStyled
      $message={message || ''}
      $search={!!search || !!editable}
      ref={optionsRef}
      style={{ minWidth, ...listStyle }}
      $startAnimation={startAnimation}
      $animationHeight={optionsHeight}
      $maxHeight={maxHeight}
      onAnimationEnd={() => setStartAnimationFinished(true)}
      className="options"
    >
      {showOptions.map((option, i) => (
        <ListItemStyled
          key={`${option[dataKey]}-${i}`}
          onClick={(e) => handleChange(option[dataKey], i, e)}
          $focused={usingKeyboard && activeIndex === i}
          $usingKeyboard={usingKeyboard}
          $startAnimation={
            startAnimation && !startAnimationFinished && (search || editable || i !== 0)
          }
          tabIndex={0}
          className="option"
        >
          {itemTemplate ? (
            itemTemplate(
              option,
              value.includes(option[dataKey]),
              selected.includes(option[dataKey]),
              i,
            )
          ) : (
            <DefaultItemStyled
              $isSelected={selected.includes(option[dataKey])}
              className="option-child"
            >
              {option.icon && <Icon icon={option.icon} />}
              <span>{option[labelKey] || option[dataKey]}</span>
            </DefaultItemStyled>
          )}
        </ListItemStyled>
      ))}
      {!!hiddenLength && (
        <ListItemStyled
          onClick={() => searchRef.current?.focus()}
          $focused={false}
          $usingKeyboard={false}
          $startAnimation={startAnimation}
          className="option"
        >
          <DefaultItemStyled $isSelected={false} className="option-child hidden">
            <span>{`Search ${hiddenLength} more...`}</span>
          </DefaultItemStyled>
        </ListItemStyled>
      )}
    </OptionsStyled>
  )
}
