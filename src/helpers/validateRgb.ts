type RGBValidationResult = {
  isValid: boolean
  values?: [number, number, number]
}

function validateRGB(rgbString: string): RGBValidationResult {
  // Regular expression to match the pattern of rgb(x, y, z) where x, y, z are 0-255
  const rgbPattern = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i

  // Test the string against the regex
  const match = rgbString.match(rgbPattern)

  if (!match) {
    return { isValid: false }
  }

  // Extract the R, G, B values and ensure they are within the 0-255 range
  const [_, rStr, gStr, bStr] = match
  const r = parseInt(rStr, 10)
  const g = parseInt(gStr, 10)
  const b = parseInt(bStr, 10)

  const isValid = [r, g, b].every((value) => value >= 0 && value <= 255)

  if (isValid) {
    return { isValid: true, values: [r, g, b] }
  } else {
    return { isValid: false }
  }
}

export default validateRGB
