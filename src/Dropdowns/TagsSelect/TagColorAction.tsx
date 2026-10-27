import * as Styled from './TagsSelect.styled'

// colours offered for a tag that has none
export const TAG_COLORS = [
  '#ff2450',
  '#ff8f3f',
  '#ffc83d',
  '#7bd35f',
  '#5be1c6',
  '#3ec7ff',
  '#5b8cff',
  '#a97bff',
  '#ff7bd5',
]

export interface TagColorActionProps {
  isPicking: boolean
  colors?: string[]
  label: string
  // the click on a colour also reaches the option, e.g. so the "add new" option adds the tag
  passClick?: boolean
  onOpen: () => void
  onPick: (color: string) => void
}

// a button on a tag without a colour, which opens a row of colours to save the tag with
export const TagColorAction = ({
  isPicking,
  colors = TAG_COLORS,
  label,
  passClick,
  onOpen,
  onPick,
}: TagColorActionProps) => {
  if (!isPicking) {
    return (
      <Styled.ColorAction
        type="button"
        className="color-action"
        icon="palette"
        variant="text"
        data-tooltip={label}
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation()
          onOpen()
        }}
      />
    )
  }

  return (
    <Styled.Swatches className="color-swatches">
      {colors.map((color) => (
        <Styled.Swatch
          key={color}
          type="button"
          style={{ backgroundColor: color }}
          aria-label={color}
          onClick={(e) => {
            if (!passClick) e.stopPropagation()
            onPick(color)
          }}
        />
      ))}
    </Styled.Swatches>
  )
}
