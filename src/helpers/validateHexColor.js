const HEX_RE = /^#[0-9a-f]{6}$/i
const HEX_SHORT_RE = /^#[0-9a-f]{3}$/i

const validateHexColor = (newValue, oldValue) => {
  let finalValue = newValue

  if (HEX_SHORT_RE.test(newValue)) {
    // if the new value is a short hex color, convert it to long hex color
    finalValue = `#${newValue[1]}${newValue[1]}${newValue[2]}${newValue[2]}${newValue[3]}${newValue[3]}`
  }

  // if fails use initValue
  if (!HEX_RE.test(finalValue)) {
    finalValue = oldValue
  }
  return finalValue
}

export default validateHexColor
