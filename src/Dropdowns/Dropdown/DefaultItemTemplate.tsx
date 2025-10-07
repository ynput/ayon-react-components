import { HTMLAttributes } from 'react'
import clsx from 'clsx'
import styled from 'styled-components'
import { Icon } from '../../Icon'

export const DefaultItemStyled = styled.span`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 32px;
  padding: 0 8px;

  &.selected {
    background-color: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);

    &:hover {
      background-color: var(--md-sys-color-primary-container-hover);
    }

    &.error {
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);

      &:hover {
        background-color: var(--md-sys-color-error-container-hover);
      }
    }
  }

  .remove {
    margin-left: auto;
    margin-right: 4px;
  }
`

export interface DefaultItemTemplateProps extends HTMLAttributes<HTMLSpanElement> {
  option: any
  dataKey: string
  labelKey: string
  selected?: string[]
  mixedSelected?: string[]
  value: string[] | null
  multiSelect?: boolean
  minSelected?: number
  itemClassName?: string
  itemStyle?: React.CSSProperties
  endContent?: React.ReactNode
  startContent?: React.ReactNode
}

export const DefaultItemTemplate = ({
  option,
  dataKey,
  labelKey,
  selected = [],
  mixedSelected = [],
  value,
  multiSelect,
  minSelected = 0,
  itemClassName,
  itemStyle,
  endContent,
  startContent,
  className,
  ...props
}: DefaultItemTemplateProps) => {
  return (
    <DefaultItemStyled
      {...props}
      className={clsx('option-child', className, itemClassName, {
        selected: !!selected?.includes(option[dataKey]),
        active: value && value.includes(option[dataKey]),
        error: !!option.error,
      })}
      style={itemStyle}
    >
      {startContent}
      {option.icon && <Icon icon={option.icon} />}
      <span>{option[labelKey] || option[dataKey]}</span>
      {multiSelect &&
        [...selected, ...mixedSelected]?.includes(option[dataKey]) &&
        selected.length > minSelected && <Icon icon={'close'} className="remove" />}
      {endContent}
    </DefaultItemStyled>
  )
}
