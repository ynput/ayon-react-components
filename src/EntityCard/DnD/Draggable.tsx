import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { EntityCard, EntityCardProps } from '../EntityCard'

interface DraggableProps extends EntityCardProps {
  id: string
}

export function Draggable(props: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: props.id,
  })
  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1000 : undefined,
  }

  return (
    <EntityCard
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={props.onClick}
      isDragging={isDragging}
    />
  )
}
