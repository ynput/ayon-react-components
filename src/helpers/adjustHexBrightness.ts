import rgbToHsl from './rgbToHSL'
import validateHexColor from './validateHexColor'
import validateRGB from './validateRgb'

const adjustHexBrightness = (color: string, percentage: number): string => {
  // first check for valid hex color
  const validHex = validateHexColor(color)

  let r = 0,
    g = 0,
    b = 0
  if (!validHex) {
    // check for rgb value
    const { isValid, values } = validateRGB(color)

    if (isValid && values) {
      ;[r, g, b] = values
    } else {
      console.error('Invalid hex or rgb color:', color)
      return color
    }
  }

  if (validHex) {
    // Convert HEX to RGB
    r = parseInt(color.slice(1, 3), 16)
    g = parseInt(color.slice(3, 5), 16)
    b = parseInt(color.slice(5, 7), 16)
  }

  // Convert RGB to HSL
  const [h, s, l] = rgbToHsl(r, g, b)

  // Increase lightness by the specified percentage
  const newL = Math.round(Math.min(100, l + percentage))

  // Convert HSL
  return `hsl(${h}, ${s}%, ${newL}%)`
}

export default adjustHexBrightness
