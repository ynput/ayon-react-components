import { getContrastRatio, getLuminance, MIN_CONTRAST_TEXT, parseColor } from './readableColor'

// A filled colour keeps its value on both themes, so the text on it must not follow the theme:
// these are the light theme's (dark) and the dark theme's (light) on-surface colours.
const DARK_TEXT = 'var(--md-sys-color-on-surface-light)'
const LIGHT_TEXT = 'var(--md-sys-color-on-surface-dark)'
const DARK_TEXT_LUMINANCE = getLuminance(parseColor('#1A1E23')!)

// text colour for a background filled with `backgroundColor` (a status pill, a tag, ...),
// which may be a light-dark() pair, e.g. from getReadableColor
export const getTextColor = (backgroundColor?: string): string => {
  const pair = /^light-dark\(\s*([^,]+?)\s*,\s*([^)]+?)\s*\)$/i.exec(backgroundColor ?? '')
  if (pair) return `light-dark(${getTextColor(pair[1])}, ${getTextColor(pair[2])})`

  const rgb = parseColor(backgroundColor || '#353B46')
  if (!rgb) return DARK_TEXT

  return getContrastRatio(getLuminance(rgb), DARK_TEXT_LUMINANCE) >= MIN_CONTRAST_TEXT
    ? DARK_TEXT
    : LIGHT_TEXT
}
