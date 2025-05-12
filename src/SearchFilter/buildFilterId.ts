import { uuid } from 'short-uuid'
export const FILTER_SEPARATOR = '__'
export const buildFilterId = (name: string) => `${name}${FILTER_SEPARATOR}${uuid()}`
