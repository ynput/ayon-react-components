import { HTMLAttributes, ReactNode, forwardRef, useRef } from 'react'
import {
  DefaultItemTemplate,
  DefaultValueTemplate,
  Dropdown,
  DropdownProps,
  DropdownRef,
} from '../Dropdown'
import styled from 'styled-components'
import clsx from 'clsx'
import { SortCard, SortCardProps } from './SortCard'
import { Icon } from '../../Icon'

const StyledDropdown = styled(Dropdown)`
  /* prevent active state if there is an active state on .action (close or sort buttons) */
  &:has(.action:active) {
    button {
      &:active {
        background-color: var(--md-sys-color-surface-container-low-hover);
      }
    }
  }
`

const StyledDefaultItemTemplate = styled(DefaultItemTemplate)`
  .add-another {
    /* default hidden until row is hovered */
    visibility: hidden;
  }

  &:hover {
    .add-another {
      visibility: visible;
    }
  }
`

export const AddAnotherButton = styled(Icon)`
  border-radius: var(--border-radius-m);
  cursor: pointer;
  margin-left: auto;
  margin-right: 4px;
  &:hover {
    background-color: var(--md-sys-color-surface-container-hover);
  }
`

export type SortCardType = {
  id: string
  label: string
  // the direction of the sort, true for ascending, false for descending
  sortOrder?: boolean
}

export interface SortingDropdownProps extends Omit<DropdownProps, 'value' | 'onChange'> {
  value: SortCardType[]
  options: SortCardType[]
  onChange: (value: SortCardType[]) => void
  title: string
  multiSelectButton?: boolean
  renderValueContent?: (props: {
    isOpen: boolean
    title: string
    selected: string[]
    cards: ReactNode[]
  }) => ReactNode
  sortCardProps?: Pick<SortCardProps, 'hideSort' | 'disableSort'>
  pt?: DropdownProps['pt'] & {
    chip?: Partial<HTMLAttributes<HTMLDivElement>>
  }
}

export const SortingDropdown = forwardRef<DropdownRef, SortingDropdownProps>(
  (
    {
      value = [],
      options = [],
      onChange,
      title = 'Sort by',
      multiSelect = true,
      multiSelectButton = true,
      renderValueContent,
      sortCardProps,
      pt,
      ...props
    },
    externalRef,
  ) => {
    const internalRef = useRef<DropdownRef>(null)
    const ref = externalRef || internalRef
    const handleChange: DropdownProps['onChange'] = (v, _r, e) => {
      // for each value, find in value, if not found, find in options and add sortOrder
      const newValues = v?.map((id) => {
        const idx = value.findIndex((v) => v.id === id)
        if (idx === -1) {
          const option = options.find((o) => o.id === id)

          if (!option) throw new Error(`SortingDropdown: option with id ${id} not found`)

          return {
            id: option.id,
            label: option?.label ?? '',
            sortOrder: true,
          }
        } else {
          return value[idx]
        }
      })

      onChange(newValues ?? [])
    }

    const handleSortChange = (id: string) => {
      // find the value in value
      const item = value.find((v) => v.id === id)
      const itemIndex = value.findIndex((v) => v.id === id)
      if (!item) throw new Error(`SortingDropdown: value with id ${id} not found`)
      // flip sort order
      const newItem = { ...item, sortOrder: !item.sortOrder }
      const newValues = [...value]
      newValues.splice(itemIndex, 1, newItem)
      // set the new value
      onChange(newValues)
    }

    const handleRemove = (id: string) => {
      // remove id from value
      const newValues = value.filter((v) => v.id !== id)
      onChange(newValues)
    }

    const renderSortCard = (selectedValue: string, isOpen: boolean) => {
      const id = selectedValue.toString()
      const sortValue =
        value.find((option) => option.id === id) || options.find((option) => option.id === id)
      if (!sortValue) return null

      return (
        <SortCard
          key={id}
          {...sortValue}
          {...pt?.chip}
          {...sortCardProps}
          className={clsx(pt?.chip?.className)}
          id={sortValue.id}
          label={sortValue.label}
          sortOrder={sortValue?.sortOrder ?? true}
          disabled={isOpen}
          onSortBy={() => !isOpen && !sortCardProps?.disableSort && handleSortChange(id)}
          onRemove={() => !isOpen && handleRemove(id)}
          onKeyDown={(e) => {
            if (isOpen) return
            e.stopPropagation()
            if (e.key === 'Enter') {
              if ((e.target as HTMLDivElement).id === 'remove') {
                handleRemove(id)
                return
              }

              if (!sortCardProps?.disableSort && !sortCardProps?.hideSort) {
                handleSortChange(id)
              }
            }
          }}
        />
      )
    }

    const valueIds = value.map(({ id }) => id)

    return (
      <StyledDropdown
        {...props}
        ref={ref}
        value={valueIds}
        options={options}
        onChange={handleChange}
        dataKey="id"
        multiSelect={multiSelect}
        multiSelectClose
        widthExpand
        valueTemplate={(values, selected, isOpen) => {
          const cards = selected.map((selectedValue) =>
            renderSortCard(selectedValue.toString(), isOpen),
          )

          return (
            <DefaultValueTemplate
              value={[]}
              placeholder=""
              isOpen={isOpen}
              childrenCustom={
                renderValueContent ? (
                  renderValueContent({ isOpen, title, selected, cards })
                ) : (
                  <>
                    <span>{title}</span>
                    {cards}
                  </>
                )
              }
            />
          )
        }}
        itemTemplate={(option, _isActive, isSelected, _i, mixedSelection) => (
          <StyledDefaultItemTemplate
            option={option}
            dataKey={props.dataKey || 'id'}
            labelKey={props.labelKey || 'label'}
            selected={valueIds || []}
            mixedSelected={mixedSelection}
            value={valueIds}
            multiSelect={multiSelect}
            minSelected={props.minSelected}
            itemClassName={props.itemClassName}
            itemStyle={props.itemStyle}
            endContent={
              multiSelect &&
              multiSelectButton &&
              !isSelected &&
              !!value?.length && <AddAnotherButton icon="add" className="add-another" />
            }
            onClick={(e) => {
              const target = e.target as HTMLElement
              const isAddAnother = target.closest('.add-another')
              if (isAddAnother || !multiSelect || !multiSelectButton) {
                // do nothing and let dropdown handle the multiselect logic
              } else {
                // intercept the click, stop it to prevent the dropdown adding more.
                e.stopPropagation()
                // handle the change ourselves
                const value = options.find((o) => o.id === option.id)
                if (!value)
                  throw new Error(`SortingDropdown: option with id ${option?.id} not found`)
                onChange([value])
                // @ts-expect-error
                ref?.current?.close()
              }
            }}
          />
        )}
      />
    )
  },
)
