import styled from 'styled-components'
import { Dropdown, DropdownProps, DropdownRef } from '../Dropdown'
import { forwardRef } from 'react'
import { uniq } from 'lodash'
import { Status, StatusField, StatusSize } from './StatusField/StatusField'

const StyledDropdown = styled(Dropdown)`
  button {
    background-color: unset;
  }
  display: flex;
`

export interface StatusSelectProps extends Omit<DropdownProps, 'onChange' | 'emptyMessage'> {
  size?: StatusSize
  height?: number
  onChange?: (status: string) => void
  multipleSelected?: number
  disableMessage?: boolean
  invert?: boolean
  isChevron?: boolean
}

export const StatusSelect = forwardRef<DropdownRef, StatusSelectProps>(
  (
    {
      value = [],
      size = 'full',
      height = 30,
      align,
      onChange,
      onOpen,
      multipleSelected,
      style,
      placeholder,
      disableMessage,
      disabled,
      widthExpand = true,
      options,
      invert = false,
      isChanged,
      isChevron = false,
      ...props
    },
    ref,
  ) => {
    if (!value && !placeholder) return null

    const handleChange = (status: (string | number)[]) => {
      if (!status?.length) return
      onChange && onChange(status[0]?.toString())
    }

    const dropdownValue = Array.isArray(value) ? uniq(value) : value ? [value] : []
    const isMixed = dropdownValue.length > 1

    // Hide chevron for mixed values and if isChevron is false
    const resolveChevronVisibility = (isChevron: boolean, isActive: boolean) => {
      if (!isChevron) return false
      if (isChevron && isMixed) return false
      return isActive
    }

    return (
      <StyledDropdown
        ref={ref}
        search={options.length > 10}
        searchFields={['name', 'state']}
        {...props}
        message={
          !disableMessage && multipleSelected && multipleSelected > 1
            ? `${multipleSelected} Selected`
            : undefined
        }
        widthExpand={widthExpand}
        onOpen={onOpen}
        align={align}
        value={dropdownValue}
        onChange={handleChange}
        disabled={disabled}
        valueTemplate={(value, selected) => {
          let status: Status = { name: 'No Status' }
          if (selected.length === 1) {
            const foundStatus = options.find((s) => s.name === selected[0])
            if (foundStatus) {
              status = foundStatus
            }
          } else if (selected.length > 1) {
            status = { name: 'Mixed Statuses' }
          }

          return (
            <StatusField
              status={status}
              size={size}
              height={height}
              placeholder={placeholder}
              invert={invert}
              className={'value'}
              showChevron={isChevron}
              isChanged={isChanged}
            />
          )
        }}
        dataKey={'name'}
        options={options}
        itemTemplate={(status, isActive) =>
          options.find((s) => s.name === status.name) && (
            <StatusField
              status={status}
              isSelecting
              isActive={isActive}
              height={height + 2}
              showChevron={resolveChevronVisibility(isChevron, isActive)}
            />
          )
        }
      />
    )
  },
)
