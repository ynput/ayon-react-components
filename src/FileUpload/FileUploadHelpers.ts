import { CustomFile } from './FileUpload'

export const extractSequence = (string: string): [string, number] | [] => {
  // first remove the extension

  const matches = string.match(/\d+/g) // Extracts all sequences of digits from the string
  if (!matches) return []

  const lastMatch = matches[matches.length - 1] // Gets the last match, which is the sequence number
  const prefix = string.slice(0, string.lastIndexOf(lastMatch)) // Gets the prefix of the string, which is the part before the sequence number

  const sequenceNumber = parseInt(lastMatch, 10) // Parses the sequence number into an integer
  return [prefix, sequenceNumber]
}

export const getSeqError = (files: CustomFile[]) => {
  // message example "Frames failed to upload : 0003, 0004"
  const prefix = 'Errors on frames : '
  const failedFrames = []

  // console.log(files)

  for (const file of files) {
    if (!file.message) continue

    failedFrames.push(file.sequenceNumber)
  }

  if (!failedFrames.length) return undefined

  const message = prefix + failedFrames.join(', ')

  return message
}
