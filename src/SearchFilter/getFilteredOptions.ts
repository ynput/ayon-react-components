import { matchSorter } from 'match-sorter'
import { Option } from './types'
import { SEARCH_FILTER_ID } from './constants'

export const getFilteredOptions = (options: Option[], search: string, isCustomAllowed: boolean) => {
  // filter out options that don't match the search in any of the fields

  // no search? return all the main options
  if (!search) return options.filter((option) => !option.searchOnly)

  // Split the search string into individual words, ignoring extra whitespace
  const searchWords = search.trim().toLowerCase().split(/\s+/)

  // Iteratively filter the options for each word in the search query
  let matched = options

  for (const word of searchWords) {
    if (!word) continue

    matched = matchSorter(matched, word, {
      keys: [
        { key: 'label', threshold: matchSorter.rankings.CONTAINS },
        { key: 'searchLabel', threshold: matchSorter.rankings.CONTAINS },
      ],
      baseSort: (a, b) => {
        const aIsRoot = !a.item.searchOnly
        const bIsRoot = !b.item.searchOnly

        // 1. Prioritize root-level filters over nested children
        if (aIsRoot && !bIsRoot) return -1
        if (!aIsRoot && bIsRoot) return 1

        // 2. Fallback to standard alphabetical sort for items of the same level
        return String(a.rankedValue).localeCompare(String(b.rankedValue))
      },
    })
  }

  // if isCustomAllowed, add the custom value to the list
  if (isCustomAllowed && search.trim()) {
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
