import { forwardRef, ReactNode, useMemo, useRef, useState } from 'react'
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

type OnSelectConfig = {
  confirm?: boolean
  restart?: boolean
  previous?: string // used to go back to the previous field along with restart
}

export interface SearchFilterDropdownProps {
  options: Option[]
  values: Filter[]
  parentId: string | null
  parentLabel?: string
  isCustomAllowed: boolean
  isHasValueAllowed?: boolean
  isNoValueAllowed?: boolean
  isInvertedAllowed?: boolean
  operatorChangeable?: boolean
  preserveOrderFields?: string[]
  operationsTemplate?: ReactNode
  onSelect: (option: Option, config?: OnSelectConfig) => void
  onInvert: (id: string) => void // invert the filter
  onOperatorChange?: (id: string, operator: FilterOperator) => void // change the operator
  onConfirmAndClose?: (filters: Filter[], config?: OnSelectConfig) => void // close the dropdown and update the filters
  onSwitchFilter?: (direction: 'left' | 'right') => void // switch to the next filter to edit
  pt?: {
    search?: React.HTMLAttributes<HTMLDivElement>
    item?: Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> & {
      onClick?: (event: React.MouseEvent<HTMLLIElement>) => boolean
    }
    hasSomeOption?: Partial<Option>
    hasNoOption?: Partial<Option>
  }
}

