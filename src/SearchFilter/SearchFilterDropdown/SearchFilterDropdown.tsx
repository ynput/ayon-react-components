import { forwardRef, ReactNode, useImperativeHandle, useMemo, useRef } from 'react'
import { Filter, FilterOperator, Option } from '../types'
import * as Styled from './SearchFilterDropdown.styled'
import clsx from 'clsx'
import { matchSorter } from 'match-sorter'
import checkColorBrightness from '../checkColorBrightness'
import { buildFilterId } from '../buildFilterId'
import { getFilterFromId } from '../getFilterFromId'
import { Icon, IconType } from '../../Icon'
import { Button } from '../../Buttons/Button'
import { Spacer } from '../../Layout/Spacer'
import { ShortcutTag } from '../../ShortcutTag'
import { SwitchButton } from '../../Buttons/SwitchButton/SwitchButton'
import { SEARCH_FILTER_ID } from '../constants'
import { getFilteredOptions } from '../getFilteredOptions'

export type OnSelectConfig = {
  confirm?: boolean
  restart?: boolean
  addAnother?: boolean // commit custom value and stay in panel to add another
  previous?: string // used to go back to the previous field along with restart
  meta?: boolean // cmd/meta key was held
  ctrl?: boolean // ctrl key was held
  shift?: boolean // shift key was held
  keyboard?: boolean // selection triggered by keyboard (not mouse click)
  selectOnly?: boolean // toggle selection without closing the dropdown (e.g. spacebar)
}

export interface SearchFilterDropdownRef {
  // commit pending custom search text on click-outside; returns true if it stored a filter (and closed)
  commitSearch: (addAnother?: boolean) => boolean
  // programmatically select the option at the given filteredOptions index with optional modifier keys
  selectAtIndex: (
    index: number,
    modifiers?: { meta?: boolean; ctrl?: boolean; shift?: boolean; selectOnly?: boolean },
  ) => boolean
}

export interface SearchFilterDropdownProps {
  options: Option[]
  values: Filter[]
  parentId: string | null
  parentLabel?: string
  search: string
  searchInputRef?: React.RefObject<HTMLInputElement>
  listRef?: React.RefObject<HTMLUListElement>
  isCustomAllowed: boolean
  isHasValueAllowed?: boolean
  isNoValueAllowed?: boolean
  isInvertedAllowed?: boolean
  operatorChangeable?: boolean
  isCompact?: boolean
  preserveOrderFields?: string[]
  operationsTemplate?: ReactNode
  onSelect: (option: Option, config?: OnSelectConfig) => void
  onInvert: (id: string) => void // invert the filter
  onOperatorChange?: (id: string, operator: FilterOperator) => void // change the operator
  onConfirmAndClose?: (filters: Filter[], config?: OnSelectConfig) => void // close the dropdown and update the filters
  onSwitchFilter?: (direction: 'left' | 'right') => void // switch to the next filter to edit
  // index of the currently highlighted option (managed as React state in SearchFilter)
  highlightedIndex?: number | null
  pt?: {
    search?: React.HTMLAttributes<HTMLDivElement>
    item?: Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> & {
      onClick?: (event: React.MouseEvent<HTMLLIElement>) => boolean
    }
    hasSomeOption?: Partial<Option>
    hasNoOption?: Partial<Option>
  }
}

