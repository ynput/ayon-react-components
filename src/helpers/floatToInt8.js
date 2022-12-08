const floatToInt8 = (value) => Math.max(Math.min(Math.round(value * 255), 255), 0)

export default floatToInt8
