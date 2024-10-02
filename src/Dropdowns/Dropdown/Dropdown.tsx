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
import clsx from 'clsx'

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
  messageOverButton?: boolean
  error?: string | null | false
  missingValueMessage?: string | null | undefined
  itemStyle?: CSSProperties
  valueStyle?: CSSProperties
  listStyle?: CSSProperties
  buttonStyle?: CSSProperties
  onOpen?: () => void
  onClose?: () => void
  value: Array<string> | null
  valueTemplate?:
    | ((value: string[], selected: string[], isOpen: boolean) => React.ReactNode)
    | 'tags'
  dataKey?: string
  labelKey?: string
  options: Array<any>
  itemTemplate?: (
    option: any,
    isActive: boolean,
    isSelected: boolean,
    index: number,
    mixedSelected: string[],
  ) => React.ReactNode
  align?: 'left' | 'right'
  multiSelect?: boolean
  multiSelectClose?: boolean
  search?: boolean
  searchOnNumber?: number
  disabled?: boolean
  valueIcon?: string
  emptyMessage?: string
  placeholder?: string
  isChanged?: boolean
  isMultiple?: boolean
  multipleOverride?: boolean
  onChange?: (added: string[], removed: string[]) => void
  onSelectionChange?: (added: string[], removed: string[]) => void
  onAddItem?: (v: string) => void
  onRemoveItem?: (v: string) => void
  maxOptionsShown?: number
  style?: CSSProperties
  className?: string
  buttonClassName?: string
  itemClassName?: string
  valueClassName?: string
  listClassName?: string
  widthExpand?: boolean // expand to width of button
  widthExpandMax?: boolean // does not expand past button width
  searchFields?: string[]
  minSelected?: number
  maxSelected?: number
  dropIcon?: IconType
  onClear?: (value: []) => void
  clearTooltip?: string
  onClearNull?: (value: null) => void
  clearNullTooltip?: string
  nullPlaceholder?: string
  editable?: boolean
  maxHeight?: number
  disabledValues?: string[]
  listInline?: boolean
  disableOpen?: boolean
  sortBySelected?: boolean
  onSelectAll?: ((value: string[]) => void) | boolean | null
  selectAllKey?: string | null
  buttonProps?: Styled.ButtonType['defaultProps']
  activateKeys?: string[]
  startContent?: (value: string[], selected: string[], isOpen: boolean) => React.ReactNode
  editor?: boolean
}

export interface DropdownRef {
  getElement: () => HTMLDivElement | null
  getOptions: () => HTMLUListElement | null
  open: () => void
  close: (save?: boolean) => void
  toggle: () => void
  isOpen: boolean
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
      messageOverButton,
      error,
      missingValueMessage = 'Some values no longer exist',
      disabled,
      onClose,
      onChange,
      onSelectionChange,
      onRemoveItem,
      onAddItem,
      onOpen,
      widthExpand = true,
      widthExpandMax = false,
      align = 'left',
      multiSelect,
      multiSelectClose = false,
      isMultiple,
      multipleOverride = true,
      search,
      searchOnNumber = 20,
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
      clearTooltip = 'Clear to no value',
      onClearNull,
      clearNullTooltip = 'Clear to empty list',
      nullPlaceholder,
      editable,
      maxHeight = 300,
      disabledValues = [],
      listInline = false,
      disableOpen = false,
      sortBySelected = false,
      onSelectAll,
      selectAllKey = '__all__',
      buttonProps,
      activateKeys = ['Enter', 'Space', 'NumpadEnter', 'Tab'],
      startContent,
      editor,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState<string[] | null>([])

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
    const [selected, setSelected] = useState<string[]>([])
    // mixed selection, is it selected by at least one item
    const [mixedSelected, setMixedSelected] = useState<string[]>([])
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

    // const [optionsWidth, setOptionsWidth] = useState<null >(null)

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

    // scroll to first selected item
    useEffect(() => {
      if (!isOpen) return

      // find first selected item
      const firstSelectedElement = optionsRef.current?.querySelector('.selected')
      if (!firstSelectedElement) return

      // get parent li item
      const parentLi = firstSelectedElement.parentElement as HTMLLIElement
      if (!parentLi) return

      // scroll to selected item
      parentLi.scrollIntoView({ block: 'center' })

      if (!parentLi.parentElement?.children) return
      // find index of selected item
      const index = Array.from(parentLi.parentElement?.children).indexOf(parentLi)

      setActiveIndex(index)
    }, [isOpen, setActiveIndex, optionsRef])

