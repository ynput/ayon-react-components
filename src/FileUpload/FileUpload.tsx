import { useState, useRef, useMemo, forwardRef } from 'react'
import styled from 'styled-components'

const UploadForm = styled.form`
  height: 200px;
  width: 300px;
  text-align: center;
  position: relative;

  input {
    display: none;
  }

  label {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    border-width: 2px;
    border-radius: 1rem;
    border-style: dashed;
    border-color: #6b7685;
    background-color: transparent;

    &.drag-active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  span {
    font-size: 1.2rem;
  }

  small {
    color: #e53e3e !important;
    font-size: 0.8rem;
  }

  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: #3182ce;
    font-weight: 600;
    font-size: 1rem;

    &:hover {
      text-decoration: underline;
    }
  }

  #drag-file-element {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
`

const FileList = styled.ul`
  list-style: none;
  padding: 10%;
  margin: 0;
  font-size: 0.8rem;
  overflow-y: auto;
  width: 100%;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      background-color: transparent;
      border: none;
      color: #e53e3e;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`

const extractSequence = (string: string): [string, number] | [] => {
  // first remove the extension

  const matches = string.match(/\d+/g) // Extracts all sequences of digits from the string
  if (!matches) return []

  const lastMatch = matches[matches.length - 1] // Gets the last match, which is the sequence number
  const prefix = string.slice(0, string.lastIndexOf(lastMatch)) // Gets the prefix of the string, which is the part before the sequence number

  const sequenceNumber = parseInt(lastMatch, 10) // Parses the sequence number into an integer
  return [prefix, sequenceNumber]
}

interface CustomFile {
  sequenceId: string | null
  sequenceNumber: number | null
  file: File
}

// BREAKING CHANGES
// - mode: single, multiple, sequence replaced with allowMultiple, allowSequence
// - showMaxFiles: removed
// - formProps renamed to props
// - CustomFile interface added

export interface FileUploadProps extends React.HTMLAttributes<HTMLFormElement> {
  files: CustomFile[]
  setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>
  allowMultiple?: boolean
  allowSequence?: boolean
  validExtensions?: string[]
}

export const FileUpload = forwardRef<HTMLFormElement, FileUploadProps>(
  (
    {
      files,
      setFiles,
      allowMultiple = false,
      allowSequence = false,
      validExtensions = [],
      ...props
    },
    ref,
  ) => {
    // Valid modes: single, multiple, sequence

    const [dragActive, setDragActive] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    // handles the drag events
    const handleDrag = (e: React.DragEvent<HTMLDivElement> | React.DragEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true)
      } else if (e.type === 'dragleave') {
        setDragActive(false)
      }
    }

    const handleFiles = (newFiles: FileList) => {
      const acceptedFiles: CustomFile[] = []

      // split files into sequences and single files
      const sequences: {
        [key: string]: {
          files: {
            sequenceNumber: number
            file: File
          }[]
          counts: [number | null, number | null][]
        }
      } = {}

      // for each file in the list
      for (const file of newFiles) {
        const fileName = file.name
        const extension = fileName.split('.').pop()
        if (!extension || (!validExtensions.includes(extension) && validExtensions.length)) {
          setErrorMessage(`Invalid file type: ${extension}`)
          // skip this file
          continue
        }
        // check if it is part of an image sequence

        const seqMatch = extractSequence(fileName)

        if (!seqMatch.length) {
          acceptedFiles.push({ file, sequenceNumber: null, sequenceId: null })
          continue
        }

        // if it is, add it to the sequence
        const [prefix, sequenceNumber] = seqMatch
        // if the sequence doesn't exist, create it
        const sequenceId = prefix + '.' + extension

        if (!sequences[sequenceId]) sequences[sequenceId] = { files: [], counts: [] }
        const foundSequence = sequences[sequenceId]

        // add the file to the sequence
        foundSequence.files.push({ file, sequenceNumber })

        // get last count
        // if there is no last count, add the first count
        // if the last count is not the current count - 1 (next), push the current count
        // if the last count is the current count - 1, update the last count to the current count
        // if the last count is the current count, do nothing
        const counts = [...foundSequence.counts]
        const lastCount = counts[counts.length - 1]
        if (lastCount === undefined) {
          // console.log('no count', counts)
          // If there is no last count, add the first count
          counts.push([sequenceNumber, sequenceNumber])
        } else if (lastCount[1] !== sequenceNumber - 1) {
          // console.log('not next', counts)
          // If the last count is not the current count - 1 (next), push the current count
          counts.push([sequenceNumber, sequenceNumber])
        } else {
          // console.log('next', counts)
          // If the last count is the current count - 1, update the last count to the current count
          counts[counts.length - 1] = [lastCount[0], sequenceNumber]
        }

        // update counts
        foundSequence.counts = counts
      }

      // for each sequence
      for (const [id, { files, counts }] of Object.entries(sequences)) {
        if (files.length < 2) {
          // if there is only one file in the sequence, add it to the accepted files
          acceptedFiles.push({ ...files[0], sequenceId: null, sequenceNumber: null })
          continue
        }

        // sort the files by filename
        const sortedFiles = files.sort()
        // create sequence Id from id and counts
        const idPrefix = id.slice(0, id.lastIndexOf('.'))
        const idExtension = id.slice(id.lastIndexOf('.'))

        // filename[0001-0005][0008-0009].jpg
        let sequenceId = idPrefix

        // max counts 3
        // otherwise, use [start...end]
        if (counts.length > 3) {
          sequenceId += `[${counts[0][0]}--${counts[counts.length - 1][1]}]`
        } else {
          sequenceId += counts
            .map((count) => (count[0] === count[1] ? `[${count[0]}]` : `[${count[0]}-${count[1]}]`))
            .join('-')
        }

        sequenceId += idExtension

        // add the sequence to the accepted files
        acceptedFiles.push(
          ...sortedFiles.map(({ file, sequenceNumber }) => ({
            file,
            sequenceNumber,
            sequenceId: sequenceId,
          })),
        )
      }

      console.log(acceptedFiles)

      setErrorMessage(null)
      if (!acceptedFiles.length) return
      else setFiles((files) => files.concat(acceptedFiles))
    }

    // triggers when file is dropped
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files)
      }
    }

    // triggers when file is selected with click
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files)
      }
    }

    // triggers the input when the button is clicked
    const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      inputRef.current?.click()
    }

    const onFileRemove = (event: React.MouseEvent<HTMLButtonElement>, idx: number) => {
      event.preventDefault()
      event.stopPropagation()
      if (idx === -1) {
        setFiles([])
        if (inputRef.current) inputRef.current.value = ''
      } else {
        const newFiles = [...files]
        newFiles.splice(idx, 1)
        setFiles(newFiles)
      }
    }

    return (
      <UploadForm
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        ref={ref}
        {...props}
      >
        <div className="header">
          <h1>Upload your files</h1>
        </div>
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={allowMultiple || allowSequence}
          onChange={handleChange}
        />

        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? 'drag-active' : ''}
        ></label>

        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          />
        )}
      </UploadForm>
    )
  },
)
