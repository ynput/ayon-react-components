import { useEffect, useMemo, useRef, useState, useImperativeHandle, forwardRef } from 'react'

import { Filter, FilterOperator, Option } from './types'
import * as Styled from './SearchFilter.styled'
import { SearchFilterItem, SearchFilterItemProps } from './SearchFilterItem'
import SearchFilterDropdown, {
  getIsValueSelected,
  SearchFilterDropdownProps,
  SearchFilterDropdownRef,
} from './SearchFilterDropdown/SearchFilterDropdown'
import { useCompactDisplay } from './hooks/useCompactDisplay'
import { buildFilterId } from './buildFilterId'
import { getFilterFromId } from './getFilterFromId'
import doesFilterExist from './doesFilterExist'
import { Icon, IconType } from '../Icon'
import clsx from 'clsx'
import { SEARCH_FILTER_ID } from './constants'

const sortSelectedToTopFields = ['assignee', 'taskType']

export interface SearchFilterQuickAction {
  id: string
  icon?: string
  label?: string
  tooltip?: string
  active?: boolean
}

export interface SearchFilterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  filters: Filter[]
  onChange: (filters: Filter[]) => void
  options: Option[]
  quickActions?: SearchFilterQuickAction[]
  onQuickAction?: (id: string) => void
  compact?: boolean // shrink the bar to 28px with smaller padding/text (left search icon stays normal)
  onFinish?: (filters: Filter[]) => void
  enableGlobalSearch?: boolean
  globalSearchConfig?: {
    enableMultiple?: boolean
  }
  enableSearchChildren?: boolean // when searching, children of the options will also be shown
  allowedSearchChildren?: string[] // when searching, only these children will be shown
  enableMultipleSameFilters?: boolean
  disabledFilters?: string[] // filters that should be disabled from adding, editing, or removing
  preserveOrderFields?: string[]
  pt?: {
    dropdown?: Partial<SearchFilterDropdownProps>
    item?: Partial<SearchFilterItemProps>
    searchBar?: React.HTMLAttributes<HTMLDivElement>
    backdrop?: React.HTMLAttributes<HTMLDivElement>
  }
}

export interface SearchFilterRef {
  open: () => void
  close: () => void
  openFilter: (optionId: string) => void
  getContainerElement: () => HTMLDivElement | null
  getFiltersBarElement: () => HTMLDivElement | null
}