    // set initial selected from value
    useEffect(() => {
      if (isMultiple && !multipleOverride) {
        setMixedSelected(value || [])
        setSelected([])
      } else {
        setMixedSelected([])
        setSelected(value || [])
      }
    }, [value, setSelected, multipleOverride, isMultiple])

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

    // select all only works with multiSelect
    const showSelectAll = onSelectAll && multiSelect
    // are all options selected
    const isAllSelected = useMemo(() => value && value.length >= options.length, [value, options])

    const getMissingOptions = () => {
      const values = Array.from(new Set([...selected, ...mixedSelected]))
      // add in any values that are not in options
      return values?.filter((s) => !!s && !options.some((o) => o[dataKey] === s)) || []
    }

    const missing = getMissingOptions()
    const missingOptions: {
      [key: string]: string
      error: string
    }[] = []
    if (editable) {
      // add missing options to options
      options = options.concat(
        missing.map((s) => ({
          [labelKey]: s,
          [dataKey]: s,
        })),
      )
    } else {
      // add error to missing options
      missing.map((s) => ({
        [labelKey]: s,
        [dataKey]: s,
        error: 'Value no longer exists',
      }))
    }

    const hasMissingOptions = missingOptions.length > 0

    // has error controls the closed error state styles
    if (hasMissingOptions && error === undefined) {
      error = missingValueMessage
    }

    // reorder options to put active at the top (if not disabled)
    options = useMemo(
      () =>
        (!sortBySelected && !(isMultiple && !multipleOverride)) || !value || !value.length
          ? options
          : [...options].sort((a, b) => value.indexOf(b[dataKey]) - value.indexOf(a[dataKey])),
      [value, options],
    )

    // if onSelectAll, add to options
    options = useMemo(() => {
      if (showSelectAll) {
        return [
          { [labelKey]: isAllSelected ? 'Deselect All' : 'Select All', [dataKey]: selectAllKey },
          ...options,
        ]
      }
      return options
    }, [isAllSelected, showSelectAll, options])

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

    // if number of options is over 20 and search is not false or null, turn search on
    if (search === undefined && searchOnNumber !== undefined) {
      search = options.length > searchOnNumber
    }

    if ((search || editable) && searchForm) {
      // filter out search matches
      options = matchSorter(options, searchForm, { keys: searchFields })
    }

    // HANDLERS

    const handleClose = (
      e?: React.MouseEvent<HTMLDivElement>,
      changeValue?: string[] | null,
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

      // find items that have been removed (difference between mixedSelected and value)
      const removed = value?.filter((s) => !mixedSelected.includes(s)) || []

      // commit changes
      onChange && changeValue && onChange(changeValue, removed)
      setValue(changeValue)
      //   reset selected
      // setSelected([])

      // focus on value
      valueRef.current?.focus()
    }

    useOutsideAlerter([formRef, valueRef], () => handleClose(undefined, undefined, true))

    const submitChange = (selected: string[], close?: boolean) => {
      // find items that have been removed (difference between mixedSelected and value)
      const removed = value?.filter((s) => !mixedSelected.includes(s)) || []
      // send on selection changed event
      onSelectionChange && onSelectionChange(selected, removed)

      // update temp value
      // update state
      setSelected(selected)

      if (close) {
        setValue(selected)
        handleClose(undefined, selected)
      }
    }

