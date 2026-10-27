import React, {
  CSSProperties,
  forwardRef,
  useEffect,
  RefObject,
  useId,
  useImperativeHandle,
} from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import * as Styled from './Dropdown.styled'
import { compact, isEqual, isNull } from 'lodash-es'
import { useMemo } from 'react'
import { InputText } from '../../Inputs/InputText'
import { Icon, IconType } from '../../Icon'
import { DefaultValueItem, DefaultValueTemplate, DefaultItemTemplate, DefaultItemStyled } from '.'
import TagsValueTemplate from './TagsValueTemplate'
import 'overlayscrollbars/overlayscrollbars.css'
import { createPortal } from 'react-dom'
import { matchSorter } from 'match-sorter'
import clsx from 'clsx'
import { InputSwitch } from '../../Inputs/InputSwitch'
import {
  getMixedChange,
  getMixedState,
  toggleMixedValue,
  type MixedChange,
  type MixedEdits,
  type MixedState,
} from './mixedValues'

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

type OnChangeEvent = React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>

export type ValueIconMode = 'none' | 'single' | 'all' | 'multiple'

// edits an option outside the dropdown, e.g. in a dialog, and resolves once it is saved or cancelled.
// A new option resolves with its value (undefined when cancelled), which is then selected
export type EditOptionHandler = (option: any, isNew: boolean) => Promise<string | void> | void

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
  valueIconMode?: ValueIconMode
  emptyMessage?: string
  placeholder?: string
  isChanged?: boolean
  isMultiple?: boolean
  multipleOverride?: boolean
  onChange?: (added: string[], removed: string[], e?: OnChangeEvent) => void
  onSelectionChange?: (added: string[], removed: string[], e?: OnChangeEvent) => void
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
  // multiSelect: show a checkbox on each option
  checkboxes?: boolean
  // editing several items at once (more than one): how many of the items have each value. Every
  // value is then added to, removed from or left as it is on each item, see mixedValues.ts
  mixedCounts?: Record<string, number>
  mixedTotal?: number
  // what the items are called, e.g. "tasks"
  mixedLabel?: string
  // called on close instead of onChange when editing several items
  onMixedChange?: (change: MixedChange) => void
  // an edit button on each option; the "add new" option creates one with it, with the search as
  // its value. The dropdown stays open meanwhile
  onEditOption?: EditOptionHandler
  editOptionTooltip?: string | ((option: any) => string)
  pt?: {
    button?: Partial<React.HTMLAttributes<HTMLButtonElement>>
    list?: Partial<React.HTMLAttributes<HTMLUListElement>>
    container?: Partial<React.HTMLAttributes<HTMLDivElement>>
  }
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
      searchFields = ['value', 'label'],
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
      valueIconMode = 'none',
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
      checkboxes,
      mixedCounts,
      mixedTotal = 0,
      mixedLabel = 'items',
      onMixedChange,
      onEditOption,
      editOptionTooltip,
      pt,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState<string[] | null>([])

    useEffect(() => {
      // set null if null otherwise compact array (array with no nulls or undefine)
      const newValue = initialValue === null ? null : compact(initialValue)
      // a new array with the same values (e.g. value={v.map(String)}) would reset the selection,
      // which a re-render while the dropdown is open, like saving an edited option, must not do
      setValue((current) => (isEqual(current, newValue) ? current : newValue))
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
    // editing several items at once, see mixedValues.ts
    const isMixed = !!multiSelect && !!mixedCounts && mixedTotal > 1
    const [mixedEdits, setMixedEdits] = useState<MixedEdits>({})
    const [replaceAll, setReplaceAll] = useState(false)
    // the older mixed mode (isMultiple without multipleOverride) keeps its remove icons
    const isLegacyMixed = !isMixed && !!isMultiple && !multipleOverride
    const showCheckboxes = !!multiSelect && (!!checkboxes || isMixed) && !isLegacyMixed
    const getOptionState = (optionValue: string): MixedState => {
      if (isMixed) {
        return getMixedState(optionValue, mixedCounts, mixedTotal, mixedEdits, replaceAll)
      }
      return selected.includes(optionValue) ? 'all' : 'none'
    }
    // the option being edited outside the dropdown, see onEditOption
    const [editing, setEditing] = useState<{ value: string; isNew: boolean } | null>(null)
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

    // a closed dropdown starts without changes
    useEffect(() => {
      if (isOpen) return
      setMixedEdits({})
      setReplaceAll(false)
    }, [isOpen])

    // select all only works with multiSelect
    const showSelectAll = onSelectAll && multiSelect && !isMixed
    // are all options selected
    const isAllSelected = useMemo(() => value && value.length >= options.length, [value, options])

    const getMissingOptions = () => {
      const values = Array.from(
        new Set([
          ...selected,
          ...mixedSelected,
          ...(isMixed ? [...Object.keys(mixedCounts), ...Object.keys(mixedEdits)] : []),
        ]),
      )
      // add in any values that are not in options
      return values?.filter((s) => !!s && !options.some((o) => o[dataKey] === s)) || []
    }

    const missing = getMissingOptions()
    const missingOptions: {
      [key: string]: string
      error: string
    }[] = []
    // every value the items have is listed when editing several, so none is changed unseen
    if (editable || isMixed) {
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
    // selected and unselected options both keep the order of `options` (sort is stable)
    options = useMemo(() => {
      if ((!sortBySelected && !(isMultiple && !multipleOverride)) || !value || !value.length)
        return options
      const selected = new Set(value)
      return [...options].sort(
        (a, b) => Number(selected.has(b[dataKey])) - Number(selected.has(a[dataKey])),
      )
    }, [value, options, sortBySelected, isMultiple, multipleOverride, dataKey])

    // if onSelectAll, add to options
    options = useMemo(() => {
      if (showSelectAll) {
        return [
          { [labelKey]: isAllSelected ? 'Deselect All' : 'Select All', [dataKey]: selectAllKey },
          ...options,
        ]
      }
      return options
    }, [isAllSelected, showSelectAll, options, labelKey, dataKey, selectAllKey])

    // if editable, merge current search into showOptions
    options = useMemo(() => {
      if (editable) {
        const searchItem = {
          [labelKey]: searchForm
            ? `Add new "${searchForm}"`
            : onEditOption
            ? 'Add new...'
            : 'Type to add new items...',
          [dataKey]: searchForm,
          icon: 'add',
          className: 'add-new',
        }

        return [searchItem, ...options]
      } else return options
    }, [editable, searchForm, options, labelKey, dataKey])

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

    const handleClose = (changeValue?: string[] | null, outside?: boolean): void => {
      // changeValue is used on single select
      changeValue = changeValue || selected

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

      if (isMixed) {
        const change = getMixedChange(mixedCounts, mixedTotal, mixedEdits, replaceAll)
        if (change.add.length || change.remove.length) onMixedChange?.(change)
        valueRef.current?.focus()
        return
      }

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

    // clicks in the editor (a dialog, outside the dropdown) don't close it
    useOutsideAlerter([formRef, valueRef], () => !editing && handleClose(undefined, true))

    // new values typed in the search go onto every item
    const addMixedValues = (newValues: string[]) => {
      const edits: MixedEdits = { ...mixedEdits }
      newValues.forEach((newValue) => (edits[newValue] = 'add'))
      setMixedEdits(edits)
      setSearchForm('')
    }

    const replaceAllId = useId()
    // values already checked or unchecked stay so, only the untouched ones follow the mode
    const toggleReplaceAll = () => setReplaceAll((replace) => !replace)

    const submitChange = (selected: string[], close?: boolean, e?: OnChangeEvent) => {
      // find items that have been removed (difference between mixedSelected and value)
      const removed = value?.filter((s) => !mixedSelected.includes(s)) || []
      // send on selection changed event
      onSelectionChange && onSelectionChange(selected, removed, e)

      // update temp value
      // update state
      setSelected(selected)

      if (close) {
        setValue(selected)
        handleClose(selected)
      }
    }

    // selects a value created in the editor, keeping the dropdown open
    const selectNewValue = (newValue: string) => {
      setSearchForm('')
      if (isMixed) {
        setMixedEdits((edits) => ({ ...edits, [newValue]: 'add' }))
        return
      }
      if (!multiSelect || maxSelected === 1) return submitChange([newValue])
      if (selected.includes(newValue)) return
      if (maxSelected && selected.length >= maxSelected) return
      onAddItem?.(newValue)
      submitChange([...selected, newValue])
    }

    // a value created in the editor, selected on the next render so it sees the current selection
    const [createdValue, setCreatedValue] = useState<string | null>(null)
    useEffect(() => {
      if (createdValue === null) return
      setCreatedValue(null)
      if (isOpen) selectNewValue(createdValue)
    }, [createdValue])

    const handleEditOption = async (option: any, isNew: boolean, e?: React.SyntheticEvent) => {
      // the edit button is in the option, which would select it
      e?.stopPropagation()
      e?.preventDefault()
      if (!onEditOption || editing) return
      setEditing({ value: option[dataKey], isNew })
      try {
        const newValue = await onEditOption(option, isNew)
        if (isNew && newValue) setCreatedValue(newValue)
      } finally {
        setEditing(null)
        searchRef.current?.focus()
      }
    }

    // the "add new" option opens the editor for a new option, the search as its value
    const isCreatingInEditor = !!onEditOption && !!editable
    const createInEditor = (e?: React.SyntheticEvent) =>
      handleEditOption({ [dataKey]: searchForm, [labelKey]: searchForm }, true, e)

    const getEditOptionTooltip = (option: any) => {
      if (typeof editOptionTooltip === 'function') return editOptionTooltip(option)
      return editOptionTooltip || 'Edit'
    }

    const handleChange = (
      value: string,
      index: number,
      e?: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLDivElement>,
    ): void => {
      e?.stopPropagation()
      e?.preventDefault()

      const option = options[index]
      if (option?.disabled || disabledValues.includes(value)) {
        return
      }

      if (isCreatingInEditor && index === 0) {
        createInEditor()
        return
      }

      if (isMixed) {
        // the first option adds the searched value to every item
        if (editable && index === 0) {
          if (searchForm) addMixedValues([searchForm])
          searchRef.current?.focus()
          return
        }
        setMixedEdits(toggleMixedValue(value, mixedCounts, mixedTotal, mixedEdits, replaceAll))
        return
      }

      if (!multipleOverride) {
        if ((e?.target as HTMLDivElement).classList.contains('remove')) {
          onRemoveItem?.(value)
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

      // selecting all just sets __all__ value and that's it
      // check selectAll is active
      if (selectAllKey === value && onSelectAll) {
        if (isAllSelected) {
          // deselect all
          submitChange([], false, e)
          return
        }

        // select all values from options
        const allSelected = options
          .filter(
            (o) =>
              !o.disabled && !disabledValues.includes(o[dataKey]) && o[dataKey] !== selectAllKey,
          )
          .map((o) => o[dataKey])

        submitChange(allSelected, multiSelectClose, e)

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

      submitChange(newSelected, !!close, e)
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
          onChange && onChange([selectedValue], [], e)
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
            return handleChange(selectedValue, activeIndex || 0, e)

          if (isCreatingInEditor && searchForm && e.code !== 'Tab') return createInEditor(e)

          if (isMixed && e.code !== 'Tab') {
            if (editable && searchForm) {
              return addMixedValues(
                searchForm
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            return handleClose()
          }

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
            handleClose(newSelected, ...selectedValues)
          }
        } else {
          // convert selectedValue to array
          selectedValue = selectedValue ? [selectedValue] : null
          // only one option and no keyboard
          if (options.length === 1 && !editable) {
            selectedValue = [options[0][dataKey]]
          }

          if (isCreatingInEditor && searchForm && e.code !== 'Tab') return createInEditor(e)

          if (editable && searchForm) {
            selectedValue = searchForm
          }

          if (!selectedValue) {
            // no value selected, then use what was already selected
            selectedValue = value
          }

          handleClose(selectedValue as string[])
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

        // stop default tab behavior when closing
        if (isOpen) {
          e.preventDefault()
          e.stopPropagation()
        }
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
    }, [options, value, dataKey, labelKey, selected, isOpen, isMultiple, multipleOverride])

    const displayValues = isOpen && (!isMultiple || multipleOverride) ? selected : value || []
    const displayIcons = useMemo(() => {
      if (valueIcon) return [valueIcon]
      if (valueIconMode === 'none') return []
      if (valueIconMode === 'single' && displayValues.length !== 1) return []
      if (valueIconMode === 'multiple' && displayValues.length < 2) return []

      return displayValues
        .map(
          (displayValue) =>
            nonSearchedOptions.find((option) => option[dataKey] === displayValue)?.icon,
        )
        .filter((icon): icon is string => !!icon)
    }, [valueIcon, valueIconMode, displayValues, nonSearchedOptions, dataKey])
    const displayItems = useMemo<DefaultValueItem[] | undefined>(() => {
      if ((valueIconMode !== 'all' && valueIconMode !== 'multiple') || valueIcon) return undefined

      return displayValues.map((displayValue) => {
        const option = nonSearchedOptions.find((item) => item[dataKey] === displayValue)
        const icon = option?.icon
        const showIcon = valueIconMode !== 'multiple' || displayValues.length > 1
        const hasIcon = showIcon && !!icon

        return {
          icon: hasIcon ? icon : undefined,
          label: option?.[labelKey] || displayValue,
          showLabel: !hasIcon || valueIconMode !== 'multiple',
        }
      })
    }, [valueIconMode, valueIcon, displayValues, nonSearchedOptions, dataKey, labelKey])
    const showValue =
      valueIconMode !== 'multiple' ||
      displayValues.length < 2 ||
      displayIcons.length < displayValues.length

    // splice to maxOptionsShown or 25 items
    let showOptions = useMemo(
      () => (search || editable ? [...options].splice(0, maxShown) : options),
      [options, maxShown, search, editable],
    )

    let hiddenLength = useMemo(() => options.length - showOptions.length, [options, showOptions])

    const DefaultValueTemplateProps = {
      value: isOpen && (!isMultiple || multipleOverride) ? selected : value,
      isMultiple,
      dropIcon,
      displayIcons,
      displayItems,
      showValue,
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
      multipleOverride,
      displayIcons,
      displayItems,
      showValue,
      valueIconMode,
      clearTooltip,
      handleClearNull,
      clearNullTooltip,
      nullPlaceholder,
      valueStyle,
      placeholder,
      valueClassName,
      error,
    ])

    // attach the refs to the ref
    useImperativeHandle(
      ref,
      () => ({
        getElement: () => elementRef.current,
        getOptions: () => optionsRef.current,
        getSearch: () => searchRef.current,
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

    const renderCheckbox = (state: MixedState) => (
      <Icon
        icon={
          state === 'all'
            ? 'check_box'
            : state === 'some'
            ? 'indeterminate_check_box'
            : 'check_box_outline_blank'
        }
        filled={state !== 'none'}
        className={clsx('checkbox-icon', state)}
      />
    )

    const getOptionLabel = (optionValue: string): string => {
      const option = nonSearchedOptions.find((o) => o[dataKey] === optionValue)
      return option?.[labelKey] || optionValue
    }

    // how many items have the value, or how many the change adds it to or removes it from
    const renderMixedCount = (optionValue: string) => {
      if (!isMixed) return null
      const count = mixedCounts[optionValue] || 0
      const state = getOptionState(optionValue)
      if (state === 'all' && count < mixedTotal) {
        const added = mixedTotal - count
        return (
          <span
            className="mixed-count adding"
            data-tooltip={`Add to ${added} of ${mixedTotal} ${mixedLabel}`}
          >
            +{added}
          </span>
        )
      }
      if (state === 'none' && count > 0) {
        return (
          <span
            className="mixed-count removing"
            data-tooltip={`Remove from ${count} of ${mixedTotal} ${mixedLabel}`}
          >
            −{count}
          </span>
        )
      }
      if (state === 'some') {
        return (
          <span className="mixed-count" data-tooltip={`On ${count} of ${mixedTotal} ${mixedLabel}`}>
            {count}/{mixedTotal}
          </span>
        )
      }
      return null
    }

    const mixedChange = isMixed
      ? getMixedChange(mixedCounts, mixedTotal, mixedEdits, replaceAll)
      : undefined
    const mixedSummary = mixedChange
      ? [
          mixedChange.add.length && `Add ${mixedChange.add.map(getOptionLabel).join(', ')}`,
          mixedChange.remove.length &&
            `Remove ${mixedChange.remove.map(getOptionLabel).join(', ')}`,
        ]
          .filter(Boolean)
          .join(' · ')
      : ''

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
          {...pt?.button}
          style={{ ...buttonStyle, ...pt?.button?.style }}
          className={clsx('button', buttonClassName, pt?.button?.className)}
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
              {...pt?.container}
              style={{
                opacity: isShowOptions ? 1 : 0,
                left: pos?.left || 'unset',
                right: pos?.right || 'unset',
                top: pos?.y || 'unset',
                translate: offScreen ? '0 -100%' : 'none',
                transformOrigin: offScreen ? 'center bottom' : 'center top',
                ...itemStyle,
                ...pt?.container?.style,
              }}
              $message={message || ''}
              $messageOverButton={messageOverButton}
              $error={error || ''}
              $isOpen={true}
              $hidden={!isShowOptions}
              onSubmit={handleSearchSubmit}
              ref={formRef}
              className={clsx('container', pt?.container?.className)}
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
                  ['no-bottom-radius']: isMixed,
                })}
                defer
              >
                <Styled.Options
                  {...pt?.list}
                  style={{
                    minWidth,
                    maxWidth: widthExpandMax ? minWidth : 'unset',
                    ...listStyle,
                    ...pt?.list?.style,
                  }}
                  className={clsx('options', { usingKeyboard }, pt?.list?.className)}
                  ref={optionsRef}
                >
                  {[...missingOptions, ...showOptions].map((option, i) => {
                    // the first option adds the searched value
                    const isAddNew = !!editable && i === 0
                    // the "add new" option opens the editor itself
                    const editableOption =
                      !!onEditOption &&
                      !isAddNew &&
                      !(showSelectAll && option[dataKey] === selectAllKey)
                    const isEditing =
                      !!editing &&
                      editing.isNew === isAddNew &&
                      (isAddNew || editing.value === option[dataKey])
                    return (
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
                          checkbox: showCheckboxes,
                          'add-new-option': isAddNew,
                          'has-edit': editableOption,
                          editing: isEditing,
                        })}
                        data-value={option[dataKey]}
                        data-tooltip={option.disabled ? option.disabledMessage : undefined}
                      >
                        {showCheckboxes &&
                          !(editable && i === 0) &&
                          renderCheckbox(
                            option[dataKey] === selectAllKey && showSelectAll
                              ? isAllSelected
                                ? 'all'
                                : 'none'
                              : getOptionState(option[dataKey]),
                          )}
                        {itemTemplate ? (
                          itemTemplate(
                            option,
                            !!value && value.includes(option[dataKey]),
                            !!selected?.includes(option[dataKey]),
                            i,
                            mixedSelected,
                          )
                        ) : (
                          <DefaultItemTemplate
                            option={option}
                            dataKey={dataKey}
                            labelKey={labelKey}
                            selected={selected}
                            mixedSelected={mixedSelected}
                            value={value}
                            multiSelect={multiSelect}
                            minSelected={minSelected}
                            itemClassName={itemClassName}
                            itemStyle={itemStyle}
                          />
                        )}
                        {isMixed && !(editable && i === 0) && renderMixedCount(option[dataKey])}
                        {editableOption && (
                          <Styled.EditOption
                            type="button"
                            className="edit-option"
                            icon="edit"
                            variant="text"
                            tabIndex={-1}
                            data-tooltip={getEditOptionTooltip(option)}
                            aria-label={getEditOptionTooltip(option)}
                            disabled={!!editing}
                            onClick={(e) => handleEditOption(option, false, e)}
                          />
                        )}
                      </Styled.ListItem>
                    )
                  })}
                  {!!hiddenLength && (
                    <Styled.ListItem
                      onClick={handleShowMore}
                      $usingKeyboard={false}
                      className={clsx('option', listClassName, {
                        focused: false,
                      })}
                    >
                      <DefaultItemStyled className="option-child hidden">
                        <span>{`Show ${50} more...`}</span>
                      </DefaultItemStyled>
                    </Styled.ListItem>
                  )}
                </Styled.Options>
              </Styled.Scrollable>
              {isMixed && (
                <Styled.MixedFooter className="mixed-footer">
                  {/* always shown, so the footer keeps its height and the switch stays put */}
                  <span className={clsx('summary', { empty: !mixedSummary })}>
                    {mixedSummary || 'No changes'}
                  </span>
                  <div className="row">
                    <span>
                      {mixedTotal} {mixedLabel} selected
                    </span>
                    {/* the switch has its own label, so the text labels it from beside it, not around it */}
                    <div className="replace">
                      <InputSwitch
                        id={replaceAllId}
                        compact
                        checked={replaceAll}
                        onChange={toggleReplaceAll}
                      />
                      <label htmlFor={replaceAllId}>Replace all</label>
                    </div>
                  </div>
                </Styled.MixedFooter>
              )}
            </Styled.Container>,
            document.body,
          )}
      </Styled.Dropdown>
    )
  },
)
