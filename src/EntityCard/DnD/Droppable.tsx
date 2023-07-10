import { useDroppable } from '@dnd-kit/core'
import styled, { css } from 'styled-components'

const StyledColumn = styled.div<{
  $isOver: boolean
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 266px;
  height: 524px;
  padding: 16px;
  gap: 8px;
  border-radius: 8px;

  ${({ $isOver }) =>
    $isOver &&
    css`
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background-color: black;
        opacity: 0.2;
        z-index: 500;
      }
    `}
`

export function Droppable(props: { children: React.ReactNode; id: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  })

  const style = {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: isOver ? 'white' : 'gray',
  }

  return (
    <StyledColumn ref={setNodeRef} style={style} $isOver={isOver}>
      {props.children}
    </StyledColumn>
  )
}
