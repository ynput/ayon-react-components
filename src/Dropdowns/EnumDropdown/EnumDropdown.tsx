import { forwardRef, useMemo } from 'react'
import * as Styled from './EnumDropdown.styled'
import { DefaultValueTemplate, Dropdown, DropdownProps, DropdownRef } from '../Dropdown'
import { Icon, IconType } from '../../Icon'
import clsx from 'clsx'

export interface EnumTemplateProps {
  option: EnumDropdownOption | null | undefined
  isSelected?: boolean
}

const EnumTemplate = ({ option, isSelected }: EnumTemplateProps) => {
  const { value, label, icon, color } = option || {}
  return (
    <Styled.Option className={clsx({ selected: isSelected })} id={value} $color={color}>
      {icon && <Icon icon={icon} />}
      <span className="value-label">{label}</span>
    </Styled.Option>
  )
}

export type EnumDropdownOption = {
  value: string
  label: string
  icon?: IconType
  color?: string
}

export interface EnumDropdownProps
  extends Omit<DropdownProps, 'options' | 'valueTemplate' | 'itemTemplate' | 'ref'> {
  options: EnumDropdownOption[]
  colorInverse?: boolean
}

export const EnumDropdown = forwardRef<DropdownRef, EnumDropdownProps>(
  ({ colorInverse, ...props }, ref) => {
    return (
      <Dropdown
        ref={ref}
        valueTemplate={(v, s, o) => {
          const option = props.options.find((op) => op.value === v[0])
          return (
            <Styled.StyledDefaultValueTemplate
              isOpen={o}
              {...props}
              $color={option?.color}
              className={clsx({ inverse: colorInverse })}
            >
              <EnumTemplate option={option} />
            </Styled.StyledDefaultValueTemplate>
          )
        }}
        itemTemplate={(option, isSelected) => (
          <EnumTemplate option={option} isSelected={isSelected} />
        )}
        {...props}
      />
    )
  },
)
