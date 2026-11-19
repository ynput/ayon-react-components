import { getTagColors, getTextColor } from '../helpers'

// A coloured value is a pill: filled with its colour when `filled` (a status, as in the tables),
// otherwise tinted with it like a tag.
export const getValuePillStyle = (color: string, filled?: boolean): React.CSSProperties => {
  if (filled) return { backgroundColor: color, color: getTextColor(color) }
  const colors = getTagColors(color)
  return {
    color: colors.text,
    backgroundColor: colors.background,
    boxShadow: `inset 0 0 0 1px ${colors.border}`,
  }
}
