import { forwardRef, useEffect, useRef } from 'react'
import { Filter } from '../types'
import { SearchFilterItemValue, SearchFilterItemValueProps } from '../SearchFilterItemValue'
import clsx from 'clsx'
import * as Styled from './SearchFilterItem.styled'

export interface SearchFilterItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'>,
    Filter {
  index?: number
  isEditing?: boolean
  isInvertedAllowed?: boolean
  isDisabled?: boolean
  isCompact?: boolean
  isSearch?: boolean
  isInlineEditing?: boolean
  inlineEditValue?: string
  onInlineEditChange?: (value: string) => void
  onEdit?: (id: string) => void
  onRemove?: (id: string) => void
  onInvert?: (id: string) => void
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
      isSearch,
      isInlineEditing,
      inlineEditValue,
      onInlineEditChange,
      onEdit,
      onRemove,
      onInvert,
      onClick,
      pt = { value: {} },
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)

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

    const operatorText = getOperatorText(index || 0, inverted)

    return (
      <>
        {operatorText && <Styled.Operator>{operatorText}</Styled.Operator>}
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
          {!isSearch && (
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
            <Styled.ChipInput
              ref={inputRef}
              value={inlineEditValue ?? ''}
              style={{
                ['--chip-input-width' as string]: `${(inlineEditValue?.length ?? 0) + 1}ch`,
              }}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onInlineEditChange?.(e.target.value)}
              // onBlur={() => onInlineEditCommit?.()}
              // onKeyDown={(e) => {
              //   e.stopPropagation()
              //   if (e.key === 'Enter') {
              //     e.preventDefault()
              //     onInlineEditCommit?.()
              //   } else if (e.key === 'Escape') {
              //     e.preventDefault()
              //     onInlineEditCancel?.()
              //   }
              // }}
            />
          ) : (
            values?.map((value, index) => (
              <SearchFilterItemValue
                key={(value.id || '') + index}
                img={value.img}
                icon={value.icon}
                color={value.color}
                isCustom={value.isCustom}
                operator={index > 0 ? operator : undefined}
                isCompact={(values.length > 1 && (!!value.icon || !!value.img)) || isCompact}
                {...pt.value}
                pt={value.pt}
                id={value.id}
                label={value.label}
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

const getOperatorText = (index: number, inverted?: boolean): string | undefined => {
  if (index > 0) {
    return `and ${inverted ? 'not' : ''}`
  } else if (inverted) {
    return 'not'
  } else {
    return undefined
  }
}
