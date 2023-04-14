import { forwardRef, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Dropdown, DropdownProps } from '../Dropdown'
import { Icon, IconType, iconSet } from '../Icon'

const IconStyled = styled.div<Pick<IconTemplateProps, 'valueTemplate' | 'isActive'>>`
  display: flex;
  align-items: center;
  /* justify-content: center; */

  gap: 8px;
  padding-left: 0.5rem;

  height: 30px;

  span:last-child {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* valueTemplate */
  ${({ valueTemplate }) =>
    valueTemplate
      ? css`
          color: var(--color-text);
          border: 1px solid var(--color-grey-03);
          background-color: var(--color-grey-00);

          width: 150px;
        `
      : css`
          width: 100%;
        `}

  /* isActive */
    ${({ isActive }) =>
    isActive &&
    css`
      background: rgba(100, 181, 246, 0.16);
    `}
`

export interface IconTemplateProps {
  value: IconSelectProps['value']
  valueTemplate?: boolean
  isActive?: boolean
  isSelected?: boolean
}

const IconTemplate = ({ value, valueTemplate, isActive, isSelected }: IconTemplateProps) => {
  return (
    <IconStyled valueTemplate={valueTemplate} isActive={isSelected}>
      {value.map((icon) => (
        <Icon key={icon} icon={icon} />
      ))}
      {value.length < 2 && <span>{value}</span>}
    </IconStyled>
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

export const IconSelect = forwardRef<HTMLDivElement, IconSelectProps>(
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
        valueTemplate={() => <IconTemplate value={value} valueTemplate />}
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
      />
    )
  },
)
