// takes a color hex value and returns a number between 0-1
const hexToFloat = (hex) =>
  Math.max(Math.min(Math.round((parseInt(hex, 16) / 255) * 100) / 100, 1), 0)

export default hexToFloat
