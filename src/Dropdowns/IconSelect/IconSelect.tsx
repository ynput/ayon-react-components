import { forwardRef, useMemo } from 'react'
import * as Styled from './IconSelect.styled'
import { Dropdown, DropdownProps, DropdownRef } from '../Dropdown'
import { Icon, IconType, iconSet } from '../../Icon'

export interface IconTemplateProps {
  value: IconSelectProps['value']
  valueTemplate?: boolean
  isActive?: boolean
  isSelected?: boolean
}

const IconTemplate = ({ value, valueTemplate, isActive, isSelected }: IconTemplateProps) => {
  return (
    <Styled.Icon $valueTemplate={valueTemplate} $isActive={isSelected}>
      {value.map((icon) => (
        <Icon key={icon} icon={icon as IconType} />
      ))}
      {value.length < 2 && <span>{value}</span>}
    </Styled.Icon>
  )
}

export interface IconSelectProps
  extends Omit<DropdownProps, 'options' | 'valueTemplate' | 'itemTemplate' | 'search' | 'ref'> {
  value: DropdownProps['value']
  onChange?: DropdownProps['onChange']
  featured?: IconType[]
  featuredOnly?: boolean
  multiSelect?: DropdownProps['multiSelect']
}

export const IconSelect = forwardRef<DropdownRef, IconSelectProps>(
  ({ value, onChange, featured = [], multiSelect, featuredOnly, ...props }, ref) => {
    const dropdownOptions = useMemo(() => {
      const dropdownOptions = []

      // either uses user set icons or all icons from iconSet
      const iconKeys = featuredOnly ? featured : Object.keys(iconSet)
      // map icon keys to dropdown options (label and value)
      for (const key of iconKeys) {
        dropdownOptions.push({ label: key, value: key as string })
      }
      return dropdownOptions
    }, [])

    const featuredStrings = featured.map((icon) => icon as string)

    // show featured icons first
    dropdownOptions.sort((a, b) => {
      if (featuredStrings.includes(a.value) && !featuredStrings.includes(b.value)) return -1
      if (!featuredStrings.includes(a.value) && featuredStrings.includes(b.value)) return 1
      return 0
    })

    return (
      <Dropdown
        value={value}
        multiSelect={multiSelect}
        valueTemplate={(v, s, o) => <IconTemplate value={(o ? s : v) || []} valueTemplate />}
        options={dropdownOptions}
        itemTemplate={({ value }, isActive, isSelected) => (
          <IconTemplate value={[value]} isActive={isActive} isSelected={isSelected} />
        )}
        onChange={onChange}
        search
        valueStyle={{ width: 150, ...props.valueStyle }}
        style={{ maxWidth: 150, ...props.style }}
        ref={ref}
        {...props}
        maxOptionsShown={Math.max(props.maxOptionsShown || 25, featured.length)}
        minSelected={1}
        widthExpand={false}
      />
    )
  },
)