    const handleChange = (
      value: string,
      index: number,
      e?: React.MouseEvent<HTMLLIElement>,
    ): void => {
      e?.stopPropagation()
      e?.preventDefault()

      if (!multipleOverride) {
        if ((e?.target as HTMLDivElement).classList.contains('remove')) {
          // if onRemoveItem is true then check if close icon was clicked
          if (onRemoveItem) {
            onRemoveItem(value)
            // remove from mixed selected
            setMixedSelected(mixedSelected?.filter((s) => s !== value))
            // show there be a change event?
            // only if the item was selected in the first place
            if (!selected?.includes(value)) {
              // the value was never in the selected list so no change
              return
            }
          }
        }
      }

      // selecting all just sets __all__ value and that's it
      // check selectAll is active
      if (selectAllKey === value && onSelectAll) {
        if (isAllSelected) {
          // deselect all
          submitChange([], false)
          return
        }

        // select all values from options
        const allSelected = options
          .map((o) => o[dataKey])
          .filter((o) => !disabledValues.includes(o))
          .filter((o) => o !== selectAllKey)

        submitChange(allSelected, multiSelectClose)

        if (typeof onSelectAll === 'function') onSelectAll(allSelected)
        return
      }

      let newSelected = selected ? [...selected] : []

      if (onSelectAll && selectAllKey && newSelected.includes(selectAllKey)) {
        // selecting an actual value, remove selectAll
        newSelected = newSelected.filter((s) => s !== selectAllKey)
      }

      // are we clicking the add new item option
      const addingNew = editable && index === 0

      if (!multiSelect) {
        // replace current value with new one
        newSelected = [value]
      } else {
        if (!addingNew || searchForm) {
          // add or remove from selected
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
              onAddItem && onAddItem(value)
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

      // if not multi or multiSelectClose then close
      const close =
        !multiSelect || (addingNew && searchForm) || maxSelected === 1 || multiSelectClose

      submitChange(newSelected, !!close)
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

    // validate next index is not disabled
    const validateNextIndex = (index: number, down: boolean): number | undefined => {
      const isValid = (i: number) =>
        !options[i]?.disabled && !disabledValues.includes(options[i][dataKey])

      if (isValid(index)) return index

      const step = down ? 1 : -1
      for (let i = index + step; i >= 0 && i < options.length; i += step) {
        if (isValid(i)) return i
      }
    }

    // KEY BOARD CONTROL
    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
      let newIndex: undefined | number = undefined
      // NAVIGATE DOWN
      if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
        let length = options.length
        if (activeIndex === null || activeIndex >= length - 1) {
          // got to top
          newIndex = validateNextIndex(0, true)
        } else {
          // go down one
          newIndex = validateNextIndex((isNull(activeIndex) ? -1 : activeIndex) + 1, true)
        }
      }

      // NAVIGATE UP
      if ((e.code === 'ArrowUp' || e.code === 'ArrowLeft') && activeIndex !== null) {
        if (activeIndex === 0) {
          // go to bottom
          newIndex = validateNextIndex(options.length - 1, false)
        } else {
          // go one up
          newIndex = validateNextIndex(activeIndex - 1, false)
        }
      }

      if (newIndex !== undefined) {
        setActiveIndex(newIndex)
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
          onChange && onChange([selectedValue], [])
        }
      }

      // SUBMIT WITH ENTER
      if (activateKeys.includes(e.code)) {
        // check we are not searching and pressing space
        if (e.code === 'Space' && search) return

        // prevent reloads
        if (e.code !== 'Tab') e.preventDefault()

        // if closed and pressing tab, ignore and focus next item (default)
        if (e.code === 'Tab') {
          if (!isOpen) return
        }

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
          if (selectedValue && e.code !== 'Tab')
            return handleChange(selectedValue, activeIndex || 0)

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

          handleClose(undefined, selectedValue as string[])
          // focus back on button
          valueRef.current?.focus()
        }
      } else if (e.code === 'Space') {
        // prevent space from opening dropdown if it's not in activateKeys
        e.preventDefault()
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
      const values = isOpen && (!isMultiple || multipleOverride) ? selected : value || []
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
      value: isOpen && (!isMultiple || multipleOverride) ? selected : value,
      isMultiple,
      dropIcon,
      displayIcon,
      onClear: onClear && handleClear,
      clearTooltip,
      onClearNull: onClearNull && handleClearNull,
      clearNullTooltip,
      nullPlaceholder,
      style: valueStyle,
      placeholder,
      isOpen,
      className: valueClassName,
      hasError: !!error,
    }

