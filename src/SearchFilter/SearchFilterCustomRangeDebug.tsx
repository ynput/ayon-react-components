import { useRef, useState } from 'react'
import { SearchFilter, SearchFilterProps, SearchFilterRef } from './SearchFilter'
import { Filter, Option } from './types'
import { Button } from '../Buttons/Button'
import { SaveButton } from '../Buttons/SaveButton'
import { InputDate } from '../Inputs/InputDate'
import { FormRow } from '../Layout/FormRow'
import { Dialog } from '../Overlay/Dialog'
import { SEARCH_FILTER_ID } from './constants'

const CUSTOM_RANGE_ID = 'custom-range'
const CUSTOM_RANGE_ICON = 'edit'

const monthDayFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

const monthDayYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getStartOfDay = (date: Date) => {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

const getEndOfDay = (date: Date) => {
  const nextDate = new Date(date)
  nextDate.setHours(23, 59, 59, 999)
  return nextDate
}

const parseDateInput = (value: string, endOfDay = false) => {
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(year, month - 1, day)
  return endOfDay ? getEndOfDay(parsed) : getStartOfDay(parsed)
}

const buildDateRangeValue = (id: string, label: string, start: Date, end: Date, icon: string) => ({
  id,
  label,
  icon,
  values: [
    { id: start.toISOString(), label: monthDayYearFormatter.format(start) },
    { id: end.toISOString(), label: monthDayYearFormatter.format(end) },
  ],
})

const buildCustomRangeValue = (start: Date, end: Date) => {
  const currentYear = new Date().getFullYear()
  const endFormatter = end.getFullYear() === currentYear ? monthDayFormatter : monthDayYearFormatter

  return {
    id: `custom-${start.toISOString()}-${end.toISOString()}`,
    label: `${monthDayFormatter.format(start)} - ${endFormatter.format(end)}`,
    icon: 'date_range',
    values: [
      { id: start.toISOString(), label: monthDayYearFormatter.format(start) },
      { id: end.toISOString(), label: monthDayYearFormatter.format(end) },
    ],
  }
}

const parseCustomRangeValue = (valueId: string) => {
  const customIdContent = valueId.replace('custom-', '')
  const firstEndIndex = customIdContent.indexOf('Z')

  if (firstEndIndex <= 0) return null

  const startISO = customIdContent.substring(0, firstEndIndex + 1)
  const endISO = customIdContent.substring(firstEndIndex + 2)

  if (!startISO || !endISO) return null

  const startDate = new Date(startISO)
  const endDate = new Date(endISO)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null

  return {
    startDate,
    endDate,
  }
}

const buildDebugDatetimeOption = (): Option => {
  const today = new Date()
  const startOfToday = getStartOfDay(today)
  const endOfToday = getEndOfDay(today)
  const startOfLastWeek = getStartOfDay(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
  )
  const endOfLastWeek = getEndOfDay(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
  )

  return {
    id: 'createdAt',
    type: 'datetime',
    label: 'Created at',
    operator: 'OR',
    inverted: false,
    values: [
      buildDateRangeValue('today', 'Today', startOfToday, endOfToday, 'today'),
      buildDateRangeValue('last-7-days', 'Last 7 days', startOfLastWeek, endOfToday, 'date_range'),
      { id: CUSTOM_RANGE_ID, label: 'Custom range', icon: CUSTOM_RANGE_ICON, values: [] },
    ],
    allowHasValue: true,
    allowNoValue: true,
    allowExcludes: true,
    allowsCustomValues: false,
    operatorChangeable: false,
    icon: 'calendar_month',
    singleSelect: true,
  }
}

const normalizeFilters = (inputFilters: Filter[]) => {
  let validFilters = inputFilters.map((filter) => {
    if (
      filter.type === 'datetime' &&
      filter.values?.some((value) => value.id === CUSTOM_RANGE_ID)
    ) {
      return {
        ...filter,
        values: filter.values.filter((value) => value.id !== CUSTOM_RANGE_ID),
      }
    }

    return filter
  })

  const searchFilters = validFilters.filter((filter) => filter.id.startsWith(SEARCH_FILTER_ID))
  if (searchFilters.length > 1) {
    const mergedValues = Array.from(
      new Map(
        searchFilters.flatMap((filter) => filter.values || []).map((value) => [value.id, value]),
      ).values(),
    )

    const mergedFilter = {
      ...searchFilters[0],
      id: SEARCH_FILTER_ID,
      values: mergedValues,
    }

    validFilters = [
      ...validFilters.filter((filter) => !filter.id.startsWith(SEARCH_FILTER_ID)),
      mergedFilter,
    ]
  }

  return validFilters
}

export interface SearchFilterCustomRangeDebugProps
  extends Omit<SearchFilterProps, 'options' | 'filters' | 'onChange' | 'onFinish'> {
  baseOptions: Option[]
}

export const SearchFilterCustomRangeDebug = ({
  baseOptions,
  pt,
  ...props
}: SearchFilterCustomRangeDebugProps) => {
  const [filters, setFilters] = useState<Filter[]>([])
  const [customRangeFilterId, setCustomRangeFilterId] = useState<string | null>(null)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  const searchFilterRef = useRef<SearchFilterRef>(null)
  const activeDatetimeFilterRef = useRef<string | null>(null)
  const debugStoryOptions = [...baseOptions, buildDebugDatetimeOption()]

  const handleOpenCustomRangeForFilter = (filterId: string) => {
    const filter = filters.find((currentFilter) => currentFilter.id === filterId)
    const currentRange = filter?.values?.[0]

    if (currentRange?.id?.startsWith('custom-')) {
      const parsedRange = parseCustomRangeValue(currentRange.id)
      if (parsedRange) {
        setCustomStartDate(toDateInputValue(parsedRange.startDate))
        setCustomEndDate(toDateInputValue(parsedRange.endDate))
      }
    } else {
      setCustomStartDate('')
      setCustomEndDate('')
    }

    setCustomRangeFilterId(filterId)
  }

  const findActiveDatetimeFilterId = () => {
    if (activeDatetimeFilterRef.current) return activeDatetimeFilterRef.current

    const datetimeFilters = filters.filter((filter) => filter.type === 'datetime')
    const emptyDatetimeFilter = datetimeFilters.find((filter) => !filter.values?.length)

    if (emptyDatetimeFilter) return emptyDatetimeFilter.id
    if (datetimeFilters.length > 0) return datetimeFilters[datetimeFilters.length - 1].id

    return null
  }

  const handleFilterChange = (newFilters: Filter[]) => {
    const addedDatetimeFilter = newFilters.find(
      (filter) =>
        filter.type === 'datetime' &&
        !filters.some((currentFilter) => currentFilter.id === filter.id),
    )

    if (addedDatetimeFilter) {
      activeDatetimeFilterRef.current = addedDatetimeFilter.id
    }

    setFilters(normalizeFilters(newFilters))
  }

  const handleFinish = (nextFilters: Filter[]) => {
    setFilters(normalizeFilters(nextFilters))
  }

  const handleCustomRangeApply = () => {
    if (!customRangeFilterId || !customStartDate || !customEndDate) return

    const startDate = parseDateInput(customStartDate)
    const endDate = parseDateInput(customEndDate, true)

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      endDate < startDate
    ) {
      return
    }

    const optionId = customRangeFilterId.split('__')[0]
    const option = debugStoryOptions.find((currentOption) => currentOption.id === optionId)
    if (!option) return

    const nextFilter: Filter = {
      id: customRangeFilterId,
      type: 'datetime',
      label: option.label,
      icon: option.icon,
      values: [buildCustomRangeValue(startDate, endDate)],
      singleSelect: true,
    }

    const nextFilters = normalizeFilters([
      ...filters.filter((filter) => filter.id !== customRangeFilterId),
      nextFilter,
    ])

    setFilters(nextFilters)
    setCustomRangeFilterId(null)
    setCustomStartDate('')
    setCustomEndDate('')
    searchFilterRef.current?.close()
  }

  const handleCustomRangeClose = () => {
    setCustomRangeFilterId(null)
    setCustomStartDate('')
    setCustomEndDate('')
  }

  const handleSearchBarClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement

    if (target.closest('.remove') || target.closest('.button')) return

    const chipElement = target.closest('.search-filter-item')
    if (!chipElement) return

    const labelElement = chipElement.querySelector('.label')
    const chipLabel = labelElement?.textContent?.replace(/:$/, '').trim()
    if (!chipLabel) return

    const datetimeFilter = filters.find(
      (filter) =>
        filter.type === 'datetime' &&
        filter.label === chipLabel &&
        filter.values &&
        filter.values.length > 0,
    )

    const currentRange = datetimeFilter?.values?.[0]
    if (!datetimeFilter || !currentRange?.id?.startsWith('custom-')) return

    event.stopPropagation()
    handleOpenCustomRangeForFilter(datetimeFilter.id)
  }

  const { dropdown, searchBar, ...ptRest } = pt || {}

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => searchFilterRef.current?.open()}>Open Filter</Button>
        <Button onClick={() => searchFilterRef.current?.close()}>Close Filter</Button>
      </div>

      <SearchFilter
        ref={searchFilterRef}
        {...props}
        options={debugStoryOptions}
        filters={filters}
        onChange={handleFilterChange}
        onFinish={handleFinish}
        enableMultipleSameFilters={false}
        pt={{
          searchBar: {
            style: { paddingRight: 28 },
            onClickCapture: handleSearchBarClickCapture,
            ...searchBar,
          },
          dropdown: {
            ...dropdown,
            pt: {
              ...dropdown?.pt,
              item: {
                ...dropdown?.pt?.item,
                onClick: (event) => {
                  const previousResult = dropdown?.pt?.item?.onClick?.(event)
                  if (previousResult === false) return false

                  const listItem = (event.target as HTMLLIElement).closest('li')
                  if (!listItem) return true

                  if (listItem.querySelector(`span[icon="${CUSTOM_RANGE_ICON}"]`)) {
                    const filterId = findActiveDatetimeFilterId()
                    if (filterId) {
                      handleOpenCustomRangeForFilter(filterId)
                    }
                    return false
                  }

                  return true
                },
              },
            },
          },
          ...ptRest,
        }}
      />

      <pre
        style={{
          margin: 0,
          padding: 12,
          borderRadius: 8,
          background: 'rgba(0, 0, 0, 0.18)',
          fontSize: 12,
          lineHeight: 1.5,
          overflow: 'auto',
        }}
      >
        {JSON.stringify(filters, null, 2)}
      </pre>

      <Dialog
        isOpen={!!customRangeFilterId}
        onClose={handleCustomRangeClose}
        header={
          debugStoryOptions.find((option) => option.id === customRangeFilterId?.split('__')[0])
            ?.label || 'Custom range'
        }
        size="sm"
        hideCancelButton
        footer={
          <SaveButton
            icon="check"
            active={!!customStartDate && !!customEndDate && customEndDate >= customStartDate}
            onClick={handleCustomRangeApply}
          >
            Confirm
          </SaveButton>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FormRow label="Start date">
            <InputDate
              {...({
                selected: customStartDate ? new Date(customStartDate) : undefined,
                onChange: (date: Date | null) =>
                  setCustomStartDate(date ? toDateInputValue(date) : ''),
                autoFocus: true,
              } as any)}
            />
          </FormRow>
          <FormRow label="End date">
            <InputDate
              {...({
                selected: customEndDate ? new Date(customEndDate) : undefined,
                onChange: (date: Date | null) =>
                  setCustomEndDate(date ? toDateInputValue(date) : ''),
                openToDate: customStartDate ? new Date(customStartDate) : undefined,
              } as any)}
            />
          </FormRow>
        </div>
      </Dialog>
    </div>
  )
}
