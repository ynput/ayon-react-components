// conversions for different formats to HEX color format
const toHexColor = (value: number[] = [], format: string) => {
  const formats = ['float', 'uint8', 'uint16']

  // return error if format is not supported
  if (!formats.includes(format)) return console.error(`Format: ${format} is not supported`)

  //   between 0 - 255
  let int8 = []

  // normalise all formats down to a 8bit int between 0-255 (hex is 8bit)
  if (format === 'float') {
    // value is float 0-1
    int8 = value.map((v) => v * 255)
  } else if (format === 'uint16') {
    // value is int16
    int8 = value.map((v) => (v / 65535) * 255)
  } else {
    // format must be int8 already
    int8 = value
  }

  //   ensure int8 is a whole interger between 0-255
  int8 = int8.map((v) => Math.max(Math.min(Math.round(v), 255), 0))

  // convert int8 to hex for each channel
  const hex = '#' + ((1 << 24) | (int8[0] << 16) | (int8[1] << 8) | int8[2]).toString(16).slice(1)

  return hex
}

export default toHexColor
