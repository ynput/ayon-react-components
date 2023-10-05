import React, { CSSProperties, forwardRef, useEffect, RefObject } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import * as Styled from './Dropdown.styled'
import { compact, isEqual, isNull } from 'lodash'
import { useMemo } from 'react'
import { InputText } from '../../Inputs/InputText'
import { Icon, IconType } from '../../Icon'
import { DefaultValueTemplate } from '.'
import TagsValueTemplate from './TagsValueTemplate'
import 'overlayscrollbars/overlayscrollbars.css'
import { createPortal } from 'react-dom'

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(refs: RefObject<HTMLElement>[], callback: () => void): void {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent): void {
      if (refs.every((ref) => ref.current && !ref.current.contains(event.target as Node))) {
        callback && callback()
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [refs, callback])
}

// types
export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  message?: string
  itemStyle?: CSSProperties
  valueStyle?: CSSProperties
  listStyle?: CSSProperties
  buttonStyle?: CSSProperties
  onOpen?: () => void
  onClose?: () => void
  value: Array<string | number>
  valueTemplate?:
    | ((
        value: (string | number)[],
        selected: (string | number)[],
        isOpen: boolean,
      ) => React.ReactNode)
    | 'tags'
  dataKey?: string
  labelKey?: string
  options: Array<any>
  itemTemplate?: (
    option: any,
    isActive: boolean,
    isSelected: boolean,
    index: number,
  ) => React.ReactNode
  align?: 'left' | 'right'
  multiSelect?: boolean
  multiSelectClose?: boolean
  search?: boolean
  disabled?: boolean
  valueIcon?: string
  emptyMessage?: string
  placeholder?: string
  isChanged?: boolean
  isMultiple?: boolean
  onChange?: (v: (string | number)[]) => void
  maxOptionsShown?: number
  style?: CSSProperties
  className?: string
  buttonClassName?: string
  itemClassName?: string
  valueClassName?: string
  listClassName?: string
  widthExpand?: boolean
  searchFields?: string[]
  minSelected?: number
  maxSelected?: number
  dropIcon?: IconType
  onClear?: () => void
  onClearNoValue?: boolean
  editable?: boolean
  maxHeight?: number
  disableReorder?: boolean
  disabledValues?: (string | number)[]
  listInline?: boolean
  disableOpen?: boolean
  openOnFocus?: boolean
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      value: initialValue = [],
      valueTemplate,
      valueStyle,
      listStyle,
      dataKey = 'value',
      labelKey = 'label',
      options = [],
      itemTemplate,
      itemStyle,
      buttonStyle,
      searchFields = ['value'],
      valueIcon,
      message,
      disabled,
      onClose,
      onChange,
      onOpen,
      widthExpand = true,
      align = 'left',
      multiSelect,
      multiSelectClose = false,
      isMultiple,
      search,
      placeholder = 'Select an option...',
      emptyMessage,
      isChanged,
      maxOptionsShown = 25,
      style,
      className,
      buttonClassName,
      itemClassName,
      valueClassName,
      listClassName,
      minSelected = 0,
      maxSelected,
      dropIcon = 'expand_more',
      onClear,
      onClearNoValue,
      editable,
      maxHeight = 300,
      disableReorder,
      disabledValues = [],
      listInline = false,
      disableOpen = false,
      openOnFocus = false,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState<(string | number)[]>([])

    useEffect(() => {
      setValue(compact(initialValue))
    }, [initialValue])

    // value = useMemo(() => compact(value), [value])

    // if there are multiple but multiSelect is false
    if (!multiSelect && value.length > 1) {
      isMultiple = true
    }

    const [isOpen, setIsOpen] = useState(false)
    // Style states
    const [pos, setPos] = useState<{
      left?: number | null
      right?: number | null
      y: number | null
    }>({ left: null, right: null, y: null })
    const [minWidth, setMinWidth] = useState(0)
    // search
    const [searchForm, setSearchForm] = useState('')
    // selection
    const [selected, setSelected] = useState<(string | number)[]>([])
    // keyboard states
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [usingKeyboard, setUsingKeyboard] = useState(false)

    const [maxShown, setMaxShown] = useState(maxOptionsShown)

    useEffect(() => {
      if (maxOptionsShown !== maxShown) {
        setMaxShown(maxOptionsShown)
      }
    }, [maxOptionsShown])

    // REFS
    const valueRef = useRef<HTMLButtonElement>(null)
    const optionsRef = useRef<HTMLUListElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    // const [optionsWidth, setOptionsWidth] = useState<null | number>(null)

    // USE EFFECTS
    // sets the correct position and height
    useEffect(() => {
      if (isOpen && valueRef.current) {
        const valueRec = valueRef.current.getBoundingClientRect()
        const valueWidth = valueRec.width - 2
        const valueHeight = valueRec.height

        const left = valueRec.x
        const right = window.innerWidth - valueRec.x - valueWidth
        let y = valueRec.y + (listInline ? 0 : valueHeight)

        // check it's not vertically off screen
        if (maxHeight + y + 20 > window.innerHeight) {
          y = window.innerHeight - maxHeight - 20
        }

        if (align === 'right') {
          setPos({ y, right, left: null })
        } else {
          // first set position
          setPos({ left, y, right: null })
        }

        if (widthExpand) setMinWidth(valueWidth)
      }
    }, [isOpen, valueRef, setMinWidth, setPos])

    // set initial selected from value
    useEffect(() => {
      setSelected(value)
    }, [value, setSelected])

    // keyboard support
    useEffect(() => {
      // focus element
      if (usingKeyboard) {
        const optionEl = optionsRef.current
        if (!optionEl) return
        const childNode = optionEl.childNodes[activeIndex || 0] as HTMLLIElement
        // scroll
        const parentHeight = optionEl.getBoundingClientRect().height || 0

        const childNodeRect = childNode?.getBoundingClientRect()
        const parentRect = optionEl.getBoundingClientRect()

        const childTop = childNodeRect?.top - (parentRect?.top || 0)
        const childBottom = childNodeRect?.bottom - (parentRect?.top || 0)

        if (childBottom > parentHeight + 1) {
          // scroll down
          optionEl.scrollTo(0, optionEl.scrollTop + (childBottom - parentHeight))
        } else if (childTop - 1 < 0) {
          // scroll up
          optionEl.scrollTo(0, optionEl.scrollTop + childTop - 1)
        }
      }
    }, [activeIndex, options, usingKeyboard, optionsRef])

    // if editable, merge current search into showOptions
    options = useMemo(() => {
      // add in any values that are not in options
      const selectedNotInOptions = value.filter((s) => !options.some((o) => o[dataKey] === s))
      const selectedNotInOptionsItems = selectedNotInOptions.map((s) => ({
        [labelKey]: s,
        [dataKey]: s,
      }))

      return [...selectedNotInOptionsItems, ...options]
    }, [value, options])

    // reorder options to put active at the top (if not disabled)
    options = useMemo(
      () =>
        disableReorder
          ? options
          : [...options].sort((a, b) => value.indexOf(b[dataKey]) - value.indexOf(a[dataKey])),
      [value, options],
    )

    // if editable, merge current search into showOptions
    options = useMemo(() => {
      if (editable) {
        const searchItem = {
          [labelKey]: searchForm ? `Add new "${searchForm}"` : 'Type to add new items...',
          [dataKey]: searchForm,
          icon: 'add',
          className: 'add-new',
        }

        return [searchItem, ...options]
      } else return options
    }, [editable, searchForm, options])

    const nonSearchedOptions = [...options]

    if ((search || editable) && searchForm) {
      // filter out search matches
      options = options.filter((o) =>
        searchFields.some(
          (key) => o[key] && String(o[key])?.toLowerCase()?.includes(searchForm.toLowerCase()),
        ),
      )
    }

    // HANDLERS

    const handleClose = (
      e?: React.MouseEvent<HTMLDivElement>,
      changeValue?: (string | number)[],
      outside?: boolean,
    ): void => {
      // changeValue is used on single select
      changeValue = changeValue || selected

      e?.stopPropagation()

      // close dropdown
      setIsOpen(false)

      // reset keyboard
      setActiveIndex(null)

      // callback
      onClose && onClose()

      // reset search
      setSearchForm('')

      // reset width
      setMinWidth(0)

      // check if value has changed
      const isSame = isEqual(changeValue, value)

      if (isSame) {
        // if not isMultiple,
        if (!isMultiple) return

        if (outside) return
      }

      // commit changes
      onChange && onChange(changeValue)
      setValue(changeValue)
      //   reset selected
      // setSelected([])

      // focus on value
      valueRef.current?.focus()
    }

    const formRef = useRef<HTMLDivElement>(null)
    useOutsideAlerter([formRef, valueRef], () => handleClose(undefined, undefined, true))

    const handleChange = (
      value: string | number,
      index: number,
      e?: React.MouseEvent<HTMLLIElement>,
    ): void => {
      e?.stopPropagation()
      e?.preventDefault()

      let newSelected = [...selected]

      const addingNew = editable && index === 0

      if (!multiSelect) {
        // replace current value with new one
        newSelected = [value]
      } else {
        if (!addingNew || searchForm) {
          // add/remove from selected
          if (newSelected.includes(value)) {
            if (newSelected.length > minSelected) {
              // remove
              newSelected.splice(newSelected.indexOf(value), 1)
            }
          } else {
            if (maxSelected && maxSelected > 0) {
              if (maxSelected === 1) {
                // replace
                newSelected = [value]
              }
              // check if max selected
              if (newSelected.length > maxSelected) {
                // do nothing
                return
              }
            } else {
              // add
              newSelected.push(value)
            }
          }
        }
      }

      if (addingNew) {
        // focus on search
        searchRef.current?.focus()
      }

      // update temp value
      // update state
      setSelected(newSelected)
      // if not multi or multiSelectClose then close
      if (!multiSelect || (addingNew && searchForm) || maxSelected === 1 || multiSelectClose) {
        setValue(newSelected)
        handleClose(undefined, newSelected)
      }
    }

    const handleClear = () => {
      if (!onClear) return

      if (selected.length > minSelected || onClearNoValue) {
        setSelected([])
        onClear()
        setIsOpen(false)
      }
    }

    const handleOpen = (
      e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>,
      focus?: boolean,
    ): void => {
      // check if onClear was clicked
      if ((e.target as HTMLDivElement).id === 'clear') {
        if (focus) return
        else return handleClear()
      }
      if (isOpen) {
        return handleClose()
      }

      if (disableOpen) return

      if (disabled) return
      e.stopPropagation()
      setIsOpen(!isOpen)

      onOpen && onOpen()
    }

    const handleOnFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      setTimeout(() => {
        if (openOnFocus && !isOpen) {
          handleOpen(e, true)
        }
      }, 100)
    }

    const handleSearchSubmit = (e: React.MouseEvent<HTMLDivElement>): void => {}

    // KEY BOARD CONTROL
    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
      // NAVIGATE DOWN
      if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
        let length = options.length
        if (activeIndex === null || activeIndex >= length - 1) {
          // got to top
          setActiveIndex(0)
        } else {
          // go down one
          setActiveIndex((isNull(activeIndex) ? -1 : activeIndex) + 1)
        }
      }

      // NAVIGATE UP
      if ((e.code === 'ArrowUp' || e.code === 'ArrowLeft') && activeIndex !== null) {
        if (activeIndex === 0) {
          // go to bottom
          setActiveIndex(options.length - 1)
        } else {
          // go one up
          setActiveIndex(activeIndex - 1)
        }
      }

      let selectedValue

      if (activeIndex !== null && options[activeIndex] && options[activeIndex][dataKey]) {
        selectedValue = options[activeIndex][dataKey]
      }

      if (
        e.code === 'ArrowDown' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight'
      ) {
        e.preventDefault()
        if (isOpen) {
          if (!usingKeyboard) setUsingKeyboard(true)
        } else if (!multiSelect && selectedValue) {
          // flick through options without opening
          onChange && onChange([selectedValue])
        }
      }

      // SUBMIT WITH ENTER
      if (
        e.code === 'Enter' ||
        e.code === 'Space' ||
        e.code === 'NumpadEnter' ||
        e.code === 'Tab'
      ) {
        // prevent reloads
        e.preventDefault()

        // open
        if (!isOpen) {
          // check not clear button
          if ((e.target as HTMLDivElement).id === 'clear') return onChange && onChange([])
          return setIsOpen(true)
        }

        if (multiSelect) {
          selectedValue && handleChange(selectedValue, activeIndex || 0)

          // nothing selected and only one option
          if (options.length === 1 || (options.length === 2 && editable)) {
            handleClose(undefined, [...selected, options[0][dataKey]])
          }
        } else {
          // convert selectedValue to array
          selectedValue = selectedValue ? [selectedValue] : null
          // only one option and no keyboard
          if (options.length === 1 && !editable) {
            selectedValue = [options[0][dataKey]]
          }

          if (editable && searchForm) {
            selectedValue = searchForm
          }

          if (!selectedValue) {
            // no value selected, then use what was already selected
            selectedValue = value
          }

          handleClose(undefined, selectedValue as (string | number)[])
          // focus back on button
          valueRef.current?.focus()
        }
      }

      // CLOSE WITH ESC or TAB
      if (e.code === 'Escape' || (e.code === 'Tab' && isOpen)) {
        if (e.code === 'Escape') {
          // focus back on button
          valueRef.current?.focus()
        }
        handleClose()
      }
    }

    const handleShowMore = () => {
      setMaxShown(maxShown + 50)
    }

    const labels = useMemo(() => {
      const values = isOpen ? selected : value
      let result: any[] = []
      nonSearchedOptions.forEach((o) => {
        if (values.includes(o[dataKey])) {
          result.push(o[labelKey] || o[dataKey])
        }
      })
      return result
    }, [options, value, dataKey, labelKey, selected, isOpen])

    const displayIcon = useMemo(() => {
      if (!value.length) return null
      if (valueIcon) return valueIcon
      if (multiSelect && value.length > 1) return null
      if (options.length && options[editable ? 1 : 0]) return options[editable ? 1 : 0].icon
      return null
    }, [valueIcon, multiSelect, options])

    // splice to maxOptionsShown or 25 items
    let showOptions = useMemo(
      () => (search || editable ? [...options].splice(0, maxShown) : options),
      [options, maxShown],
    )

    let hiddenLength = useMemo(() => options.length - showOptions.length, [options, showOptions])

    const DefaultValueTemplateProps = {
      value: isOpen ? selected : value,
      isMultiple,
      dropIcon,
      displayIcon,
      onClear: onClear ? handleClear : undefined,
      onClearNoValue,
      style: valueStyle,
      placeholder,
      isOpen,
      className: valueClassName,
    }

    // filter out valueTemplate
    const valueTemplateNode = useMemo(() => {
      if (typeof valueTemplate === 'function') return valueTemplate
      if (valueTemplate === 'tags')
        return () => <TagsValueTemplate {...DefaultValueTemplateProps} />
    }, [
      valueTemplate,
      value,
      isOpen,
      onClear,
      onClearNoValue,
      selected,
      handleClear,
      isMultiple,
      dropIcon,
    ])

    const isShowOptions = isOpen && options && (pos.y || pos.y === 0) && (!widthExpand || minWidth)
    return (
      <Styled.Dropdown
        onKeyDown={handleKeyPress}
        onMouseMove={() => usingKeyboard && setUsingKeyboard(false)}
        style={style}
        className={`dropdown ${className}`}
        ref={ref}
        {...props}
      >
        {value && (
          <Styled.Button
            ref={valueRef}
            onClick={handleOpen}
            disabled={disabled}
            $isChanged={!!isChanged}
            $isOpen={isOpen}
            style={buttonStyle}
            className={`button ${buttonClassName}`}
            onFocus={handleOnFocus}
          >
            {valueTemplateNode ? (
              valueTemplateNode(value, selected, isOpen)
            ) : (
              <DefaultValueTemplate {...DefaultValueTemplateProps}>
                {!labels.length && disabled && placeholder
                  ? placeholder
                  : labels.length
                  ? labels.join(', ')
                  : emptyMessage}
              </DefaultValueTemplate>
            )}
          </Styled.Button>
        )}

        {!!isShowOptions &&
          createPortal(
            <Styled.Container
              style={{
                left: pos?.left || 'unset',
                right: pos?.right || 'unset',
                top: pos?.y || 'unset',
                ...itemStyle,
              }}
              $message={message || ''}
              $isOpen={true}
              onSubmit={handleSearchSubmit}
              ref={formRef}
            >
              {(search || editable) && (
                <Styled.Search className="search">
                  <Icon icon={'search'} />
                  <InputText
                    value={searchForm}
                    onChange={(e) => setSearchForm(e.target.value)}
                    autoFocus
                    tabIndex={0}
                    ref={searchRef}
                    onKeyDown={(e) => e.code === 'Enter' && e.preventDefault()}
                  />
                </Styled.Search>
              )}
              <Styled.Scrollable
                style={{ maxHeight }}
                $message={message || ''}
                $search={!!search || !!editable}
                defer
              >
                <Styled.Options
                  style={{ minWidth, ...listStyle }}
                  className={'options'}
                  ref={optionsRef}
                >
                  {showOptions.map((option, i) => (
                    <Styled.ListItem
                      key={`${option[dataKey]}-${i}`}
                      onClick={(e) =>
                        !disabledValues.includes(option[dataKey]) &&
                        handleChange(option[dataKey], i, e)
                      }
                      $focused={usingKeyboard && activeIndex === i}
                      $usingKeyboard={usingKeyboard}
                      tabIndex={0}
                      className={`option ${listClassName}`}
                      $disabled={disabledValues.includes(option[dataKey])}
                    >
                      {itemTemplate ? (
                        itemTemplate(
                          option,
                          value.includes(option[dataKey]),
                          selected.includes(option[dataKey]),
                          i,
                        )
                      ) : (
                        <Styled.DefaultItem
                          $isSelected={selected.includes(option[dataKey])}
                          className={`option-child ${
                            value.includes(option[dataKey]) ? 'selected' : ''
                          } ${value.includes(option[dataKey]) ? 'active' : ''} ${itemClassName}`}
                          style={itemStyle}
                        >
                          {option.icon && <Icon icon={option.icon} />}
                          <span>{option[labelKey] || option[dataKey]}</span>
                        </Styled.DefaultItem>
                      )}
                    </Styled.ListItem>
                  ))}
                  {!!hiddenLength && (
                    <Styled.ListItem
                      onClick={handleShowMore}
                      $focused={false}
                      $usingKeyboard={false}
                      className="option"
                    >
                      <Styled.DefaultItem $isSelected={false} className="option-child hidden">
                        <span>{`Show ${50} more...`}</span>
                      </Styled.DefaultItem>
                    </Styled.ListItem>
                  )}
                </Styled.Options>
              </Styled.Scrollable>
            </Styled.Container>,
            document.body,
          )}
      </Styled.Dropdown>
    )
  },
)
