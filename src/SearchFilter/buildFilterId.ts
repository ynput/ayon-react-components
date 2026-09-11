export const FILTER_SEPARATOR = '__'

let nextFilterId = 0

export const buildFilterId = (name: string) =>
  `${name}${FILTER_SEPARATOR}${Date.now().toString(36)}-${++nextFilterId}`