const SearchFilterDropdown = forwardRef<HTMLUListElement, SearchFilterDropdownProps>(
  (
    {
      options,
      values,
      parentId,
      parentLabel,
      isCustomAllowed,
      isHasValueAllowed,
      isNoValueAllowed,
      isInvertedAllowed,
      operatorChangeable,
      preserveOrderFields = [],
      operationsTemplate,
      onSelect,
      onInvert,
      onOperatorChange,
      onConfirmAndClose,
      onSwitchFilter,
      pt = { search: {}, item: {}, hasSomeOption: {}, hasNoOption: {} },
      ...props
    },
    ref,
  ) => {
    const parentFilter = values.find((filter) => filter.id === parentId)

    const searchRef = useRef<HTMLInputElement>(null)
    const [search, setSearch] = useState('')

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

      const target = event.target as HTMLElement
      const id = target.closest('li')?.id

      // get option by id
      const option = allOptions.find((option) => option.id === id)

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

      const closeOptions =
        ((option.id === 'hasValue' || option.id === 'noValue') && values.length === 0) ||
        option.searchOnly

      onSelect(option, {
        confirm: closeOptions,
        restart: closeOptions,
      })
      // clear search
      setSearch('')
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

        const target = event.target as HTMLElement
        const id = target.closest('li')?.id
        if (!id) return
        const option = allOptions.find((option) => option.id === id)
        const isSelected = getIsValueSelected(id, parentId, values)

        if (id === 'search') {
          if (!parentId) {
            handleAddGlobalSearchTextFilter()
          } else {
            handleAddCustomSearchForFilter()
          }
        } else if (option && !isSelected) {
          if (!isSelected) setSearch('')
          onSelect(option, { confirm: !isSelected, restart: event.shiftKey })
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
        const target = event.target as HTMLElement
        const id = target.closest('li')?.id
        const option = allOptions.find((option) => option.id === id)
        if (!option) return console.error('Option not found:', id)
        onSelect(option, { confirm: false })
      }

      // up arrow
      else if (event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()
        const target = event.target as HTMLElement
        const prev = target.previousElementSibling as HTMLElement
        // if the previous element is the search input, focus the input
        if (prev?.classList.contains('search')) {
          const input = prev.querySelector('input') as HTMLElement
          input.focus()
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
        // continue search by focusing the search input
        searchRef.current?.focus()
        // update the search value
        setSearch((prev) => (event.key === 'Backspace' ? prev.slice(0, -1) : prev + event.key))
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

    const handleAddCustomSearchForFilter = (restart?: boolean) => {
      const addedOption = getAddOption(search, parentId, isCustomAllowed)
      if (!addedOption) return console.error('Option not found:', search)

      // add the first option
      onSelect(addedOption, { confirm: true, restart: restart })
      // clear search
      setSearch('')
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

      // clear the search
      setSearch('')

      onConfirmAndClose &&
        onConfirmAndClose([...values, newFilter], { restart: restart, confirm: true })
    }

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // enter will select the first option
      if (event.key === 'Enter') {
        event.preventDefault()
        event.stopPropagation()

        const cmdCtrl = event.metaKey || event.ctrlKey
        if (search && (filteredOptions.filter((o) => o.id !== 'search').length === 0 || cmdCtrl)) {
          if (parentId) {
            handleAddCustomSearchForFilter()
          } else {
            // if the root field search has no results (not including search), add the custom value as text
            handleAddGlobalSearchTextFilter(event.shiftKey)
          }
        } else {
          // otherwise, add the first option
          const firstOption = filteredOptions[0]
          if (firstOption) {
            // clear search
            setSearch('')
            // select first option
            onSelect(firstOption, { confirm: true, restart: false })
          }
        }
      }
      // arrow down will focus the first option
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopPropagation()
        const target = event.target as HTMLElement
        let next = target.parentElement?.nextElementSibling as HTMLElement
        if (target.tagName === 'INPUT' && search) next = next.nextElementSibling as HTMLElement
        next?.focus()
      }
    }

    return (
      <Styled.OptionsContainer onKeyDown={handleKeyDown} {...props}>
        <Styled.Scrollable>
          <Styled.OptionsList ref={ref} className={clsx({ searching: !!search })}>
            <Styled.SearchContainer {...pt.search} className={clsx('search', pt.search?.className)}>
              <Styled.SearchInput
                ref={searchRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={getSearchPlaceholder(isCustomAllowed, allOptions)}
                autoFocus
              />
              <Styled.SearchIcon icon={'search'} />
            </Styled.SearchContainer>
            {filteredOptions.map(
              ({
                id,
                parentId,
                label,
                searchLabel,
                icon,
                img,
                color,
                isCustom,
                contentBefore,
                contentAfter,
              }) => {
                const isSelected = getIsValueSelected(id, parentId, values)
                const adjustedColor = color ? checkColorBrightness(color, '#1C2026') : undefined
                return (
                  <Styled.Item
                    key={id}
                    id={id}
                    tabIndex={0}
                    className={clsx({ selected: isSelected })}
                    {...pt.item}
                    onClick={(event) => handleSelectOption(event)}
                  >
                    {icon && <Icon icon={icon as IconType} style={{ color: adjustedColor }} />}
                    {img && <img src={img} alt={label} />}
                    {contentBefore && contentBefore}
                    <span className="label" style={{ color: adjustedColor }}>
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

const getFilteredOptions = (options: Option[], search: string, isCustomAllowed: boolean) => {
  // filter out options that don't match the search in any of the fields

  // no search? return all the main options
  if (!search) return options.filter((option) => !option.searchOnly)

  const parsedSearch = search.toLowerCase()

  const matched = matchSorter(options, parsedSearch, {
    keys: ['label'],
    threshold: matchSorter.rankings.CONTAINS,
  })

  // if isCustomAllowed, add the custom value to the list
  if (isCustomAllowed) {
    matched.push({
      id: 'search',
      label: search,
      icon: 'search',
      values: [],
      parentId: SEARCH_FILTER_ID,
      isCustom: true,
      searchOnly: true,
    })
  }

  return matched
}

const getSearchPlaceholder = (isCustomAllowed: boolean, options: Option[]) => {
  const somePreMadeOptions = options.length > 0 && options.some((option) => !option.isCustom)

  return !somePreMadeOptions && isCustomAllowed
    ? 'Search...'
    : isCustomAllowed
    ? 'Search or filter...'
    : 'Filter...'
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
