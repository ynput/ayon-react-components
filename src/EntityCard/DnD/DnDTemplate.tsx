import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Panel } from '../../Panels/Panel'
import { Droppable } from './Droppable'
import { Draggable } from './Draggable'
import { EntityCardProps } from '../EntityCard'
import { useEffect, useMemo, useState } from 'react'
import getRandomImage from '../../helpers/getRandomImage'
import { Section } from '../../Layout/Section'
import KanBanContainer from './KanBanContainer'

interface DnDTemplatesProps extends EntityCardProps {
  columns: {
    id: string
    items: string[]
  }[]
}

const DnDTemplate = (props: DnDTemplatesProps) => {
  const [activeCard, setActiveCard] = useState('')

  const [columns, setColumns] = useState(props.columns || [])

  const [cards, setCards] = useState<EntityCardProps[]>([])

  useEffect(() => {
    console.log('setting card')
    const newCards: EntityCardProps[] = []

    props.columns.forEach((column) => {
      column.items.forEach((itemId) => {
        newCards.push({
          id: itemId,
          ...props,
          imageUrl: getRandomImage(),
        })
      })
    })

    setCards(newCards)
  }, [props.columns])

  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    touchSensor,
    keyboardSensor,
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
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <KanBanContainer>
        {columns.map(({ id, items }) => (
          <Droppable id={id} key={id} columns={columns}>
            {items.map((cardId) => {
              const card = cards.find((card) => card.id === cardId)
              if (!card) return null
              return (
                <Draggable
                  key={cardId}
                  id={cardId}
                  {...card}
                  onActivate={() => handleOnClick(cardId)}
                  isActive={cardId === activeCard}
                />
              )
            })}
          </Droppable>
        ))}
      </KanBanContainer>
    </DndContext>
  )
}

export default DnDTemplate
