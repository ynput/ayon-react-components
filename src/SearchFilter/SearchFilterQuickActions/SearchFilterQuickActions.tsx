import React, { useMemo } from 'react'
import clsx from 'clsx'
import { Filter, Option, SearchFilterQuickAction } from '../types'
import * as Styled from '../SearchFilter.styled'
import { IconType } from '../../Icon'
import { getFilterFromId } from '../getFilterFromId'

export interface SearchFilterQuickActionsProps {
  quickActions: (string | SearchFilterQuickAction)[]
  options: Option[]
  filters: Filter[]
  compact?: boolean
  onChange: (filters: Filter[]) => void
  onFinish?: (filters: Filter[]) => void
  onQuickAction?: (id: string) => void
  onEditFilter: (id: string) => void
  onOptionSelect: (option: Option) => void
}

export const SearchFilterQuickActions: React.FC<SearchFilterQuickActionsProps> = ({
  quickActions,
  options,
  filters,
  compact,
  onChange,
  onFinish,
  onQuickAction,
  onEditFilter,
  onOptionSelect,
}) => {
  // Automatically resolve quick action metadata based on your options and filters
  const resolvedQuickActions = useMemo(() => {
    if (!quickActions?.length) return []

    return quickActions.map((qa) => {
      const isString = typeof qa === 'string'
      const overrides: Partial<SearchFilterQuickAction> = isString ? {} : qa

      let id = isString ? qa : qa.id
      let filterId = overrides.filterId
      let valueId = overrides.valueId

      // Support compound string format, e.g., "status:active"
      if (isString && qa.includes(':')) {
        const [parsedFilterId, parsedValueId] = qa.split(':')
        filterId = parsedFilterId
        valueId = parsedValueId
      }

      let rootOption = options.find((o) => o.id === (filterId || id))
      let childOption: Option | undefined
      let parentOption: Option | undefined

      if (filterId && valueId) {
        // Explicit parent-child lookup
        parentOption = options.find((o) => o.id === filterId)
        childOption = parentOption?.values?.find((v) => v.id === valueId)
      } else if (valueId) {
        // valueId provided but no filterId (likely id is the filterId)
        parentOption = options.find((o) => o.id === id)
        childOption = parentOption?.values?.find((v) => v.id === valueId)
      } else if (!rootOption) {
        // Fallback deep scanning (same as before)
        for (const opt of options) {
          if (opt.values) {
            const found = opt.values.find((v) => v.id === id)
            if (found) {
              childOption = found
              parentOption = opt
              break
            }
          }
        }
      }

      const targetOption = rootOption && !valueId ? rootOption : childOption

      // Evaluate 'active' state automatically
      let active = overrides.active
      if (active === undefined) {
        if (rootOption && !valueId) {
          active = filters.some((f) => getFilterFromId(f.id) === rootOption!.id)
        } else if (childOption && parentOption) {
          const parentFilter = filters.find((f) => getFilterFromId(f.id) === parentOption!.id)
          active = parentFilter?.values?.some((v) => v.id === childOption!.id) || false
        } else {
          active = false
        }
      }

      return {
        id,
        icon: overrides.icon || targetOption?.icon,
        label: overrides.label,
        color: overrides.color || (targetOption as Option)?.color,
        tooltip: overrides.tooltip || overrides.label || targetOption?.label,
        active,
        isRoot: !!rootOption && !valueId,
        rootOption,
        isChild: !!childOption,
        childOption,
        parentOption,
      }
    })
  }, [quickActions, options, filters])

  if (!resolvedQuickActions.length) {
    return null
  }

  return (
    <Styled.QuickActions className="quick-actions">
      {resolvedQuickActions.map((action) => (
        <Styled.QuickActionButton
          key={action.id}
          icon={action.icon as IconType}
          label={action.label}
          iconProps={action.color ? { style: { color: action.color } } : undefined}
          selected={action.active}
          className={clsx('quick-action', { compact })}
          data-tooltip={action.tooltip}
          data-tooltip-delay={0}
          onClick={() => {
            const isActive = action.active

            if (action.isRoot && action.rootOption) {
              if (isActive) {
                // REMOVE ALL FILTERS OF THIS TYPE
                const updatedFilters = filters.filter(
                  (f) => getFilterFromId(f.id) !== action.rootOption!.id,
                )
                onChange(updatedFilters)
                onFinish?.(updatedFilters)
              } else {
                // Simulates picking the root option from the dropdown (e.g., 'Assignee')
                const existing = filters.find(
                  (f) => getFilterFromId(f.id) === action.rootOption!.id,
                )
                if (existing) {
                  onEditFilter(existing.id)
                } else {
                  onOptionSelect(action.rootOption)
                }
              }
            } else if (action.isChild && action.childOption && action.parentOption) {
              if (isActive) {
                // REMOVE SPECIFIC VALUE
                const parentFilter = filters.find(
                  (f) => getFilterFromId(f.id) === action.parentOption!.id,
                )
                if (parentFilter) {
                  const updatedValues = parentFilter.values?.filter(
                    (v) => v.id !== action.childOption!.id,
                  )
                  let updatedFilters
                  if (updatedValues?.length === 0) {
                    // If no values left, remove the filter entirely
                    updatedFilters = filters.filter((f) => f.id !== parentFilter.id)
                  } else {
                    updatedFilters = filters.map((f) =>
                      f.id === parentFilter.id ? { ...f, values: updatedValues } : f,
                    )
                  }
                  onChange(updatedFilters)
                  onFinish?.(updatedFilters)
                }
              } else {
                // Simulates picking a specific value (e.g., 'John Doe')
                const existingParent = filters.find(
                  (f) => getFilterFromId(f.id) === action.parentOption!.id,
                )
                onOptionSelect({
                  ...action.childOption,
                  parentId: existingParent ? existingParent.id : action.parentOption!.id,
                })
              }
            } else {
              // Fallback for custom actions not linked to options
              onQuickAction?.(action.id)
            }
          }}
        />
      ))}
    </Styled.QuickActions>
  )
}
