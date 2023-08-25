import { forwardRef } from 'react'
import { SortCardType } from './SortingDropdown'
import { Icon } from '../../Icon'
import * as Styled from './SortCard.styled'

interface SortCardProps extends SortCardType, Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  onRemove: () => void
  disabled?: boolean
}

const SortCard = forwardRef<HTMLDivElement, SortCardProps>(
  ({ id, label, sortOrder, onRemove, disabled, ...props }, ref) => {
    return (
      <Styled.Card {...props} ref={ref} tabIndex={0} $disabled={!!disabled}>
        <Icon
          icon="close"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="remove"
          tabIndex={0}
          id="remove"
        />
        <span>{label}</span>
        <Icon
          icon={'arrow_right'}
          style={{
            transform: sortOrder ? 'rotate(90deg)' : 'rotate(270deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
          className="sort-order"
        />
      </Styled.Card>
    )
  },
)

export default SortCard
