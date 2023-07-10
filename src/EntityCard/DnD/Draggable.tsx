import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'

export function Draggable(props: { children: React.ReactNode; id: string | number }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  })
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  }

  const childrenWithProps = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ref: setNodeRef,
        style: style,
        ...listeners,
        ...attributes,
      })
    }
    return child
  })

  return <>{childrenWithProps}</>
}
