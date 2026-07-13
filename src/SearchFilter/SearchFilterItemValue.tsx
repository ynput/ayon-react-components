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

  /* allow the chip to shrink below its content so the label can ellipsis */
  min-width: 0;

  .icon {
    flex-shrink: 0;
  }

  img {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* cap a long value (e.g. a big custom search) at a readable width, then
     ellipsis. this only affects the static display — while editing the value is
     replaced by an input, which is free to grow into the available bar space. */
  .label {
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* hide label */
  &.compact {
    .label {
      display: none;
    }
  }

  &.custom {
    padding: 0 2px;
    background-color: var(--md-sys-color-surface-container-high-hover);
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
  isCompact?: boolean
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
      isCompact,
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
    const iconOnly = isCompact && (!!icon || !!img)

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
          className={clsx(props.className, { compact: iconOnly, custom: isCustom })}
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
