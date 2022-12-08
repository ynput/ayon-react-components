// converts a int8 (0-255) to a hex value
const int8ToHex = (value) => Math.min(Math.max(value, 0), 255).toString(16)

export default int8ToHex
