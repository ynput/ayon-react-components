const floatToInt16 = (value) => Math.max(Math.min(Math.round(value * 65535), 65535), 0)

export default floatToInt16
