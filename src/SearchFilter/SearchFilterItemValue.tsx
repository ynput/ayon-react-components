import { forwardRef } from 'react'
import { FilterOperator, FilterValue } from './types'
import styled from 'styled-components'
import clsx from 'clsx'
import checkColorBrightness from './checkColorBrightness'
import { Icon, IconType } from '../Icon'
import { theme } from '..'

const ValueChip = styled.div`
  display: flex;
  align-items: center;
  gap: var(--base-gap-small);
  border-radius: var(--border-radius-m);

  img {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  /* hide label */
  &.icons {
    .label {
      display: none;
    }
  }

  &.custom {
    padding: 0 2px;
    background-color: var(--md-sys-color-surface-container-high-hover);
    &:hover {
      background-color: var(--md-sys-color-surface-container-highest-hover);
    }
  }
`

const Operator = styled.span`
  ${theme.labelSmall}
  display: flex;
  align-items: center;

  &.clickable {
    cursor: pointer;
    text-decoration: underline;
    border-radius: 4px;
    padding: 0 2px;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--md-sys-color-surface-container-highest-hover);
    }
  }
`

export interface SearchFilterItemValueProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'id' | 'children'>,
    FilterValue {
  operator?: FilterOperator
  isIconOnly?: boolean
  isOperatorChangeable?: boolean
  onOperatorChange?: (event: React.MouseEvent<HTMLSpanElement>) => void
}

export const SearchFilterItemValue = forwardRef<HTMLDivElement, SearchFilterItemValueProps>(
  (
    {
      label,
      img,
      icon,
      color,
      operator,
      isIconOnly,
      isCustom,
      pt,
      isOperatorChangeable,
      onOperatorChange,
      ...props
    },
    ref,
  ) => {
    const colorStyle = color ? color : '#ffffff'
    const adjustedColor = checkColorBrightness(colorStyle, '#353B46')

    // only collapse to icon-only when there's an icon/avatar to show, else keep the text
    const iconOnly = isIconOnly && (!!icon || !!img)

    return (
      <>
        {operator && (
          <Operator
            className={clsx({ clickable: isOperatorChangeable })}
            onClick={isOperatorChangeable ? onOperatorChange : undefined}
          >
            {operator.toLowerCase()}
          </Operator>
        )}
        <ValueChip
          {...props}
          ref={ref}
          className={clsx('value-icon', props.className, { icons: iconOnly, custom: isCustom })}
        >
          {icon && (
            <Icon
              icon={icon as IconType}
              style={{
                color: adjustedColor,
              }}
            />
          )}
          {img && <img src={img} alt={label} />}
          <span
            className="label"
            style={{
              color: pt?.style?.color ?? adjustedColor,
            }}
          >
            {label}
          </span>
        </ValueChip>
      </>
    )
  },
)
