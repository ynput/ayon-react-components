import { FilterValue, Option, SearchFilterGroupOption } from './types'

type Scope = 'Task' | 'Folder'
type NestedValue = FilterValue & { values?: FilterValue[] }

const scopeIcons: Record<Scope, string> = {
  Task: 'check_circle',
  Folder: 'folder',
}

const statusValues: FilterValue[] = [
  ['Not ready', 'fiber_new', '#3d444f'],
  ['Ready to start', 'timer', '#bababa'],
  ['In progress', 'play_arrow', '#5bb8f5'],
  ['Pending review', 'visibility', '#ffcd19'],
  ['Approved', 'task_alt', '#08f094'],
  ['On hold', 'back_hand', '#fa6e47'],
  ['Omitted', 'block', '#cb1a1a'],
].map(([label, icon, color]) => ({ id: label, label, icon, color }))

const tagValues: FilterValue[] = [
  ['easy', '#cebef9'],
  ['hard', '#f46262'],
  ['status', '#45a55d'],
  ['type', '#bead3c'],
  ['hide', '#5b1515'],
].map(([label, color]) => ({ id: label, label, color }))

const taskTypeValues: FilterValue[] = [
  ['Story', 'task_alt'],
  ['Art', 'palette'],
  ['Modeling', 'language'],
  ['Texture', 'brush'],
  ['Lookdev', 'ev_shadow'],
  ['Rigging', 'construction'],
  ['Setdress', 'scene'],
  ['Layout', 'nature_people'],
  ['Animation', 'directions_run'],
  ['FX', 'fireplace'],
  ['Lighting', 'highlight'],
  ['Paint', 'video_stable'],
  ['Compositing', 'layers'],
  ['Edit', 'imagesearch_roller'],
].map(([label, icon]) => ({ id: label, label, icon }))

const dateValues: NestedValue[] = [
  ['today', 'Today', 'today'],
  ['yesterday', 'Yesterday', 'date_range'],
  ['after-now', 'After today', 'event_upcoming'],
  ['before-now', 'Before today', 'event_busy'],
  ['this-week', 'This week', 'date_range'],
  ['last-week', 'Last week', 'date_range'],
  ['this-month', 'This month', 'calendar_month'],
  ['last-month', 'Last month', 'calendar_month'],
  ['this-year', 'This year', 'calendar_month'],
  ['last-year', 'Last year', 'calendar_month'],
].map(([id, label, icon]) => ({ id, label, icon, values: [] }))

const attributeFields = [
  ['fps', 'FPS', 'float', '30fps_select'],
  ['resolutionWidth', 'Width', 'integer', 'settings_overscan'],
  ['resolutionHeight', 'Height', 'integer', 'settings_overscan'],
  ['pixelAspect', 'Pixel aspect', 'float', 'stop'],
  ['clipIn', 'Clip In', 'integer', 'line_start_diamond'],
  ['clipOut', 'Clip Out', 'integer', 'line_end_diamond'],
  ['frameStart', 'Start frame', 'integer', 'line_start_circle'],
  ['frameEnd', 'End frame', 'integer', 'line_end_circle'],
  ['handleStart', 'Handle start', 'integer', 'line_start_square'],
  ['handleEnd', 'Handle end', 'integer', 'line_end_square'],
  ['startDate', 'Start date', 'datetime', 'calendar_month'],
  ['endDate', 'End date', 'datetime', 'calendar_month'],
  ['description', 'Description', 'string', 'description'],
] as const

const createGroupedOption = (
  scope: Scope,
  id: string,
  label: string,
  type: Option['type'],
  icon: string,
  values: FilterValue[] = [],
): Option => ({
  id: `${scope.toLowerCase()}_${id}`,
  type,
  label: label,
  group: {
    name: id,
    label: `${scope} ${label}`,
    icon: scopeIcons[scope],
  },
  tooltip: `${scope} ${label}`,
  search: { label: scope },
  value: { icon: scopeIcons[scope] },
  icon,
  values,
  allowsCustomValues: type !== 'datetime',
  allowHasValue: type === 'list_of_strings' || type === 'datetime',
  allowNoValue: type === 'list_of_strings' || type === 'datetime',
  allowExcludes: true,
  operatorChangeable: type === 'list_of_strings',
  operator: 'OR',
})

const createScopeOptions = (scope: Scope): Option[] => [
  createGroupedOption(scope, 'status', 'Status', 'string', 'arrow_circle_right', statusValues),
  createGroupedOption(scope, 'tags', 'Tags', 'list_of_strings', 'local_offer', tagValues),
  createGroupedOption(scope, 'name', 'Name', 'string', 'text_fields'),
  createGroupedOption(scope, 'priority', 'Priority', 'string', 'keyboard_double_arrow_up'),
  ...attributeFields.map(([id, label, type, icon]) =>
    createGroupedOption(
      scope,
      `attrib.${id}`,
      label,
      type,
      icon,
      type === 'datetime' ? dateValues : [],
    ),
  ),
]

const taskOptions: Option[] = [
  {
    id: 'task_taskType',
    type: 'string',
    label: 'Task Type - Task',
    icon: 'check_circle',
    values: taskTypeValues,
    allowExcludes: true,
    operator: 'OR',
  },
  ...createScopeOptions('Task'),
]

const folderOptions: Option[] = [
  {
    id: 'folder_folderType',
    type: 'string',
    label: 'Folder Type - Folder',
    icon: 'folder',
    values: ['Folder', 'Library', 'Asset', 'Sequence', 'Shot'].map((label) => ({
      id: label,
      label,
    })),
    allowExcludes: true,
    operator: 'OR',
  },
  ...createScopeOptions('Folder'),
]

const scopedOptions: Option[] = [...taskOptions, ...folderOptions]

const getScope = (option: Option) => option.id.split('_', 1)[0]

const groupedOptions = new Map<string, Option[]>()
for (const option of scopedOptions) {
  if (!option.group) continue
  const groupName = typeof option.group === 'string' ? option.group : option.group.name
  const options = groupedOptions.get(groupName) || []
  options.push(option)
  groupedOptions.set(groupName, options)
}

export const taskFolderGroupOptions: SearchFilterGroupOption[] = [...groupedOptions].flatMap(
  ([name, options]) => {
    const scopes = new Set(options.map(getScope))
    if (scopes.size < 2) return []

    const firstOption = options[0]
    const group = typeof firstOption.group === 'string' ? undefined : firstOption.group
    return [
      {
        name,
        label: firstOption.label,
        icon: firstOption.icon,
        color: group?.color,
      },
    ]
  },
)

const groupedFieldNames = new Set(taskFolderGroupOptions.map(({ name }) => name))

export const taskFolderOptions: Option[] = scopedOptions.map((option) => {
  if (!option.group) return option
  const groupName = typeof option.group === 'string' ? option.group : option.group.name
  return groupedFieldNames.has(groupName) ? option : { ...option, group: undefined }
})

export default taskFolderOptions
