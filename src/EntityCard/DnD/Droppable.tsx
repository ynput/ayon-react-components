import { useDroppable } from '@dnd-kit/core'
import * as Styled from './Droppable.styled'
import React, { useEffect, useRef, useState } from 'react'

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

  // calculate the number of children
  const childrenCount = React.Children.count(props.children)

  const [isScrolling, setIsScrolling] = useState(false)
  const itemsRef = useRef<HTMLDivElement>(null)
  // figure if the column items are overflowing and scrolling
  useEffect(() => {
    const el = itemsRef.current
    if (!el) return
    // now work out if the items are overflowing
    const isOverflowing = el.scrollHeight > el.clientHeight
    setIsScrolling(isOverflowing)
  }, [itemsRef.current, childrenCount])

  // find out which column the active card has come from
  const activeColumn = props.columns.find((column) => column.items.includes(active?.id as string))
  const isColumnActive = activeColumn?.id === props.id
  const isOverSelf = over?.id === activeColumn?.id

  return (
    <Styled.Column ref={setNodeRef} $isOver={isOver} $active={!!active} $isOverSelf={isOverSelf}>
      <Styled.Header>
        <h3>Header - {childrenCount}</h3>
      </Styled.Header>
      <Styled.Items
        className="items"
        ref={itemsRef}
        $isScrolling={isScrolling}
        $isColumnActive={isColumnActive}
        $active={!!active}
      >
        {props.children}
      </Styled.Items>
    </Styled.Column>
  )
}
