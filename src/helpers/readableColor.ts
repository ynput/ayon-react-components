// Keeps user-defined colours (statuses, task types, tags, ...) readable on both themes.
// A colour is only changed when its WCAG contrast against the theme surface is below the minimum.
// Then its OKLCH lightness moves just far enough, keeping the hue and as much chroma as sRGB allows,
// so a studio's palette still looks like itself.

type RGB = [number, number, number] // sRGB channels, 0-1

// WCAG AA: 4.5:1 for text, 3:1 for icons and other graphics
export const MIN_CONTRAST_TEXT = 4.5
export const MIN_CONTRAST_ICON = 3

// The surface coloured text is measured against: --md-sys-color-surface-container-{light,dark} (tokens.css).
// Panels are a step further from the text colour on both themes, so they pass too.
export const READABLE_SURFACES = { light: '#EEF1F4', dark: '#272D35' } as const

export const parseColor = (color: string): RGB | null => {
  const value = color.trim()
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value)?.[1]
  if (hex) {
    const full = hex.length <= 4 ? [...hex].map((c) => c + c).join('') : hex
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255) as RGB
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(value)
  if (rgb) return [1, 2, 3].map((i) => Math.min(1, Number(rgb[i]) / 255)) as RGB
  return null
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

// WCAG relative luminance
export const getLuminance = (rgb: RGB): number => {
  const [r, g, b] = rgb.map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const getContrastRatio = (l1: number, l2: number): number =>
  (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

// OKLab, https://bottosson.github.io/posts/oklab/
const rgbToOklab = (rgb: RGB): RGB => {
  const [r, g, b] = rgb.map(toLinear)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

// linear sRGB, may fall outside 0-1 when the colour is out of gamut
const oklabToLinear = ([L, a, b]: RGB): RGB => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

const inGamut = (rgb: RGB) => rgb.every((c) => c >= -1e-4 && c <= 1 + 1e-4)

// colour at lightness L with the given hue, reducing chroma until it fits sRGB
const fromLightness = (L: number, a: number, b: number): RGB => {
  let scale = 1
  if (!inGamut(oklabToLinear([L, a, b]))) {
    let lo = 0
    let hi = 1
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2
      if (inGamut(oklabToLinear([L, a * mid, b * mid]))) lo = mid
      else hi = mid
    }
    scale = lo
  }
  // rounded to 8 bits, so the contrast checked is the contrast of the hex we return
  return oklabToLinear([L, a * scale, b * scale]).map(
    (c) => Math.round(toGamma(Math.min(1, Math.max(0, c))) * 255) / 255,
  ) as RGB
}

const toHex = (rgb: RGB) =>
  '#' +
  rgb
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')

/**
 * `color` adjusted to have at least `minContrast` against `background`.
 * Returned as given when it already passes or can't be parsed (CSS variables, named colours).
 */
export const ensureContrast = (
  color: string,
  background: string,
  minContrast: number = MIN_CONTRAST_TEXT,
): string => {
  const rgb = parseColor(color)
  const bg = parseColor(background)
  if (!rgb || !bg) return color

  const bgLuminance = getLuminance(bg)
  const passes = (c: RGB) => getContrastRatio(getLuminance(c), bgLuminance) >= minContrast
  if (passes(rgb)) return color

  // move towards black on light surfaces, towards white on dark ones
  const darken = getContrastRatio(0, bgLuminance) >= getContrastRatio(1, bgLuminance)
  const [L, a, b] = rgbToOklab(rgb)
  const end = darken ? 0 : 1
  // smallest step along the lightness axis that passes (the far end, black or white, always does)
  let lo = 0
  let hi = 1
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    if (passes(fromLightness(L + (end - L) * mid, a, b))) hi = mid
    else lo = mid
  }
  return toHex(fromLightness(L + (end - L) * hi, a, b))
}

const cache = new Map<string, string>()

/**
 * A user-defined colour (status, task type, tag, ...) that reads on whichever theme is showing.
 * Use it for text and icons; filled backgrounds keep the original colour and pair it with getTextColor.
 *
 * Returns the colour unchanged when it reads on both themes, otherwise a CSS `light-dark()` value,
 * so it follows the theme (including nested data-theme scopes) without a re-render.
 */
export function getReadableColor(color: string, minContrast?: number): string
export function getReadableColor(
  color: string | undefined,
  minContrast?: number,
): string | undefined
export function getReadableColor(
  color: string | undefined,
  minContrast: number = MIN_CONTRAST_TEXT,
): string | undefined {
  if (!color) return color
  const key = `${color}|${minContrast}`
  let result = cache.get(key)
  if (result === undefined) {
    const light = ensureContrast(color, READABLE_SURFACES.light, minContrast)
    const dark = ensureContrast(color, READABLE_SURFACES.dark, minContrast)
    result = light === color && dark === color ? color : `light-dark(${light}, ${dark})`
    cache.set(key, result)
  }
  return result
}
