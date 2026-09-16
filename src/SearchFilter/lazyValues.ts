import { Filter, FilterValue, Option } from './types'

// State of one Option.loadValues request, keyed by option id in SearchFilter
export type LazyValuesState = {
  status: 'loading' | 'loaded' | 'error'
  values: FilterValue[]
  error?: string
  key?: string // Option.loadValuesKey the values were loaded for
  request: object // identity of the load that owns this entry
}

// Values loaded for a different loadValuesKey (e.g. another project) are stale and not shown
export const getCurrentValues = (entry: LazyValuesState | undefined, key?: string): FilterValue[] =>
  entry && entry.key === key ? entry.values : []

// Consumers are expected to reject with an Error (or a string); API payloads are normalized there
export const getLoadErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  return undefined
}

// Merges loaded values into their options: loaded values first, static values not covered by them after
export const withLazyValues = (options: Option[], lazyValues: Record<string, LazyValuesState>) => {
  if (!Object.keys(lazyValues).length) return options
  return options.map((option) => {
    const loadedValues = getCurrentValues(lazyValues[option.id], option.loadValuesKey)
    if (!loadedValues.length) return option
    const existing = option.values || []
    const extra = existing.filter((value) => !loadedValues.some((l) => l.id === value.id))
    return { ...option, values: [...loadedValues, ...extra] }
  })
}

// Updates the opened panel snapshot with loaded values: matching items are refreshed in place
// (order stays stable), new values are appended, custom values in the snapshot are kept
export const mergeLoadedValues = (
  openedOptions: Option[],
  loadedValues: FilterValue[],
  parentId: string,
): Option[] => {
  const loadedById = new Map(loadedValues.map((value) => [value.id, value]))
  const openedIds = new Set(openedOptions.map((option) => option.id))
  const refreshed = openedOptions.map((option) => {
    const loaded = loadedById.get(option.id)
    return loaded ? { ...option, ...loaded, parentId } : option
  })
  const added = loadedValues
    .filter((value) => !openedIds.has(value.id))
    .map((value) => ({ ...value, parentId }))
  return [...refreshed, ...added]
}

// Chips built before lazy values arrived carry the raw id as label
export const getDisplayValues = (filter: Filter, option?: Option): FilterValue[] | undefined => {
  if (!option?.loadValues || !filter.values) return filter.values
  return filter.values.map((value) => {
    if (value.label !== value.id) return value
    const loaded = option.values?.find((candidate) => candidate.id === value.id)
    if (!loaded) return value
    return {
      ...value,
      label: loaded.label,
      icon: value.icon ?? loaded.icon,
      img: value.img ?? loaded.img,
      color: value.color ?? loaded.color,
    }
  })
}
