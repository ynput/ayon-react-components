import { useEffect, useMemo, useRef, useState, useImperativeHandle, forwardRef } from 'react'

import { Filter, FilterOperator, Option } from './types'
import * as Styled from './SearchFilter.styled'
import { SearchFilterItem, SearchFilterItemProps } from './SearchFilterItem/SearchFilterItem'
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
  rootOperator?: FilterOperator
  onRootOperatorChange?: (operator: FilterOperator) => void
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
      rootOperator = 'AND',
      onRootOperatorChange,
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
    // ref for the inline search input rendered inside a chip
    const chipSearchRef = useRef<HTMLInputElement>(null)

    const { enableMultiple: enableGlobalSearchMultiple } = globalSearchConfig || {}

    const [dropdownParentId, setDropdownParentId] = useState<null | string>(null)
    const [dropdownOptions, setOptions] = useState<Option[] | null>(null)
    const [search, setSearch] = useState('')
    // in-place editing of a search chip (typing directly in the chip)
    const [editingSearchChipId, setEditingSearchChipId] = useState<string | null>(null)
    // true when editing an existing filter (multi-select); false when creating a new one (single-select auto-close)
    const [isEditingExisting, setIsEditingExisting] = useState(false)
    // index of the currently highlighted dropdown option (React state instead of browser focus)
    const [highlightedOptionIndex, setHighlightedOptionIndex] = useState<number | null>(null)

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

    const closeSearch = () => {
      setSearch('')
      setEditingSearchChipId(null)
      setIsEditingExisting(false)
    }

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
      closeSearch()
      closeOptions()
      // call onClose if it exists
      onFinish && onFinish(updatedFilters)

      // focus the search input after a short delay to ensure it's rendered
      setTimeout(() => searchInputRef.current?.focus(), 10)
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
            !isEditingExisting ||
            parentFilter.singleSelect ||
            (parentFilter.id.includes(SEARCH_FILTER_ID) && !enableGlobalSearchMultiple)

          let updatedValues = singleSelect
            ? [option] // If replace is true, only add the new option
            : valueAlreadyExists && parentFilter.values
            ? // If the option already exists, remove it
              parentFilter.values.filter((val) => val.id !== option.id)
            : // Otherwise, add the new option to the values array
              [...(parentFilter.values || []), option]

          // If we are editing an existing filter and it's a custom value, replace any existing custom values.
          // This prevents adding multiple custom values when editing a custom value in-place.
          if (option.isCustom && isEditingExisting && !singleSelect) {
            updatedValues = [
              (parentFilter.values || []).filter((val) => !val.isCustom),
              option,
            ].flat()
          }

          // if the option is hasValue or noValue, remove all other options
          if (option.id === 'hasValue' || option.id === 'noValue') {
            updatedValues = updatedValues.filter((val) => val.id === option.id)
          } else {
            // remove hasValue and noValue if a specific value is added
            updatedValues = updatedValues.filter(
              (val) => val.id !== 'hasValue' && val.id !== 'noValue',
            )
          }

          // Create a new parent filter with the updated values
          const updatedParentFilter = {
            ...parentFilter,
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
            setSearch('')
            setEditingSearchChipId(null)
            setIsEditingExisting(false)
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
      if (!parentId && ((values && values.length > 0) || option.allowsCustomValues)) {
        const newOptions = values?.map((value) => ({ ...value, parentId: newId })) || []

        openOptions(newOptions, newId)
        // enter inline chip editing mode so the chip's search input drives the value selection
        setEditingSearchChipId(newId)
        setIsEditingExisting(false)
      } else if (!parentId) {
        // root option with no child values (e.g. already fully handled above)
        setEditingSearchChipId(null)
        setIsEditingExisting(false)
      }
      // parentId case: preserve editingSearchChipId — it is cleared by handleClose when done

      // RESET SEARCH
      setSearch('')
    }

    const handleEditFilter = (id: string) => {
      // find the filter option and set those values
      const filter = filters.find((filter) => filter.id === id)

      // search chips are edited in place (typing directly in the chip), not via the dropdown
      if (filter && getFilterFromId(id) === SEARCH_FILTER_ID) {
        const raw = filter.values?.[0]?.label || String(filter.values?.[0]?.id || '')
        setEditingSearchChipId(id)
        setSearch(raw.replace(/%/g, '')) // strip LIKE wildcards for display
        closeOptions()
        return
      }

      // regular filter: enter inline chip editing with the value dropdown open (multi-select)
      setEditingSearchChipId(id)
      setIsEditingExisting(true)

      const firstCustomValue = filter?.values?.find((v) => v.isCustom)
      if (firstCustomValue) {
        setSearch(firstCustomValue.label || String(firstCustomValue.id))
      } else {
        setSearch('')
      }

      handleEditFilterValues(id, filter)
    }

    // commit in-place search chip edit for SEARCH_FILTER_ID: update its value, or remove if cleared
    const handleSearchChipCommit = () => {
      const id = editingSearchChipId
      if (!id) return
      const text = search.trim()
      const updatedFilters = text
        ? filters.map((f) => (f.id === id ? { ...f, values: [{ id: text, label: text }] } : f))
        : filters.filter((f) => f.id !== id)
      closeSearch()
      onChange(updatedFilters)
      onFinish && onFinish(updatedFilters)
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
      // close the dropdown and any chip editing state
      closeOptions()
      if (editingSearchChipId === id) closeSearch()
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
      // update the values-level operator for a single filter
      const updatedFilters = filters.map((filter) =>
        filter.id === id ? { ...filter, operator } : filter,
      )
      onChange(updatedFilters)
      onFinish && onFinish(updatedFilters)
    }

    const handleRootOperatorChange = () => {
      // flip the root operator between AND and OR
      const newOperator = rootOperator === 'AND' ? 'OR' : 'AND'
      onRootOperatorChange?.(newOperator)
    }

    // Reset highlighted index when search text or the active dropdown panel changes.
    // When search is non-empty the effective index falls back to 0 (first item auto-highlighted)
    // so we just null out the explicit state and let the derivation handle it.
    useEffect(() => {
      setHighlightedOptionIndex(null)
    }, [search, dropdownParentId])

    // When the dropdown closes entirely, clear any stale highlight.
    useEffect(() => {
      if (!dropdownOptions) setHighlightedOptionIndex(null)
    }, [dropdownOptions])

    // When search is non-empty and nothing has been explicitly highlighted, default to 0.
    const effectiveHighlightedIndex =
      highlightedOptionIndex ?? (search && dropdownOptions ? 0 : null)

    // Get the rendered <li> elements from the dropdown list.
    const getDropdownItems = (): HTMLElement[] =>
      dropdownRef.current ? Array.from(dropdownRef.current.querySelectorAll('li')) : []

    // Scroll the highlighted item into view if it is not visible.
    useEffect(() => {
      if (effectiveHighlightedIndex !== null && dropdownRef.current) {
        const items = getDropdownItems()
        const activeItem = items[effectiveHighlightedIndex]
        if (activeItem) {
          activeItem.scrollIntoView({ block: 'nearest' })
        }
      }
    }, [effectiveHighlightedIndex])

    const handleContainerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        handleClose(filters)
      }
    }

    // key handler for the inline chip search input
    const handleChipInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // SEARCH_FILTER_ID chip editing — no dropdown is open, just commit/cancel text
      if (editingSearchChipId && !dropdownParentId) {
        if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault()
          event.stopPropagation()
          handleSearchChipCommit()
        }
        return
      }

      // Value-panel mode — dropdown is open; drive it from the chip input
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopPropagation()
        const items = getDropdownItems()
        if (items.length > 0) {
          setHighlightedOptionIndex((prev) => {
            const currentIdx = prev ?? (search ? 0 : -1)
            return Math.min(currentIdx + 1, items.length - 1)
          })
        }
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()
        setHighlightedOptionIndex((prev) => (prev === null || prev === 0 ? null : prev - 1))
        return
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault()
        event.stopPropagation()
        const isCmdCtrl = event.metaKey || event.ctrlKey
        if (isCmdCtrl) {
          // force add as custom value if there is search text, or just confirm and close
          const committed = dropdownApiRef.current?.commitSearch()
          if (!committed) {
            handleConfirmAndClose?.(filters)
          }
        } else {
          const items = getDropdownItems()
          const idx = effectiveHighlightedIndex
          if (idx !== null && items[idx]) {
            items[idx].click()
          } else {
            const firstNonSearch = items.find((li) => li.id !== 'search') as HTMLElement | null
            if (firstNonSearch) firstNonSearch.click()
            else dropdownApiRef.current?.commitSearch()
          }
        }
      }

      if (event.key === 'Backspace' && !search) {
        event.preventDefault()
        event.stopPropagation()
        // remove last value from the current filter
        const filter = filters.find((f) => f.id === editingSearchChipId)
        if (filter && filter.values && filter.values.length > 0) {
          const updatedValues = filter.values.slice(0, -1)
          const updatedFilters = filters.map((f) =>
            f.id === editingSearchChipId ? { ...f, values: updatedValues } : f,
          )
          onChange(updatedFilters)
        }
      }
    }

    // inline search input: open the dropdown if needed, then delegate
    // selection/navigation (Enter, ArrowDown, custom value) to the dropdown
    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      const isCmdCtrl = event.metaKey || event.ctrlKey

      if (event.key === 'Backspace' && !search && filters.length > 0) {
        handleRemoveFilter(filters[filters.length - 1].id)
        return
      }

      if (!dropdownOptions) {
        if (event.key === 'Enter' || event.key === 'ArrowDown' || event.key === 'Tab') {
          event.preventDefault()

          if (isCmdCtrl && event.key === 'Enter') {
            handleClose(filters)
            return
          }

          openInitialOptions(undefined, { filters })
          return
        }
      } else {
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          const items = getDropdownItems()
          if (items.length > 0) {
            setHighlightedOptionIndex((prev) => {
              const currentIdx = prev ?? (search ? 0 : -1)
              return Math.min(currentIdx + 1, items.length - 1)
            })
          }
          return
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          setHighlightedOptionIndex((prev) => (prev === null || prev === 0 ? null : prev - 1))
          return
        }
        if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault()
          if (isCmdCtrl) {
            if (enableGlobalSearch && search.trim()) {
              // force-add global search text filter even if options match
              const newId = buildFilterId(SEARCH_FILTER_ID)
              const newFilter: Filter = {
                id: newId,
                label: '',
                values: [{ id: search, label: search, parentId: newId }],
              }
              handleClose([...filters, newFilter])
              return
            } else {
              // nothing to add or global search not enabled, just submit
              handleClose(filters)
              return
            }
          }
          const items = getDropdownItems()
          const idx = effectiveHighlightedIndex
          if (idx !== null && items[idx]) {
            items[idx].click()
          } else {
            const firstNonSearch = items.find((li) => li.id !== 'search') as HTMLElement | null
            if (firstNonSearch) firstNonSearch.click()
            else dropdownApiRef.current?.commitSearch()
          }
        }
      }
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
        // clear chip editing state before going back to root
        closeSearch()
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
                    rootOperator={rootOperator}
                    onRootOperatorChange={
                      !!onRootOperatorChange ? handleRootOperatorChange : undefined
                    }
                    searchInputRef={editingSearchChipId === filter.id ? chipSearchRef : undefined}
                    search={{
                      value: search,
                      onChange: (e) => setSearch(e.target.value),
                      onKeyDown: handleChipInputKeyDown,
                    }}
                    onEdit={handleEditFilter}
                    onRemove={handleRemoveFilter}
                    onInvert={handleInvertFilter}
                    {...pt.item}
                  />
                ))}
              </Styled.SearchBarFilters>
            )}
            {!dropdownParentId && !editingSearchChipId && (
              <Styled.SearchInput
                ref={searchInputRef}
                className="search-bar-input"
                value={search}
                placeholder={filters.length ? '' : getEmptyPlaceholder(enableGlobalSearch)}
                onChange={(e) => {
                  const val = e.target.value
                  setSearch(val)
                  if (val && !dropdownOptions) openInitialOptions(undefined, { filters })
                }}
                onKeyDown={handleInputKeyDown}
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
            searchInputRef={searchInputRef}
            listRef={dropdownRef}
            ref={dropdownApiRef}
            highlightedIndex={effectiveHighlightedIndex}
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
