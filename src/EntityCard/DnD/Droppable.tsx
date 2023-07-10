import { useDroppable } from '@dnd-kit/core'

export function Droppable(props: { children: React.ReactNode; id: string | number }) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  })

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 250 + 16,
    height: 500 + 16 + 8,
    padding: 16,
    gap: 8,
  }

  const style = {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: isOver ? 'green' : 'white',
    ...columnStyle,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}
