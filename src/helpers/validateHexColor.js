const validateHexColor = (newValue, oldValue) => {
  // ^# first character match #
  // [0-9a-f]{3} match exactly 3 chars between 0-9 and a-f
  // {1,2}  match 3 chars 1 or 2 times
  // /i ignore case
  const hexReg = /^#([0-9a-f]{3}){1,2}$/i
  // if fails use initValue
  if (!hexReg.test(newValue)) newValue = oldValue

  return newValue
}

export default validateHexColor
