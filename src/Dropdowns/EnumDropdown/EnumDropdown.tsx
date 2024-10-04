import { forwardRef } from 'react'
import * as Styled from './EnumDropdown.styled'
import { DefaultValueTemplateProps, Dropdown, DropdownProps, DropdownRef } from '../Dropdown'
import { Icon, IconType } from '../../Icon'
import clsx from 'clsx'

export interface EnumTemplateProps extends Omit<DefaultValueTemplateProps, 'value'> {
  option: EnumDropdownOption | null | undefined
  isSelected?: boolean
  isChanged?: boolean
}

export const EnumTemplate = ({ option, isSelected, isChanged, ...props }: EnumTemplateProps) => {
  const { value, label, icon, color } = option || {}
  return (
    <Styled.Option
      className={clsx({ selected: isSelected, isChanged }, props.className)}
      id={String(value)}
      $color={color}
      {...props}
    >
      {icon && <Icon icon={icon} />}
      <span className="value-label">{label}</span>
    </Styled.Option>
  )
}

export type EnumDropdownOption = {
  value: string | number | boolean
  label: string
  icon?: IconType
  color?: string
}

export interface EnumDropdownProps
  extends Omit<DropdownProps, 'value' | 'options' | 'valueTemplate' | 'itemTemplate' | 'ref'> {
  options: EnumDropdownOption[]
  colorInverse?: boolean
  value: (string | number | boolean)[]
}

export const EnumDropdown = forwardRef<DropdownRef, EnumDropdownProps>(
  ({ colorInverse, value, itemStyle, ...props }, ref) => {
    return (
      <Dropdown
        ref={ref}
        valueTemplate={(v, s, o) => {
          const option = props.options.find((op) => op.value === v[0])
          return (
            <Styled.StyledDefaultValueTemplate
              isOpen={o}
              {...props}
              value={value?.map((v) => String(v))}
              $color={props.isChanged ? undefined : option?.color} // use color (but not when in changed state - editor)
              className={clsx({ inverse: colorInverse })}
            >
              <EnumTemplate option={option} isChanged={props.isChanged} />
            </Styled.StyledDefaultValueTemplate>
          )
        }}
        itemTemplate={(option, isSelected) => (
          <EnumTemplate
            option={option}
            isSelected={isSelected}
            style={{ paddingLeft: '0.5rem', paddingRight: '12px', ...itemStyle }}
          />
        )}
        value={value?.map((v) => String(v))}
        {...props}
      />
    )
  },
)
