import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { Panel } from '../../Panels/Panel'
import { Droppable } from './Droppable'
import { Draggable } from './Draggable'
import { EntityCardProps } from '../EntityCard'
import { useMemo, useState } from 'react'
import getRandomImage from '../../helpers/getRandomImage'

const DnDTemplate = (props: EntityCardProps) => {
  const [activeCard, setActiveCard] = useState('')
  const [columns, setColumns] = useState<
    {
      id: string
      items: string[]
    }[]
  >([
    { id: '1', items: ['1'] },
    { id: '2', items: ['2', '3'] },
    { id: '3', items: [] },
  ])

  const cards = useMemo(() => {
    const cards: EntityCardProps[] = [
      {
        id: '1',
        ...props,
        imageUrl: getRandomImage(),
      },
      {
        id: '2',
        ...props,
        imageUrl: getRandomImage(),
      },
      {
        id: '3',
        ...props,
        imageUrl: getRandomImage(),
      },
    ]

    return cards
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleOnClick = (id: string) => {
    // if dif id, set active card
    if (id !== activeCard) {
      setActiveCard(id)
    } else {
      // if same id, clear active card
      setActiveCard('')
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    // get over id
    const { active, over } = event
    // if different id, move card
    const activeCardId = active.id?.toString()
    const overColumnId = over?.id?.toString()

    if (!activeCardId || !overColumnId) return

    // find the column id of the card
    const activeColumnId = columns.find((column) => column.items.includes(activeCardId))?.id

    if (!activeColumnId) return

    // if same column, do nothing
    if (activeColumnId === overColumnId) return

    // remove card from active column
    const newColumns = columns.map((column) => {
      if (column.id === activeColumnId) {
        return {
          ...column,
          items: column.items.filter((item) => item !== activeCardId),
        }
      }
      return column
    })

    // add card to new column
    const newColumn = newColumns.find((column) => column.id === overColumnId)
    if (newColumn) {
      newColumn.items.push(activeCardId)
    }

    setColumns(newColumns)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={() => console.log('start')}
      onDragEnd={handleDragEnd}
    >
      <Panel style={{ flexDirection: 'row' }}>
        {columns.map(({ id, items }) => (
          <Droppable id={id} key={id}>
            {items.map((cardId) => {
              const card = cards.find((card) => card.id === cardId)
              if (!card) return null
              return (
                <Draggable
                  key={cardId}
                  id={cardId}
                  {...card}
                  onClick={() => handleOnClick(cardId)}
                  isActive={cardId === activeCard}
                />
              )
            })}
          </Droppable>
        ))}
      </Panel>
    </DndContext>
  )
}

export default DnDTemplate