    // filter out valueTemplate
    const valueTemplateNode = useMemo(() => {
      if (typeof valueTemplate === 'function') return valueTemplate
      if (valueTemplate === 'tags')
        return () => <TagsValueTemplate {...DefaultValueTemplateProps} editor={editor} />
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
        close: (save) => (save ? handleClose() : setIsOpen(false)),
        toggle: () => setIsOpen(!isOpen),
        isOpen,
      }),
      [elementRef, valueRef, optionsRef, searchRef, isOpen, handleClose, selected],
    )

    const isShowOptions = isOpen && options && (pos.y || pos.y === 0) && (!widthExpand || minWidth)

    let valueChildren
    if (!labels.length && disabled && placeholder) {
      valueChildren = placeholder
    } else if (onSelectAll && selectAllKey && value?.includes(selectAllKey)) {
      valueChildren = 'All selected'
    } else if (labels.length) {
      valueChildren = labels.join(', ')
    } else {
      valueChildren = emptyMessage
    }

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
          {...buttonProps}
          style={buttonStyle}
          className={`button ${buttonClassName}`}
        >
          {valueTemplateNode && valueTemplateNode(value || [], selected || [], isOpen) ? (
            valueTemplateNode(value || [], selected || [], isOpen)
          ) : (
            <DefaultValueTemplate {...DefaultValueTemplateProps}>
              {valueChildren}
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
              $messageOverButton={messageOverButton}
              $error={error || ''}
              $isOpen={true}
              $hidden={!isShowOptions}
              onSubmit={handleSearchSubmit}
              ref={formRef}
              className={'container'}
            >
              {startContent && (
                <Styled.StartContent>
                  {startContent(value || [], selected || [], isOpen)}
                </Styled.StartContent>
              )}
              {(search || editable) && (
                <Styled.Search className={clsx('search', { startContent: !!startContent })}>
                  <Icon icon={'search'} />
                  <InputText
                    value={searchForm}
                    onChange={(e) => setSearchForm(e.target.value)}
                    autoFocus
                    tabIndex={0}
                    ref={searchRef}
                    onKeyDown={(e) => e.code === 'Enter' && e.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Styled.Search>
              )}
              <Styled.Scrollable
                style={{ maxHeight }}
                className={clsx({
                  ['no-top-radius']: (messageOverButton && !!message) || !!search || !!editable,
                })}
                defer
              >
                <Styled.Options
                  style={{ minWidth, maxWidth: widthExpandMax ? minWidth : 'unset', ...listStyle }}
                  className={clsx('options', { usingKeyboard })}
                  ref={optionsRef}
                >
                  {[...missingOptions, ...showOptions].map((option, i) => (
                    <Styled.ListItem
                      key={`${option[dataKey]}-${i}`}
                      onClick={(e) =>
                        !option.disabled &&
                        !disabledValues.includes(option[dataKey]) &&
                        handleChange(option[dataKey], i, e)
                      }
                      $usingKeyboard={usingKeyboard}
                      tabIndex={0}
                      className={clsx('option', listClassName, {
                        disabled: option.disabled || disabledValues.includes(option[dataKey]),
                        focused: usingKeyboard && activeIndex === i,
                      })}
                      data-value={option[dataKey]}
                    >
                      {itemTemplate ? (
                        itemTemplate(
                          option,
                          !!value && value.includes(option[dataKey]),
                          !!selected?.includes(option[dataKey]),
                          i,
                          mixedSelected,
                        )
                      ) : (
                        <Styled.DefaultItem
                          className={clsx('option-child', itemClassName, {
                            selected: !!selected?.includes(option[dataKey]),
                            active: value && value.includes(option[dataKey]),
                            error: !!option.error,
                          })}
                          style={itemStyle}
                        >
                          {option.icon && <Icon icon={option.icon} />}
                          <span>{option[labelKey] || option[dataKey]}</span>
                          {multiSelect &&
                            [...selected, ...mixedSelected]?.includes(option[dataKey]) &&
                            selected.length > minSelected && (
                              <Icon icon={'close'} className="remove" />
                            )}
                        </Styled.DefaultItem>
                      )}
                    </Styled.ListItem>
                  ))}
                  {!!hiddenLength && (
                    <Styled.ListItem
                      onClick={handleShowMore}
                      $usingKeyboard={false}
                      className={clsx('option', listClassName, {
                        focused: false,
                      })}
                    >
                      <Styled.DefaultItem className="option-child hidden">
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
