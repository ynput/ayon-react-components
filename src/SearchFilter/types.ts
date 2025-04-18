export type FilterValue = {
  id: string
  label: string
  img?: string | null
  icon?: string | null
  color?: string | null
  isCustom?: boolean
  parentId?: string | null
}

export type FilterOperator = 'AND' | 'OR'

export type Filter = {
  id: string
  type?:
    | 'string'
    | 'integer'
    | 'float'
    | 'boolean'
    | 'datetime'
    | 'list_of_strings'
    | 'list_of_integers'
    | 'list_of_any'
    | 'list_of_submodels'
    | 'dict'
  label: string
  inverted?: boolean
  operator?: FilterOperator
  icon?: string | null
  img?: string | null
  values?: FilterValue[]
  isCustom?: boolean
  isReadonly?: boolean // can not be edited and only removed
  singleSelect?: boolean
  fieldType?: string
}

export interface Option extends Filter {
  allowNoValue?: boolean // allows the filter to have "no value"
  allowHasValue?: boolean // allows the filter to have "has a value"
  allowsCustomValues?: boolean // allows the filter to have custom values
  allowExcludes?: boolean // allows the filter to be inverted
  operatorChangeable?: boolean // allows the operator to be changed
  color?: string | null // color of the filter (not used for root options)
  parentId?: string | null // parent filter id
  searchOnly?: boolean //  It will be shown when searching but hidden usually
  searchLabel?: string // label to be shown when searching
  contentBefore?: React.ReactNode // content to be shown before the filter
  contentAfter?: React.ReactNode // content to be shown after the filter
}
