// conversions for different formats to HEX color format

import floatToInt8 from './floatToInt8'
import int8ToHex from './int8ToHex'

const toHexColor = (value = [], format) => {
  const formats = ['float', 'uint8', 'uint16']

  // return error if format is not supported
  if (!formats.includes(format)) return console.error(`Format: ${format} is not supported`)

  //   between 0 - 255
  let int8 = []

  //   between 0-1
  const hasAlpha = value.length === 4
  let alpha
  if (hasAlpha) {
    // clamp alpha to between 0-1
    alpha = Math.max(Math.min([...value].pop(), 1), 0)
    // convert alpha float to hex string
    alpha = int8ToHex(floatToInt8(alpha))
  }

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
  const hex = '#' + int8ToHex(int8[0]) + int8ToHex(int8[1]) + int8ToHex(int8[2])
  // add alpha to the end if required
  if (alpha) hex + alpha

  return hex
}

export default toHexColor
