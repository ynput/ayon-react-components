import { FILTER_SEPARATOR } from './buildFilterId'

export const getFilterFromId = (id: string) => id?.split(FILTER_SEPARATOR)[0]
