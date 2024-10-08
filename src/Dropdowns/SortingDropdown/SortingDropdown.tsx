import { FC } from 'react'
import { DefaultValueTemplate, Dropdown, DropdownProps } from '../Dropdown'
import styled from 'styled-components'
import SortCard from './SortCard'

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
}

export const SortingDropdown: FC<SortingDropdownProps> = ({
  value = [],
  options = [],
  onChange,
  title = 'Sort by',
  multiSelect = true,
  ...props
}) => {
  const handleChange = (v: DropdownProps['value']) => {
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

  return (
    <StyledDropdown
      {...props}
      value={value.map(({ id }) => id)}
      options={options}
      onChange={handleChange}
      dataKey="id"
      multiSelect={multiSelect}
      // multiSelectClose
      widthExpand
      valueTemplate={(values, selected, isOpen) => {
        // console.log(selected)
        return (
          <DefaultValueTemplate
            value={[]}
            placeholder=""
            isOpen={isOpen}
            childrenCustom={
              <>
                <span>{title}</span>
                {selected.map((v) => {
                  const id = v.toString()
                  // find the sort card in options
                  const sortValue =
                    value.find((o) => o.id === id) || options.find((o) => o.id === id)
                  if (!sortValue) return ''

                  return (
                    <SortCard
                      key={id}
                      {...sortValue}
                      id={sortValue.id}
                      label={sortValue.label}
                      sortOrder={sortValue?.sortOrder ?? true}
                      disabled={isOpen}
                      onSortBy={() => !isOpen && handleSortChange(id)}
                      onRemove={() => !isOpen && handleRemove(id)}
                      onKeyDown={(e) => {
                        if (isOpen) return
                        e.stopPropagation()
                        if (e.key === 'Enter') {
                          if ((e.target as HTMLDivElement).id !== 'remove') {
                            handleSortChange(id)
                          } else {
                            handleRemove(id)
                          }
                        }
                      }}
                    />
                  )
                })}
              </>
            }
          />
        )
      }}
    />
  )
}
