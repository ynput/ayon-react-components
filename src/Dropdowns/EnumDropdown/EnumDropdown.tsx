import { forwardRef } from 'react'
import * as Styled from './EnumDropdown.styled'
import { DefaultValueTemplateProps, Dropdown, DropdownProps, DropdownRef } from '../Dropdown'
import { Icon, IconImage, IconPropType, IconType, isIconImage } from '../../Icon'
import clsx from 'clsx'
import { getTagColors } from '../../helpers'

export interface EnumTemplateProps extends Omit<DefaultValueTemplateProps, 'value'> {
  option: EnumDropdownOption | null | undefined
  isSelected?: boolean
  isChanged?: boolean
  // the value already sits on its colour (an inverse dropdown), so it needs no pill
  onColor?: boolean
}

export const EnumTemplate = ({
  option,
  isSelected,
  isChanged,
  onColor,
  ...props
}: EnumTemplateProps) => {
  const { value, label, icon, color } = option || {}
  // a coloured value is a pill tinted with its colour, like a tag, never coloured text
  const pill = color && !isChanged && !onColor ? getTagColors(color) : undefined
  const content = (
    <>
      {icon && (isIconImage(icon) ? <IconImage icon={icon} /> : <Icon icon={icon as IconType} />)}
      <span className="value-label">{label}</span>
    </>
  )
  return (
    <Styled.Option
      className={clsx({ selected: isSelected, isChanged }, props.className)}
      id={String(value)}
      {...props}
    >
      {pill ? (
        <Styled.Pill
          style={{
            color: pill.text,
            backgroundColor: pill.background,
            boxShadow: `inset 0 0 0 1px ${pill.border}`,
          }}
        >
          {content}
        </Styled.Pill>
      ) : (
        content
      )}
    </Styled.Option>
  )
}

export type EnumDropdownOption = {
  value: string | number | boolean
  label: string
  icon?: IconPropType
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
              <EnumTemplate option={option} isChanged={props.isChanged} onColor={colorInverse} />
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
