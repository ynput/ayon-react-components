import { forwardRef, useEffect, useRef } from 'react'
import { Filter, FilterOperator } from '../types'
import { SearchFilterItemValue, SearchFilterItemValueProps } from '../SearchFilterItemValue'
import clsx from 'clsx'
import * as Styled from './SearchFilterItem.styled'

export interface SearchFilterItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'>,
    Filter {
  index: number
  isEditing?: boolean
  isInvertedAllowed?: boolean
  isDisabled?: boolean
  isCompact?: boolean
  isSearch?: boolean
  showIconsOnly?: boolean
  isInlineEditing?: boolean
  inlineSuggestion?: string
  // search is html input props
  search: React.InputHTMLAttributes<HTMLInputElement>
  // external ref for the inline chip input (used so the parent can control focus)
  searchInputRef?: React.RefObject<HTMLInputElement>
  onEdit?: (id: string) => void
  onRemove?: (id: string) => void
  onInvert?: (id: string) => void
  onOperatorChange?: (id: string) => void
  operatorChangeable?: boolean
  rootOperator: FilterOperator
  onRootOperatorChange?: () => void
  pt?: {
    value?: SearchFilterItemValueProps
  }
}

export const SearchFilterItem = forwardRef<HTMLDivElement, SearchFilterItemProps>(
  (
    {
      id,
      label,
      inverted,
      operator,
      values,
      icon,
      isCustom,
      index,
      isEditing,
      isInvertedAllowed,
      isDisabled,
      isReadonly,
      isCompact,
      showIconsOnly,
      isSearch,
      isInlineEditing,
      inlineSuggestion,
      rootOperator = 'AND',
      search,
      searchInputRef,
      onEdit,
      onRemove,
      onInvert,
      onOperatorChange,
      operatorChangeable,
      onRootOperatorChange,
      onClick,
      pt = { value: {} },
      ...props
    },
    ref,
  ) => {
    const localInputRef = useRef<HTMLInputElement>(null)
    const inputRef = searchInputRef ?? localInputRef

    useEffect(() => {
      if (isInlineEditing) {
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }, [isInlineEditing])

    const handleEdit = (id: string) => {
      if (isReadonly) return
      onEdit?.(id)
    }

    const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
      // block main onClick event
      event?.stopPropagation()
      // remove filter
      onRemove?.(id)
    }

    const handleInvert = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isInvertedAllowed) return
      // block main onClick event
      event?.stopPropagation()
      // remove filter
      onInvert?.(id)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      // enter or space
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        event.stopPropagation()
        handleEdit(id)
      }
    }

    // trigger onEdit callback and forward onClick event
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      // stop propagation to opening whole search bar
      event.stopPropagation()
      handleEdit(id)
      onClick && onClick(event)
    }

    const handleRootOperatorChange = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (!onRootOperatorChange) return
      e.stopPropagation()
      onRootOperatorChange?.()
    }

    const handleOperatorChange = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (!onOperatorChange) return
      e.stopPropagation()
      onOperatorChange?.(id)
    }

    const rootOperatorLabel = rootOperator.toLowerCase()

    return (
      <>
        {(index > 0 || inverted) && (
          <Styled.Operator>
            {index > 0 && (
              <span
                className={clsx({ clickable: !!onRootOperatorChange })}
                onClick={handleRootOperatorChange}
              >
                {rootOperatorLabel}
              </span>
            )}
            {inverted && <span>not</span>}
          </Styled.Operator>
        )}
        <Styled.FilterItem
          id={id}
          {...props}
          ref={ref}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          {...props}
          className={clsx('search-filter-item', props.className, {
            editing: isEditing,
            disabled: isDisabled,
          })}
        >
          {!isSearch && inverted && (
            <>
              <Styled.ChipButton
                className={clsx('button', { disabled: !isInvertedAllowed })}
                icon={inverted ? 'do_not_disturb_on' : 'check_small'}
                onClick={handleInvert}
                data-tooltip={isInvertedAllowed ? 'include/exclude' : undefined}
              />
              {!isCompact && <span className="label">{label}:</span>}
            </>
          )}
          {isInlineEditing ? (
            isSearch || values?.some((v) => v.isCustom) ? (
              // Search (global text) chip OR custom value chip: replace the value with the inline input
              <Styled.ChipInputWrapper data-value={search?.value || ''}>
                {inlineSuggestion &&
                  search?.value &&
                  inlineSuggestion.toLowerCase().startsWith(String(search.value).toLowerCase()) && (
                    <span className="autocomplete-suggestion">
                      <span className="invisible-text">{search.value}</span>
                      {inlineSuggestion.slice(String(search.value).length)}
                    </span>
                  )}
                <Styled.ChipInput ref={inputRef} size={1} {...search} />
              </Styled.ChipInputWrapper>
            ) : (
              // Regular filter chip: show existing values + inline input to add more
              <>
                {values?.map((value, index) => (
                  <SearchFilterItemValue
                    key={(value.id || '') + index}
                    img={value.img}
                    icon={value.icon}
                    color={value.color}
                    isCustom={value.isCustom}
                    operator={index > 0 ? operator : undefined}
                    showIconsOnly={
                      (values.length > 1 && (!!value.icon || !!value.img)) || showIconsOnly
                    }
                    {...pt.value}
                    pt={value.pt}
                    id={value.id}
                    label={value.label}
                    isOperatorChangeable={operatorChangeable && index > 0}
                    onOperatorChange={handleOperatorChange}
                  />
                ))}
                <Styled.ChipInputWrapper data-value={search?.value || ''}>
                  {inlineSuggestion &&
                    search?.value &&
                    inlineSuggestion
                      .toLowerCase()
                      .startsWith(String(search.value).toLowerCase()) && (
                      <span className="autocomplete-suggestion">
                        <span className="invisible-text">{search.value}</span>
                        {inlineSuggestion.slice(String(search.value).length)}
                      </span>
                    )}
                  <Styled.ChipInput ref={inputRef} size={1} {...search} />
                </Styled.ChipInputWrapper>
              </>
            )
          ) : (
            values?.map((value, index) => (
              <SearchFilterItemValue
                key={(value.id || '') + index}
                img={value.img}
                icon={value.icon}
                color={value.color}
                isCustom={value.isCustom}
                operator={index > 0 ? operator : undefined}
                showIconsOnly={
                  (values.length > 1 && (!!value.icon || !!value.img)) || showIconsOnly
                }
                {...pt.value}
                pt={value.pt}
                id={value.id}
                label={value.label}
                isOperatorChangeable={operatorChangeable && index > 0}
                onOperatorChange={handleOperatorChange}
              />
            ))
          )}
          {onRemove && (
            <Styled.ChipButton className="button remove" icon="close" onClick={handleRemove} />
          )}
        </Styled.FilterItem>
      </>
    )
  },
)