export const SearchFilter = forwardRef<SearchFilterRef, SearchFilterProps>(
  (
    {
      filters = [],
      onChange,
      onFinish,
      options = [],
      quickActions,
      onQuickAction,
      compact = false,
      enableGlobalSearch = false,
      globalSearchConfig,
      enableSearchChildren = true,
      allowedSearchChildren = undefined,
      enableMultipleSameFilters = false,
      disabledFilters,
      preserveOrderFields,
      pt = {
        dropdown: {},
        item: {},
        searchBar: {},
        backdrop: {},
      },
      ...props
    },
    ref,
  ) => {
    const filtersBarRef = useRef<HTMLDivElement>(null)
    const filtersRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLUListElement>(null)
    const dropdownApiRef = useRef<SearchFilterDropdownRef>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const { enableMultiple: enableGlobalSearchMultiple } = globalSearchConfig || {}

    const [dropdownParentId, setDropdownParentId] = useState<null | string>(null)
    const [dropdownOptions, setOptions] = useState<Option[] | null>(null)
    const [search, setSearch] = useState('')
    // in-place editing of a search chip (typing directly in the chip)
    const [editingSearchChipId, setEditingSearchChipId] = useState<string | null>(null)
    const [editingSearchValue, setEditingSearchValue] = useState('')

    const parentOption = options.find(
      (option) => dropdownParentId && option.id === getFilterFromId(dropdownParentId),
    )

    const allOptions = useMemo(() => {
      if (!dropdownOptions) return null

      // if we don't want to show children, return the options
      if (!enableSearchChildren) return dropdownOptions

      // Use a for loop to process options in a single pass
      const flattenedOptions = []
      const addedItems = new Set() // Track added items to avoid duplicates

      for (const option of dropdownOptions) {
        if (
          (!allowedSearchChildren || allowedSearchChildren?.includes(option.id)) &&
          option.type !== 'boolean'
        ) {
          if (option.values && option.values.length > 0) {
            for (const value of option.values) {
              // sometimes value id can be the same but for a different parent so we need to create a unique id
              const fullId = `${option.id}-${value.id}`
              if (!addedItems.has(fullId)) {
                addedItems.add(fullId)
                flattenedOptions.push({
                  ...value,
                  parentId: option.id,
                  searchOnly: true,
                  searchLabel: `${option.label} - ${value.label}`,
                })
              }
            }
          }
        }
      }

      return [...dropdownOptions, ...flattenedOptions]
    }, [dropdownOptions, enableSearchChildren, allowedSearchChildren])

    // keep focus on the inline bar input when the dropdown opens at root level;
    // inside a filter's value panel the dropdown renders its own input instead
    useEffect(() => {
      if (dropdownOptions && !dropdownParentId) searchInputRef.current?.focus()
    }, [dropdownOptions?.map((o) => o.id).join('__'), dropdownParentId])

    const openOptions = (options: Option[], parentId: string | null) => {
      setOptions(options)
      setDropdownParentId(parentId)
    }

    type OpenInitialOptionsConfig = {
      hidable?: boolean
      filters?: Filter[]
    }

    const openInitialOptions = (e?: React.MouseEvent, config?: OpenInitialOptionsConfig) => {
      const { hidable = false, filters = [] } = config || {}
      e?.stopPropagation()
      if (dropdownOptions?.length && hidable) {
        // if it's already open, close it
        closeOptions()
      } else {
        // open the initial options
        openOptions(
          getShownRootOptions(options, filters, enableMultipleSameFilters, disabledFilters),
          null,
        )
      }
    }

    const closeOptions = () => {
      setOptions(null)
      setDropdownParentId(null)
    }

    const handleClose = (filters: Filter[]) => {
      // remove any filters that have no values
      const updatedFilters = filters.filter((filter) => filter.values && filter.values.length > 0)
      onChange(updatedFilters)

      // clear the inline search text and close the dropdown
      setSearch('')
      closeOptions()
      // call onClose if it exists
      onFinish && onFinish(updatedFilters)

      if (dropdownParentId) {
        // find filter element by the id and focus it
        document.getElementById(dropdownParentId)?.focus()
      } else {
        // focus last filter
        const filters = filtersRef.current?.querySelectorAll('.search-filter-item')
        const lastFilter = filters?.[filters.length - 1] as HTMLElement
        lastFilter?.focus()
      }
    }

    // Replace the compact display logic with the custom hook
    const showIconsOnly = useCompactDisplay({
      containerRef: filtersBarRef,
      contentRef: filtersRef,
      dependencies: [filters],
    })

    const handleOptionSelect: SearchFilterDropdownProps['onSelect'] = (option, config) => {
      const { values, parentId } = option

      // check if the filter already exists and if we allow multiple of the same filter
      if (!enableMultipleSameFilters && doesFilterExist(option.id, filters)) {
        console.warn(
          `Filter with id ${option.id} already exists. Enable enableMultipleSameFilters to allow multiple filters with the same id.`,
        )
        return
      }

      // create new id for the filter so we can add multiple of the same filter name
      const newId = buildFilterId(option.id)

      // boolean options without explicit values are one-click toggles: add
      // immediately with an "on" value and close, instead of opening a values panel
      if (!parentId && option.type === 'boolean' && !option.values?.length) {
        const addFilter: Filter = {
          ...option,
          id: newId,
          // value label = filter name so the compact chip (label hidden) reads the
          // filter name instead of "Yes"
          values: [{ id: 'true', label: option.label }],
        }
        delete (addFilter as Option).allowsCustomValues
        const updatedFilters = [...filters, addFilter]
        onChange(updatedFilters)
        handleClose(updatedFilters)
        return
      }

      // check if there is a parent id
      if (parentId) {
        // find the parent filter that's already in the filters
        // if the option is a searchOnly filter, it's parent is in the filters state. Find the parent from the options
        // Find or create parent filter based on option type
        let parentFilter: Filter | null | undefined = null
        if (option.searchOnly) {
          const parentOption = options.find((opt) => opt.id === option.parentId)
          if (parentOption) {
            parentFilter = {
              ...parentOption,
              id: buildFilterId(option.parentId || ''),
              values: [],
            }
          }
        } else {
          parentFilter = filters.find((filter) => filter.id === parentId)
        }

        // add to the parent filter values
        if (parentFilter) {
          const valueAlreadyExists = parentFilter.values?.some((val) => val.id === option.id)

          const singleSelect =
            parentFilter.singleSelect ||
            (parentFilter.id.includes(SEARCH_FILTER_ID) && !enableGlobalSearchMultiple)

          let updatedValues = singleSelect
            ? [option] // If replace is true, only add the new option
            : valueAlreadyExists && parentFilter.values
            ? // If the option already exists, remove it
              parentFilter.values.filter((val) => val.id !== option.id)
            : // Otherwise, add the new option to the values array
              [...(parentFilter.values || []), option]

          // if the option is hasValue or noValue, remove all other options
          if (option.id === 'hasValue' || option.id === 'noValue') {
            updatedValues = updatedValues.filter((val) => val.id === option.id)
          } else {
            // remove hasValue and noValue if a specific value is added
            updatedValues = updatedValues.filter(
              (val) => val.id !== 'hasValue' && val.id !== 'noValue',
            )
          }

          const operator = parentFilter.operator || 'OR'

          // Create a new parent filter with the updated values
          const updatedParentFilter = {
            ...parentFilter,
            operator,
            values: updatedValues,
          }

          // Update the filters array by replacing the parent filter with the updated one
          const updatedFilters = filters.map((filter) =>
            filter.id === parentId ? updatedParentFilter : filter,
          )

          // If the parent filter is not already in the filters array, add it
          if (!filters.some((filter) => filter.id === parentId)) {
            updatedFilters.push(updatedParentFilter)
          }

          // Call the onChange callback with the updated filters
          onChange(updatedFilters)

          if ((config?.confirm || singleSelect) && !config?.restart) {
            // close the dropdown with the new filters
            handleClose(updatedFilters)
          } else if (config?.restart) {
            // go back to initial options
            openInitialOptions(undefined, { filters: updatedFilters })
          }
        }
      } else {
        const addFilter = { ...option, id: newId, values: [] }
        // remove not required fields
        delete addFilter.allowsCustomValues
        // add to filters top level

        onChange([...filters, addFilter])
      }

      // if there are values set the next dropdownOptions
      // or the option allows custom values (text)
      if ((values && values.length > 0 && !parentId) || option.allowsCustomValues) {
        const newOptions = values?.map((value) => ({ ...value, parentId: newId })) || []

        openOptions(newOptions, newId)
      }
    }

    const handleEditFilter = (id: string) => {
      // find the filter option and set those values
      const filter = filters.find((filter) => filter.id === id)

      // search chips are edited in place (typing directly in the chip), not via the dropdown
      if (filter && getFilterFromId(id) === SEARCH_FILTER_ID) {
        const raw = filter.values?.[0]?.label || String(filter.values?.[0]?.id || '')
        setEditingSearchChipId(id)
        setEditingSearchValue(raw.replace(/%/g, '')) // strip LIKE wildcards for display
        closeOptions()
        return
      }

      handleEditFilterValues(id, filter)
    }

    // commit in-place search chip edit: update its value, or remove the chip if cleared
    const handleSearchChipCommit = () => {
      const id = editingSearchChipId
      if (!id) return
      const text = editingSearchValue.trim()
      const updatedFilters = text
        ? filters.map((f) => (f.id === id ? { ...f, values: [{ id: text, label: text }] } : f))
        : filters.filter((f) => f.id !== id)
      setEditingSearchChipId(null)
      setEditingSearchValue('')
      onChange(updatedFilters)
      onFinish && onFinish(updatedFilters)
    }

    const handleSearchChipCancel = () => {
      setEditingSearchChipId(null)
      setEditingSearchValue('')
    }

    const handleEditFilterValues = (id: string, filter?: Filter) => {
      if (filter && filter.values && filter.values.length > 0) {
        // Merge options with filter values to include custom values
        const newOptions = mergeOptionsWithFilterValues(filter, options).map((value) => ({
          ...value,
          parentId: id,
          isSelected: getIsValueSelected(value.id, id, filters),
        }))

        const filterName = getFilterFromId(id)
        if (sortSelectedToTopFields.includes(filterName)) {
          // sort selected to top
          newOptions.sort((a, b) => {
            if (a.isSelected && !b.isSelected) return -1
            if (!a.isSelected && b.isSelected) return 1
            return 0
          })
        }
        openOptions(newOptions, id)
      } else {
        openOptions(options, id)
      }
    }

    const handleRemoveFilter = (id: string) => {
      // remove a filter by id
      const updatedFilters = filters.filter((filter) => filter.id !== id)
      onChange(updatedFilters)
      onFinish && onFinish(updatedFilters)
      // close the dropdown
      closeOptions()
    }

    const handleInvertFilter = (id: string) => {
      // find the filter and update the inverted value
      const updatedFilters = filters.map((filter) =>
        filter.id === id ? { ...filter, inverted: !filter.inverted } : filter,
      )
      onChange(updatedFilters)
      onFinish && onFinish(updatedFilters)
    }

    const handleFilterOperatorChange = (id: string, operator: FilterOperator) => {
      // find the filter and update the operator value
      const updatedFilters = filters.map((filter) =>
        filter.id === id ? { ...filter, operator } : filter,
      )
      onChange(updatedFilters)
      onFinish && onFinish(updatedFilters)
    }

    const handleContainerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      // cancel on esc
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        handleClose(filters)
      }
    }

    // inline search input: open the dropdown if needed, then delegate
    // selection/navigation (Enter, ArrowDown, custom value) to the dropdown
    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!dropdownOptions) {
        if (event.key === 'Enter' || event.key === 'ArrowDown') {
          event.preventDefault()
          openInitialOptions(undefined, { filters })
          return
        }
      }
      dropdownApiRef.current?.onInputKeyDown(event)
    }

    const handleSearchBarKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      // the inline input owns its own keys (typing, caret moves) — don't hijack them
      if ((event.target as HTMLElement).tagName === 'INPUT') return
      // open on enter or space
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        event.stopPropagation()
        openOptions(options, null)
      }
      // focus next item on arrow right / left
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        event.stopPropagation()
        const target = event.target as HTMLElement
        let next = target.nextElementSibling as HTMLElement | null
        while (next && !next.classList.contains('search-filter-item')) {
          next = next.nextElementSibling as HTMLElement | null
          if (next === null) break // Safeguard to prevent infinite loop
        }

        let prev = target.previousElementSibling as HTMLElement | null
        while (prev && !prev.classList.contains('search-filter-item')) {
          prev = prev.previousElementSibling as HTMLElement | null
          if (prev === null) break // Safeguard to prevent infinite loop
        }
        if (event.key === 'ArrowRight') {
          next?.focus()
        } else {
          prev?.focus()
        }
      }
    }

    // focus a different filter to edit
    const handleSwitchFilterFocus = (direction: 'left' | 'right') => {
      // get current filter from dropdownParentId
      const filterIndex = filters.findIndex((filter) => filter.id === dropdownParentId)
      // get next filter
      const nextFilter = filters[filterIndex + (direction === 'right' ? 1 : -1)]
      if (!nextFilter) return

      // open options for the next filter
      handleEditFilter(nextFilter.id)
    }

    const handleConfirmAndClose: SearchFilterDropdownProps['onConfirmAndClose'] = (
      filters,
      config,
    ) => {
      if (config?.restart) {
        // update filters
        onChange(filters)
        // go back to initial options
        openInitialOptions(undefined, { filters })

        if (config.previous) {
          // find the filter element by the id and focus it
          // @ts-ignore
          setTimeout(() => document.getElementById(config.previous)?.focus(), 50)
        }
      } else {
        // close the dropdown
        handleClose(filters)
      }
    }

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          // Open the initial options if not already open
          if (!dropdownOptions?.length) {
            openInitialOptions(undefined, { filters })
          }
        },
        close: () => {
          closeOptions()
        },
        // shortcut: behave like picking this option from the dropdown — open an
        // existing filter for editing, or add it and open its values
        openFilter: (optionId: string) => {
          const existing = filters.find((f) => getFilterFromId(f.id) === optionId)
          if (existing) {
            handleEditFilter(existing.id)
            return
          }
          const option = options.find((o) => o.id === optionId)
          if (option) handleOptionSelect(option)
        },
        getContainerElement: () => containerRef.current,
        getFiltersBarElement: () => filtersBarRef.current,
      }),
      [dropdownOptions, filters, options, openInitialOptions, closeOptions],
    )

    return (
      <Styled.Container
        onKeyDown={handleContainerKeyDown}
        ref={containerRef}
        {...props}
        className={clsx('search-filter', props.className, { compact })}
      >
        {dropdownOptions && (
          <Styled.Backdrop
            onClick={() => {
              // clicking outside while typing a custom search stores it instead of discarding
              if (!dropdownApiRef.current?.commitSearch()) handleClose(filters)
            }}
          />
        )}
        <Styled.BarRow className="search-bar-row">
          <Styled.SearchBar
            onClick={(e) => {
              searchInputRef.current?.focus()
              openInitialOptions(e, { filters })
            }}
            onKeyDown={handleSearchBarKeyDown}
            ref={filtersBarRef}
            {...pt.searchBar}
            className={clsx('search-bar', pt.searchBar?.className)}
          >
            <Icon icon="search" className="search" />
            {!!filters.length && (
              <Styled.SearchBarFilters ref={filtersRef} className="filter-values">
                {filters.map((filter, index) => (
                  <SearchFilterItem
                    key={filter.id + index}
                    id={filter.id}
                    label={filter.label}
                    inverted={filter.inverted}
                    operator={filter.operator}
                    values={filter.values}
                    icon={filter.icon}
                    isCustom={filter.isCustom}
                    index={index}
                    isEditing={dropdownParentId === filter.id}
                    isDisabled={disabledFilters?.includes(getFilterFromId(filter.id))}
                    isReadonly={filter.isReadonly}
                    isCompact={showIconsOnly || compact}
                    isSearch={getFilterFromId(filter.id) === SEARCH_FILTER_ID}
                    isInlineEditing={editingSearchChipId === filter.id}
                    inlineEditValue={editingSearchValue}
                    onInlineEditChange={setEditingSearchValue}
                    onInlineEditCommit={handleSearchChipCommit}
                    onInlineEditCancel={handleSearchChipCancel}
                    onEdit={handleEditFilter}
                    onRemove={handleRemoveFilter}
                    onInvert={handleInvertFilter}
                    {...pt.item}
                  />
                ))}
              </Styled.SearchBarFilters>
            )}
            {!dropdownParentId && (
              <Styled.SearchInput
                ref={searchInputRef}
                className="search-bar-input"
                value={search}
                placeholder={filters.length ? '' : getEmptyPlaceholder(enableGlobalSearch)}
                onChange={(e) => {
                  setSearch(e.target.value)
                  if (!dropdownOptions) openInitialOptions(undefined, { filters })
                }}
                onKeyDown={handleInputKeyDown}
                onClick={(e) => e.stopPropagation()}
                onFocus={() => {
                  if (!dropdownOptions) openInitialOptions(undefined, { filters })
                }}
              />
            )}
          </Styled.SearchBar>
          {!!quickActions?.length && (
            <Styled.QuickActions className="quick-actions">
              {quickActions.map((action) => (
                <Styled.FilterButton
                  key={action.id}
                  icon={action.icon as IconType}
                  label={action.label}
                  selected={action.active}
                  className="quick-action"
                  data-tooltip={action.tooltip}
                  data-tooltip-delay={0}
                  onClick={() => onQuickAction?.(action.id)}
                />
              ))}
            </Styled.QuickActions>
          )}
        </Styled.BarRow>
        {allOptions && (
          <SearchFilterDropdown
            options={allOptions}
            values={filters}
            parentId={dropdownParentId}
            parentLabel={parentOption?.label}
            isCustomAllowed={
              !!parentOption?.allowsCustomValues || (!parentOption && !!enableGlobalSearch)
            }
            isHasValueAllowed={!!parentOption?.allowHasValue}
            isNoValueAllowed={!!parentOption?.allowNoValue}
            isInvertedAllowed={!!parentOption?.allowExcludes}
            operatorChangeable={!!parentOption?.operatorChangeable}
            preserveOrderFields={preserveOrderFields}
            onSelect={handleOptionSelect}
            onInvert={handleInvertFilter}
            onOperatorChange={handleFilterOperatorChange}
            onConfirmAndClose={handleConfirmAndClose}
            onSwitchFilter={handleSwitchFilterFocus}
            search={search}
            onSearchChange={setSearch}
            searchInputRef={searchInputRef}
            listRef={dropdownRef}
            ref={dropdownApiRef}
            {...pt.dropdown}
          />
        )}
      </Styled.Container>
    )
  },
)

const getEmptyPlaceholder = (enableGlobalSearch: boolean) => {
  return enableGlobalSearch ? 'Search and filter' : 'Filter'
}

// get all the top level fields that should be shown depending on the filters and enableMultipleSameFilters and disabledFilters
const getShownRootOptions = (
  options: Option[],
  filters: Filter[],
  enableMultipleSameFilters: boolean,
  disabledFilters: string[] = [],
): Option[] => {
  return options.filter((option) => {
    if (disabledFilters.includes(option.id)) return false
    if (!enableMultipleSameFilters) {
      return !doesFilterExist(option.id, filters)
    }
    return true
  })
}

const mergeOptionsWithFilterValues = (filter: Filter, options: Option[]): Option[] => {
  const filterName = getFilterFromId(filter.id)
  const filterOptions = options.find((option) => option.id === filterName)?.values || []

  const mergedOptions = [...filterOptions]

  filter.values?.forEach((value) => {
    if (value.id === 'hasValue' || value.id === 'noValue') return
    if (!mergedOptions.some((option) => option.id === value.id)) {
      mergedOptions.push(value)
    }
  })

  return mergedOptions
}
