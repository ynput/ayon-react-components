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
  // show the value as a pill tinted with its colour, like a tag
  tinted?: boolean
}

export const EnumTemplate = ({
  option,
  isSelected,
  isChanged,
  tinted,
  ...props
}: EnumTemplateProps) => {
  const { value, label, icon, color, colorLight } = option || {}
  const pill = tinted && color && !isChanged ? getTagColors({ color, colorLight }) : undefined
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
      $color={pill ? undefined : color}
      $colorLight={colorLight}
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
  colorLight?: string
}

export interface EnumDropdownProps
  extends Omit<DropdownProps, 'value' | 'options' | 'valueTemplate' | 'itemTemplate' | 'ref'> {
  options: EnumDropdownOption[]
  colorInverse?: boolean
  // values are pills tinted with their colour, like tags
  tinted?: boolean
  value: (string | number | boolean)[]
}

export const EnumDropdown = forwardRef<DropdownRef, EnumDropdownProps>(
  ({ colorInverse, tinted, value, itemStyle, ...props }, ref) => {
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
              <EnumTemplate option={option} isChanged={props.isChanged} tinted={tinted} />
            </Styled.StyledDefaultValueTemplate>
          )
        }}
        itemTemplate={(option, isSelected) => (
          <EnumTemplate
            option={option}
            isSelected={isSelected}
            tinted={tinted}
            style={{ paddingLeft: '0.5rem', paddingRight: '12px', ...itemStyle }}
          />
        )}
        value={value?.map((v) => String(v))}
        {...props}
      />
    )
  },
)
