import { useDraggable, useDroppable } from '@dnd-kit/core'
import styled, { css } from 'styled-components'

interface DroppableStyledProps {
  $isOver: boolean
  $isOverSelf: boolean
  $active: boolean
}

const StyledColumn = styled.div<DroppableStyledProps>`
  --min-height: 125px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 211px;
  height: 100%;
  min-height: var(--min-height);
  padding: 8px;
  gap: 8px;
  border-radius: 16px;
  background-color: var(--md-sys-color-surface-container-lowest);
  overflow: ${({ $active }) => ($active ? 'visible' : 'auto')};

  /* when a card is hovering over the top */
  & > *:last-child {
    margin-bottom: 0;
    transition: margin-bottom 0.1s ease-in-out;
  }
  ${({ $isOverSelf, $isOver }) =>
    $isOver &&
    !$isOverSelf &&
    css`
      /* last child margin bottom */
      & > *:last-child {
        margin-bottom: calc(var(--min-height) - 8px);
      }
    `}

  ${({ $isOver }) =>
    $isOver &&
    css`
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background-color: white;
        opacity: 0.05;
        z-index: 500;
        border-radius: 16px;
      }
    `}
`

interface DroppableProps {
  children: React.ReactNode
  id: string
  columns: {
    id: string
    items: string[]
  }[]
}

export function Droppable(props: DroppableProps) {
  const { isOver, setNodeRef, active, over } = useDroppable({
    id: props.id,
  })

  // find out which column the active card has come from
  const activeColumn = props.columns.find((column) => column.items.includes(active?.id as string))

  const isOverSelf = over?.id === activeColumn?.id

  return (
    <StyledColumn ref={setNodeRef} $isOver={isOver} $active={!!active} $isOverSelf={isOverSelf}>
      {props.children}
    </StyledColumn>
  )
}
