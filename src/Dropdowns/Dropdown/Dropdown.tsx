import React, { CSSProperties, forwardRef, useEffect, RefObject, useImperativeHandle } from 'react'
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
import { matchSorter } from 'match-sorter'

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
  value: Array<string | number> | null
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
  onSelectionChange?: (v: (string | number)[]) => void
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
  onClear?: (value: []) => void
  onClearNull?: (value: null) => void
  nullPlaceholder?: string
  editable?: boolean
  maxHeight?: number
  disabledValues?: (string | number)[]
  listInline?: boolean
  disableOpen?: boolean
  sortBySelected?: boolean
}

export interface DropdownRef {
  getElement: () => HTMLDivElement | null
  getOptions: () => HTMLUListElement | null
  open: () => void
  close: () => void
}

export const Dropdown = forwardRef<DropdownRef, DropdownProps>(
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
      onSelectionChange,
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
      onClearNull,
      nullPlaceholder,
      editable,
      maxHeight = 300,
      disabledValues = [],
      listInline = false,
      disableOpen = false,
      sortBySelected = false,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState<(string | number)[] | null>([])

    useEffect(() => {
      // set null if null otherwise compact array (array with no nulls or undefine)
      setValue(initialValue === null ? null : compact(initialValue))
    }, [initialValue])

    // value = useMemo(() => compact(value), [value])

    // if there are multiple but multiSelect is false
    if (!multiSelect && value && value.length > 1) {
      isMultiple = true
    }

    const [isOpen, setIsOpen] = useState(false)
    // Style states
    const [pos, setPos] = useState<{
      left?: number | null
      right?: number | null
      y: number | null
    }>({ left: null, right: null, y: null })
    // if the dropdown is vertically off screen
    const [offScreen, setOffScreen] = useState(false)

    const [minWidth, setMinWidth] = useState(0)
    // search
    const [searchForm, setSearchForm] = useState('')
    // selection
    const [selected, setSelected] = useState<(string | number)[] | null>([])
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
    const elementRef = useRef<HTMLDivElement>(null)
    const valueRef = useRef<HTMLButtonElement>(null)
    const optionsRef = useRef<HTMLUListElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLDivElement>(null)

    // const [optionsWidth, setOptionsWidth] = useState<null | number>(null)

    // USE EFFECTS
    // sets the correct position and height
    useEffect(() => {
      if (isOpen && valueRef.current && formRef.current) {
        const valueRec = valueRef.current.getBoundingClientRect()
        // -2 for border
        const valueWidth = valueRec.width - 2
        const valueHeight = valueRec.height

        const optionsRec = formRef.current.getBoundingClientRect()
        const optionsHeight = optionsRec.height

        const left = valueRec.x
        const right = window.innerWidth - valueRec.x - valueWidth
        let y = valueRec.y + (listInline ? 0 : valueHeight)

        // check it's not vertically off screen
        // in CSS we transformY by -100%
        if (optionsHeight + y + 10 > window.innerHeight) {
          y = valueRec.y
          setOffScreen(true)
        }

        if (align === 'right') {
          setPos({ y, right, left: null })
        } else {
          // first set position
          setPos({ left, y, right: null })
        }

        if (widthExpand) setMinWidth(valueWidth)
      }
    }, [isOpen, valueRef, formRef, setMinWidth, setPos])

    // set initial selected from value
    useEffect(() => {
      setSelected(value)
    }, [value, setSelected])

    // keyboard support
    useEffect(() => {
      // focus element
      if (usingKeyboard) {
        const optionEl = optionsRef.current
        const parentEl = optionEl?.parentElement
        if (!parentEl || !optionEl) return
        const childNode = optionEl.childNodes[activeIndex || 0] as HTMLLIElement
        // scroll
        const parentHeight = parentEl.getBoundingClientRect().height || 0

        const childNodeRect = childNode?.getBoundingClientRect()
        const parentRect = parentEl.getBoundingClientRect()

        const childTop = childNodeRect?.top - (parentRect?.top || 0)
        const childBottom = childNodeRect?.bottom - (parentRect?.top || 0)

        if (childBottom > parentHeight + 1) {
          // scroll down
          parentEl.scrollTo(0, parentEl.scrollTop + (childBottom - parentHeight))
        } else if (childTop - 1 < 0) {
          // scroll up
          parentEl.scrollTo(0, parentEl.scrollTop + childTop - 1)
        }
      }
    }, [activeIndex, options, usingKeyboard, optionsRef])

    // if editable, merge current search into showOptions
    options = useMemo(() => {
      // add in any values that are not in options
      const selectedNotInOptions =
        value?.filter((s) => !options.some((o) => o[dataKey] === s)) || []
      const selectedNotInOptionsItems = selectedNotInOptions.map((s) => ({
        [labelKey]: s,
        [dataKey]: s,
      }))

      return [...selectedNotInOptionsItems, ...options]
    }, [value, options])

    // reorder options to put active at the top (if not disabled)
    options = useMemo(
      () =>
        !sortBySelected || !value || !value.length
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
      options = matchSorter(options, searchForm, { keys: searchFields })
    }

    // HANDLERS

    const handleClose = (
      e?: React.MouseEvent<HTMLDivElement>,
      changeValue?: (string | number)[] | null,
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
      onChange && changeValue && onChange(changeValue)
      setValue(changeValue)
      //   reset selected
      // setSelected([])

      // focus on value
      valueRef.current?.focus()
    }

    useOutsideAlerter([formRef, valueRef], () => handleClose(undefined, undefined, true))

    const handleChange = (
      value: string | number,
      index: number,
      e?: React.MouseEvent<HTMLLIElement>,
    ): void => {
      e?.stopPropagation()
      e?.preventDefault()

      let newSelected = selected ? [...selected] : []

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

      // send on selection changed event
      onSelectionChange && onSelectionChange(newSelected)

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

      setSelected([])
      onClear([])
      setIsOpen(false)
    }
    const handleClearNull = () => {
      if (!onClearNull) return

      setSelected([])
      onClearNull(null)
      setIsOpen(false)
    }

    const handleOpen = (
      e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>,
      focus?: boolean,
    ): void => {
      // check if onClear was clicked
      if ((e.target as HTMLDivElement).id === 'clear') {
        if (focus) return
        else return handleClear()
      } else if ((e.target as HTMLDivElement).id === 'backspace') {
        if (focus) return
        else return handleClearNull()
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
        // check we are not searching and pressing space
        if (e.code === 'Space' && search) return

        // prevent reloads
        if (e.code !== 'Tab') e.preventDefault()

        // if closed and pressing tab, ignore and focus next item (default)
        if (!isOpen && e.code === 'Tab') return

        // open
        if (!isOpen) {
          // check not clear button
          if ((e.target as HTMLDivElement).id === 'clear') {
            return handleClear()
          } else if ((e.target as HTMLDivElement).id === 'backspace') {
            return handleClearNull()
          }
          return setIsOpen(true)
        }

        if (multiSelect) {
          if (selectedValue) return handleChange(selectedValue, activeIndex || 0)

          let selectedValues = [options[0][dataKey]]
          // if editable, split by comma
          if (editable && searchForm) {
            selectedValues = searchForm.split(',').map((s) => s.trim())
          }

          // filter out already selected
          selectedValues = selectedValues.filter((s) => !selected?.includes(s))

          // nothing selected take first option
          if (options.length === 1 || editable) {
            const newSelected = [...(selected || []), ...selectedValues]
            handleClose(undefined, newSelected, ...selectedValues)
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

        // stop default tab behavior
        e.preventDefault()
        e.stopPropagation()
        handleClose()
      }
    }

    const handleShowMore = () => {
      setMaxShown(maxShown + 50)
    }

    const labels = useMemo(() => {
      const values = isOpen ? selected : value || []
      let result: any[] = []
      nonSearchedOptions.forEach((o) => {
        if (values?.includes(o[dataKey])) {
          result.push(o[labelKey] || o[dataKey])
        }
      })
      return result
    }, [options, value, dataKey, labelKey, selected, isOpen])

    const displayIcon = useMemo(() => {
      if (!value?.length) return null
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
      onClear: onClear && handleClear,
      onClearNull: onClearNull && handleClearNull,
      nullPlaceholder,
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
      onClearNull,
      selected,
      handleClear,
      isMultiple,
      dropIcon,
    ])

    // attach the refs to the ref
    useImperativeHandle(
      ref,
      () => ({
        getElement: () => elementRef.current,
        getOptions: () => optionsRef.current,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }),
      [elementRef, valueRef, optionsRef, searchRef],
    )

    const isShowOptions = isOpen && options && (pos.y || pos.y === 0) && (!widthExpand || minWidth)
    return (
      <Styled.Dropdown
        onKeyDown={handleKeyPress}
        onMouseMove={() => usingKeyboard && setUsingKeyboard(false)}
        style={style}
        className={`dropdown ${className}`}
        ref={elementRef}
        {...props}
      >
        <Styled.Button
          ref={valueRef}
          onClick={handleOpen}
          disabled={disabled}
          $isChanged={!!isChanged}
          $isOpen={isOpen}
          style={buttonStyle}
          className={`button ${buttonClassName}`}
        >
          {valueTemplateNode ? (
            valueTemplateNode(value || [], selected || [], isOpen)
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

        {isOpen &&
          createPortal(
            <Styled.Container
              style={{
                opacity: isShowOptions ? 1 : 0,
                left: pos?.left || 'unset',
                right: pos?.right || 'unset',
                top: pos?.y || 'unset',
                translate: offScreen ? '0 -100%' : 'none',
                transformOrigin: offScreen ? 'center bottom' : 'center top',
                ...itemStyle,
              }}
              $message={message || ''}
              $isOpen={true}
              $hidden={!isShowOptions}
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
                          !!value && value.includes(option[dataKey]),
                          !!selected?.includes(option[dataKey]),
                          i,
                        )
                      ) : (
                        <Styled.DefaultItem
                          $isSelected={!!selected?.includes(option[dataKey])}
                          className={`option-child ${
                            value && value.includes(option[dataKey]) ? 'selected' : ''
                          } ${
                            value && value.includes(option[dataKey]) ? 'active' : ''
                          } ${itemClassName}`}
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
