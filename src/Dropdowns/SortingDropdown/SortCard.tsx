import { forwardRef } from 'react'
import { SortCardType } from './SortingDropdown'
import { Icon } from '../../Icon'
import * as Styled from './SortCard.styled'
import clsx from 'clsx'

interface SortCardProps extends SortCardType, Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  onRemove: () => void
  onSortBy: () => void
  disabled?: boolean
}

const SortCard = forwardRef<HTMLDivElement, SortCardProps>(
  ({ id, label, sortOrder, onRemove, onSortBy, disabled, ...props }, ref) => {
    return (
      <Styled.Card
        {...props}
        ref={ref}
        tabIndex={0}
        $disabled={!!disabled}
        className={clsx('sort-chip', props.className)}
      >
        <Icon
          icon="close"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="remove action"
          tabIndex={0}
          id="remove"
        />
        <span>{label}</span>
        <Styled.SortWrapper
          className="sort-order action"
          onClick={(e) => {
            e.stopPropagation()
            onSortBy()
          }}
          tabIndex={0}
        >
          <Icon
            icon={'arrow_right'}
            style={{
              transform: sortOrder ? 'rotate(90deg)' : 'rotate(270deg)',
              transition: 'transform 0.2s ease-in-out',
            }}
          />
        </Styled.SortWrapper>
      </Styled.Card>
    )
  },
)

export default SortCard
