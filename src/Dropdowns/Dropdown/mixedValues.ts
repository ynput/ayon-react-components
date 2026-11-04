// Editing a list value (tags, assignees, ...) of several items at once.
// Each value is on all, some or none of the items. A click adds a value to every item, removes it
// from every item, or leaves it as it is, so values only some items have are kept unless changed.

export type MixedState = 'all' | 'some' | 'none'

// values the user changed while the dropdown is open
export type MixedEdits = Record<string, 'add' | 'remove'>

// what to do to every item
export interface MixedChange {
  add: string[]
  remove: string[]
}

// replacing sets every item to exactly the checked values, so values only some items have start unchecked
export const getInitialMixedState = (
  count: number | undefined,
  total: number,
  replace: boolean,
): MixedState => {
  if (count && count >= total) return 'all'
  if (count && !replace) return 'some'
  return 'none'
}

export const getMixedState = (
  value: string,
  counts: Record<string, number>,
  total: number,
  edits: MixedEdits,
  replace: boolean,
): MixedState => {
  const edit = edits[value]
  if (edit) return edit === 'add' ? 'all' : 'none'
  return getInitialMixedState(counts[value], total, replace)
}

// a click cycles some -> all -> none -> some, or all <-> none
export const toggleMixedValue = (
  value: string,
  counts: Record<string, number>,
  total: number,
  edits: MixedEdits,
  replace: boolean,
): MixedEdits => {
  const initial = getInitialMixedState(counts[value], total, replace)
  const current = getMixedState(value, counts, total, edits, replace)
  const cycle: MixedState[] = initial === 'some' ? ['some', 'all', 'none'] : ['all', 'none']
  const next = cycle[(cycle.indexOf(current) + 1) % cycle.length]

  const nextEdits = { ...edits }
  if (next === initial) delete nextEdits[value]
  else nextEdits[value] = next === 'all' ? 'add' : 'remove'
  return nextEdits
}

export const getMixedChange = (
  counts: Record<string, number>,
  total: number,
  edits: MixedEdits,
  replace: boolean,
): MixedChange => {
  const change: MixedChange = { add: [], remove: [] }
  for (const value of new Set([...Object.keys(counts), ...Object.keys(edits)])) {
    const count = counts[value] || 0
    const state = getMixedState(value, counts, total, edits, replace)
    if (state === 'all' && count < total) change.add.push(value)
    if (state === 'none' && count > 0) change.remove.push(value)
  }
  return change
}

// counts how many of the items have each value
export const getMixedCounts = (values: string[][]): Record<string, number> => {
  const counts: Record<string, number> = {}
  for (const itemValues of values) {
    for (const value of new Set(itemValues)) counts[value] = (counts[value] || 0) + 1
  }
  return counts
}

// an item's value after the change, keeping the order of the values it had
export const applyMixedChange = (values: string[], { add, remove }: MixedChange): string[] => {
  const kept = values.filter((value) => !remove.includes(value))
  return [...kept, ...add.filter((value) => !kept.includes(value))]
}