const SearchFilterDropdown = forwardRef<SearchFilterDropdownRef, SearchFilterDropdownProps>(
  (
    {
      options,
      values,
      parentId,
      parentLabel,
      search,
      searchInputRef,
      listRef,
      isCustomAllowed,
      isHasValueAllowed,
      isNoValueAllowed,
      isInvertedAllowed,
      operatorChangeable,
      isCompact,
      preserveOrderFields = [],
      operationsTemplate,
      onSelect,
      onInvert,
      onOperatorChange,
      onConfirmAndClose,
      onSwitchFilter,
      highlightedIndex,
      pt = { search: {}, item: {}, hasSomeOption: {}, hasNoOption: {} },
      ...props
    },
    ref,
  ) => {
    const parentFilter = values.find((filter) => filter.id === parentId)

    // focus the active typing input: chip input when in inline-edit mode, else the bar input
    const focusSearch = () => searchInputRef?.current?.focus()

    // sort options based on selected, skipping certain fields
    const sortedOptions = useMemo(() => {
      // if the option has an icon, it is most likely an enum and do not sort
      const anyIcons = options.some((option) => option.icon)

      // should we sort?
      if (!parentId || preserveOrderFields.includes(parentId) || anyIcons) return options

      const selectedOptions = options.filter((option) => {
        const isSelected = getIsValueSelected(option.id, parentId, values)
        return isSelected
      })
      const unselectedOptions = options.filter((option) => {
        const isSelected = getIsValueSelected(option.id, parentId, values)
        return !isSelected
      })
      return [...selectedOptions, ...unselectedOptions]
    }, [options])

    // add any extra options
    const allOptions = useMemo(() => {
      let optionsList = [...sortedOptions]
      if (parentId && isHasValueAllowed) {
        optionsList = [
          {
            id: 'hasValue',
            label: `Has ${parentLabel}`,
            parentId,
            values: [],
            icon: 'check',
            ...pt.hasSomeOption,
          },
          ...optionsList,
        ]
      }
      if (parentId && isNoValueAllowed) {
        optionsList = [
          {
            id: 'noValue',
            label: `No ${parentLabel}`,
            parentId,
            values: [],
            icon: 'unpublished',
            ...pt.hasNoOption,
          },
          ...optionsList,
        ]
      }
      return optionsList
    }, [sortedOptions, parentId, parentLabel, isHasValueAllowed, isNoValueAllowed])

    // filter options based on search
    const filteredOptions = useMemo(
      () => getFilteredOptions(allOptions, search, isCustomAllowed),
      [allOptions, search],
    )

    const getOptionFromEventTarget = (target: EventTarget | null, optionsList: Option[]) => {
      const li = (target as HTMLElement | null)?.closest('li')
      const id = li?.id ?? null
      const parentId = li?.getAttribute('data-parent') ?? null
      const option = id
        ? optionsList.find((item) => item.id === id && (!parentId || item.parentId === parentId)) ??
          optionsList.find((item) => item.id === id)
        : undefined

      return { id, parentId, option }
    }

    const handleSelectOption = (event: React.MouseEvent<HTMLElement>) => {
      // check if there is a custom onClick event
      if (!!pt.item?.onClick) {
        const result = pt.item.onClick(
          event as unknown as React.MouseEvent<HTMLLIElement, MouseEvent>,
        )
        // do not continue if the event was prevented
        if (result === false) return
      }

      event.preventDefault()
      event.stopPropagation()

      const { id, option } = getOptionFromEventTarget(event.target, allOptions)

      if (!option) {
        // check it's not a search
        if (id === 'search') {
          if (!parentId) {
            handleAddGlobalSearchTextFilter(event.shiftKey)
          } else {
            handleAddCustomSearchForFilter()
          }

          return
        } else {
          return console.error('Option not found:', id)
        }
      }

      onSelect(option, {
        meta: event.metaKey,
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        keyboard: false,
      })
    }

    const handleBack = (previousField?: string) => {
      // remove the parentId value if the filter has no values
      const newValues = values.filter(
        (filter) => !(filter.id === parentId && !filter.values?.length),
      )

      onConfirmAndClose && onConfirmAndClose(newValues, { restart: true, previous: previousField })
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      // check we are not focused on the search input
      const target = event.target as HTMLElement
      const isSearchInput = target.closest('input')
      if (isSearchInput) return

      // enter always confirms the filter
      // if the item is already selected, then we just confirm and close
      // if the item is not selected, we select it and confirm
      if (event.key === 'Enter') {
        event.preventDefault()
        event.stopPropagation()

        const { id, option } = getOptionFromEventTarget(event.target, allOptions)
        if (!id) return
        const isSelected = getIsValueSelected(id, parentId, values)

        if (id === 'search') {
          if (!parentId) {
            handleAddGlobalSearchTextFilter()
          } else {
            handleAddCustomSearchForFilter()
          }
        } else if (option && !isSelected) {
          onSelect(option, {
            keyboard: true,
            shift: event.shiftKey,
          })
        } else {
          //  shift + enter will confirm but keep the dropdown open
          //  any other enter will confirm and close dropdown
          onConfirmAndClose && onConfirmAndClose(values, { restart: event.shiftKey })
        }
      }
      // space selected the filter item
      else if (event.key === ' ') {
        event.preventDefault()
        event.stopPropagation()
        const { id, option } = getOptionFromEventTarget(event.target, allOptions)
        if (!option) return console.error('Option not found:', id)
        onSelect(option, { confirm: false })
      }

      // up arrow
      else if (event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()
        const target = event.target as HTMLElement
        const prev = target.previousElementSibling as HTMLElement
        // no previous option -> jump back up to the active search input
        if (!prev || prev.classList.contains('search')) {
          focusSearch()
        } else {
          prev?.focus()
        }
      }
      // down arrow
      else if (event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopPropagation()
        const target = event.target as HTMLElement
        const next = target.nextElementSibling as HTMLElement
        next?.focus()
      }
      // arrow left or right
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        event.stopPropagation()
        // trigger event to switch to next filter to edit, logic in parent
        onSwitchFilter && onSwitchFilter(event.key === 'ArrowRight' ? 'right' : 'left')
      } else if (event.key.match(/^[a-zA-Z0-9]$/) || event.key === 'Backspace') {
        event.preventDefault()
        event.stopPropagation()
        // continue search by focusing the active search input
        focusSearch()
      }

      // back key
      if (event.key === 'Backspace' && !search) {
        event.preventDefault()
        event.stopPropagation()

        if (!parentFilter?.values?.length && parentId) {
          const previousField = getFilterFromId(parentId)
          handleBack(previousField)
        }
      }
    }

    const handleAddCustomSearchForFilter = (addAnother?: boolean) => {
      const addedOption = getAddOption(search, parentId, isCustomAllowed)
      if (!addedOption) return console.error('Option not found:', search)

      // add the first option
      onSelect(addedOption, { confirm: true, addAnother: addAnother })
    }

    const handleAddGlobalSearchTextFilter = (restart?: boolean) => {
      // check we can add global search filters
      if (!(!parentId && isCustomAllowed))
        return console.error('Global search filters are not allowed')

      const newId = buildFilterId(SEARCH_FILTER_ID)

      const newFilter: Filter = {
        id: newId,
        label: '',
        values: [{ id: search, label: search, parentId: newId }],
      }

      onConfirmAndClose &&
        onConfirmAndClose([...values, newFilter], { restart: restart, confirm: true })
    }

    useImperativeHandle(ref, () => ({
      commitSearch: (addAnother?: boolean) => {
        const trimmed = search.trim()
        if (!trimmed || !isCustomAllowed) return false
        // inside a value panel: store as a custom value for the current filter
        if (parentId) {
          handleAddCustomSearchForFilter(addAnother)
          return true
        }
        // at root: store as global search
        handleAddGlobalSearchTextFilter()
        return true
      },
      selectAtIndex: (index, mods) => {
        const option = filteredOptions[index]
        if (!option) return false
        if (option.id === 'search') return false // handled by commitSearch
        onSelect(option, {
          keyboard: !mods?.selectOnly,
          shift: mods?.shift,
          meta: mods?.meta,
          ctrl: mods?.ctrl,
          selectOnly: mods?.selectOnly,
        })
        return true
      },
    }))

    return (
      <Styled.OptionsContainer
        onKeyDown={handleKeyDown}
        className={clsx({ compact: isCompact })}
        {...props}
      >
        <Styled.Scrollable>
          <Styled.OptionsList ref={listRef} className={clsx({ searching: !!search })}>
            {filteredOptions.map(
              (
                {
                  id,
                  parentId,
                  label,
                  searchLabel,
                  icon,
                  img,
                  color,
                  pt: optionPt,
                  isCustom,
                  contentBefore,
                  contentAfter,
                },
                optionIndex,
              ) => {
                const isSelected = getIsValueSelected(id, parentId, values)
                const isHighlighted = highlightedIndex === optionIndex
                const adjustedColor = color ? checkColorBrightness(color, '#1C2026') : undefined
                return (
                  <Styled.Item
                    key={id + '-' + parentId}
                    id={id}
                    data-parent={parentId}
                    tabIndex={0}
                    className={clsx({ selected: isSelected, highlighted: isHighlighted })}
                    {...pt.item}
                    onClick={(event) => handleSelectOption(event)}
                  >
                    {icon && <Icon icon={icon as IconType} style={{ color: adjustedColor }} />}
                    {img && <img src={img} alt={label} />}
                    {contentBefore && contentBefore}
                    <span
                      className="label"
                      style={{ color: optionPt?.style?.color ?? adjustedColor }}
                    >
                      {search && searchLabel ? searchLabel : label}
                    </span>
                    {!!contentAfter && contentAfter}
                    {isSelected && <Icon icon="check" className="check" />}
                    {!isSelected &&
                      search &&
                      isCustom &&
                      !parentFilter?.id.includes(SEARCH_FILTER_ID) && (
                        <ShortcutTag className="search">
                          {window.navigator.userAgent.toLowerCase().includes('mac')
                            ? 'Cmd'
                            : 'Ctrl'}
                          +Enter ↵
                        </ShortcutTag>
                      )}
                  </Styled.Item>
                )
              },
            )}
            {filteredOptions.length === 0 && !isCustomAllowed && <span>No filters found</span>}
            {parentId && (
              <Styled.Toolbar className="toolbar">
                <Button variant="text" onClick={() => handleBack()} icon="arrow_back">
                  Back
                </Button>
                <Spacer />
                <Styled.Operations className="operations">
                  {!!operationsTemplate ? (
                    operationsTemplate
                  ) : (
                    <>
                      {isInvertedAllowed && (
                        <SwitchButton
                          label="Excludes"
                          value={!!parentFilter?.inverted}
                          onClick={() => onInvert(parentId)}
                          variant="primary"
                        />
                      )}
                      {operatorChangeable && (
                        <SwitchButton
                          label="Match all"
                          value={parentFilter?.operator === 'AND'}
                          onClick={() => {
                            onOperatorChange &&
                              onOperatorChange(
                                parentId,
                                parentFilter?.operator === 'AND' ? 'OR' : 'AND',
                              )
                          }}
                          variant="primary"
                        />
                      )}
                    </>
                  )}
                </Styled.Operations>
                {isCustomAllowed && search.trim() && (
                  <Button
                    variant="text"
                    onClick={() => handleAddCustomSearchForFilter(true)}
                    icon="add"
                    shortcut={{ children: '⇧+↵' }}
                  >
                    Add more
                  </Button>
                )}
                <Button
                  variant="filled"
                  onClick={() => {
                    onConfirmAndClose && onConfirmAndClose(values)
                  }}
                  icon="check"
                >
                  Confirm
                </Button>
              </Styled.Toolbar>
            )}
          </Styled.OptionsList>
        </Styled.Scrollable>
      </Styled.OptionsContainer>
    )
  },
)

export default SearchFilterDropdown

export const getIsValueSelected = (
  id: string,
  parentId?: string | null,
  values?: Filter[],
): boolean => {
  if (!parentId || !values) return false
  // find the parent filter
  const parentFilter = values.find((filter) => filter.id === parentId)
  if (!parentFilter) return false

  // check if the value is already selected
  return !!parentFilter.values?.some((value) => value.id === id)
}

const getAddOption = (
  search: string,
  parentId: string | null,
  isCustomAllowed?: boolean,
): Option | null => {
  if (!isCustomAllowed) return null
  // add custom value
  return { id: search, label: search, values: [], parentId, isCustom: true }
}
