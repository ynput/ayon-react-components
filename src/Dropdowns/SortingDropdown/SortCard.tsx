import { forwardRef } from 'react'
import { SortCardType } from './SortingDropdown'
import { Icon } from '../../Icon'
import styled, { css } from 'styled-components'

const StyledCard = styled.div<{ $disabled: boolean }>`
  background-color: var(--button-background);

  /* layout */
  display: flex;
  padding: 0px 4px;
  justify-content: center;
  align-items: center;
  min-height: unset;
  gap: 0;
  overflow: hidden;

  /* styling */
  border-radius: 9px;
  pointer-events: all;

  .remove {
    border-radius: 100%;
    padding: 0;
    margin-right: 4px;
    font-size: 16px;
    background-color: var(--color-grey-01);
  }

  /* prevent hover when disabled */
  ${({ $disabled }) =>
    $disabled
      ? css`
          pointer-events: none;
        `
      : css`
          :hover {
            background-color: var(--button-background-hover);
          }

          .remove {
            :hover {
              background-color: var(--panel-background);
            }
          }
        `}
`

interface SortCardProps extends SortCardType, Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  onRemove: () => void
  disabled?: boolean
}

const SortCard = forwardRef<HTMLDivElement, SortCardProps>(
  ({ id, label, sortOrder, onRemove, disabled, ...props }, ref) => {
    return (
      <StyledCard {...props} ref={ref} tabIndex={0} $disabled={!!disabled}>
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
      </StyledCard>
    )
  },
)

export default SortCard
