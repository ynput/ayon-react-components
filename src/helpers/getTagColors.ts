import { getTextColor } from './getTextColor'
import {
  ensureContrast,
  fromLightness,
  MIN_CONTRAST_TEXT,
  parseColor,
  rgbToOklab,
  toHex,
  UserColor,
} from './readableColor'

export type TagColors = { background: string; border: string; text: string }

type Tone = readonly [lightness: number, chroma: number]

// OKLCH lightness of each part of a chip on each theme, and the share of the tag colour's chroma it keeps:
// a tint of the colour behind text in a shade of it, light on dark and dark on light
const TONES: Record<'light' | 'dark', Record<keyof TagColors, Tone>> = {
  light: { background: [0.965, 0.3], border: [0.92, 0.6], text: [0.5, 1] },
  dark: { background: [0.34, 0.4], border: [0.39, 0.6], text: [0.9, 0.8] },
}

const getThemeColors = (color: string, theme: 'light' | 'dark'): TagColors => {
  const rgb = parseColor(color)
  if (!rgb) return { background: color, border: color, text: getTextColor(color) }

  const [L, a, b] = rgbToOklab(rgb)
  const tones = TONES[theme]
  const tone = ([lightness, chroma]: Tone) =>
    toHex(fromLightness(lightness, a * chroma, b * chroma))
  const background = tone(tones.background)
  // a tag colour already further from the background than the text tone keeps its lightness
  const [textLightness, textChroma] = tones.text
  const text = tone([
    theme === 'light' ? Math.min(L, textLightness) : Math.max(L, textLightness),
    textChroma,
  ])
  return {
    background,
    border: tone(tones.border),
    text: ensureContrast(text, background, MIN_CONTRAST_TEXT),
  }
}

const cache = new Map<string, TagColors>()

/**
 * Colours for a chip in a user-defined colour (tags, multi-select values, ...): a tint of the colour
 * with a border a step stronger, and the text in a shade of it, dark on light and light on dark.
 *
 * Takes the colour, or the item with its `color` and `colorLight`; light starts from `colorLight` when set.
 * Each value is a CSS `light-dark()` pair. `color` may be one too, to start each theme from its own colour.
 */
export const getTagColors = (value: string | UserColor): TagColors => {
  const { color: given, colorLight } = typeof value === 'string' ? { color: value } : value
  const color = given ?? ''
  const key = `${color}|${colorLight ?? ''}`
  let result = cache.get(key)
  if (!result) {
    const pair = /^light-dark\(\s*([^,]+?)\s*,\s*([^)]+?)\s*\)$/i.exec(color)
    const [lightColor, darkColor] = pair ? [pair[1], pair[2]] : [colorLight || color, color]
    const light = getThemeColors(lightColor, 'light')
    const dark = getThemeColors(darkColor, 'dark')
    result = {
      background: `light-dark(${light.background}, ${dark.background})`,
      border: `light-dark(${light.border}, ${dark.border})`,
      text: `light-dark(${light.text}, ${dark.text})`,
    }
    cache.set(key, result)
  }
  return result
}
