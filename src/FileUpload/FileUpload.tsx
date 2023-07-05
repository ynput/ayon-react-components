import { useState, useRef, useMemo, forwardRef } from 'react'
import styled from 'styled-components'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { FileCard } from '../FileCard'
import { Spacer } from '../Layout/Spacer'
import { SaveButton } from '../SaveButton'

const UploadForm = styled.form`
  min-height: 160px;
  min-width: 300px;
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 4px;
    h2 {
      margin: 0;
    }
  }

  .upload-button {
    position: relative;
    overflow: hidden;

    * > span {
      cursor: pointer;
    }
  }

  input {
    position: absolute;
    inset: 0px;
    opacity: 0;

    &::-webkit-file-upload-button {
      visibility: hidden;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0px;
      cursor: pointer;
    }
  }

  .files {
    flex: 1;
    position: relative;
    background-color: var(--panel-background);
    border-radius: 1rem;

    border-width: 2px;
    border-style: dashed;
    border-color: #6b7685;
  }

  .scroll-container {
    overflow: auto;
    position: absolute;
    inset: 0;
  }

  label {
    position: absolute;
    inset: 0;

    &.drag-active {
      background-color: rgba(0, 0, 0, 0.1);
      z-index: 100;
    }
  }

  small {
    color: #e53e3e !important;
    font-size: 0.8rem;
  }

  .drop-here {
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;

    .icon {
      font-size: 3rem;
    }
  }

  #drag-file-element {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    inset: 0;
    z-index: 25;
  }
`

const StyledList = styled.ul`
  list-style: none;
  padding: 16px;
  margin: 0;

  position: relative;
  z-index: 50;

  display: flex;
  flex-direction: column;
  gap: 2px;

  overflow: auto;
`

const StyledSaveButton = styled(SaveButton)`
  margin-top: 4px;
  max-width: fit-content;
  margin-left: auto;
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

export interface CustomFile {
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
  confirmLabel?: string
  hideSaveButton?: boolean
}

export const FileUpload = forwardRef<HTMLFormElement, FileUploadProps>(
  (
    {
      files,
      setFiles,
      allowMultiple = false,
      allowSequence = false,
      validExtensions = [],
      confirmLabel,
      hideSaveButton = false,
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
      if (!newFiles.length) return

      let acceptedFiles: CustomFile[] = []

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

        // check we can even have sequences
        if (!allowSequence) {
          acceptedFiles.push({ file, sequenceNumber: null, sequenceId: null })
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

      // if we don't allow multiple and don't allow sequences, only accept the first file
      if (!allowMultiple && !allowSequence) {
        console.log('only one file allowed')
        setErrorMessage('Only one file allowed')
        if (acceptedFiles.length > 1) {
          // return first file
          setFiles([acceptedFiles[0]])
          return
        } else if (acceptedFiles.length === 1) {
          // return first file from first sequence
          const firstSequence = Object.values(sequences)[0]
          if (firstSequence && firstSequence.files.length) {
            setFiles([{ ...firstSequence.files[0], sequenceId: null }])
            return
          } else {
            // return no files
            setFiles([])
            return
          }
        }
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

        const seqFiles = sortedFiles.map(({ file, sequenceNumber }) => ({
          file,
          sequenceNumber,
          sequenceId: sequenceId,
        }))

        //if we allow sequences but don't allow multiple, only accept the first sequence, remove accepted files
        // return to prevent adding more sequences
        if (!allowMultiple && allowSequence) {
          acceptedFiles = seqFiles
          break
        } else {
          // add the sequence to the accepted files
          acceptedFiles.push(...seqFiles)
        }
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

    const onFileRemove = (key: string) => {
      // remove files from state
      const newFiles = files.filter((file) =>
        file.sequenceId ? file.sequenceId !== key : file.file.name !== key,
      )

      setFiles(newFiles)
    }

    // for every file that key matches the sequenceId, remove sequenceId and sequenceNumber
    const onSeqSplit = (key: string) => {
      const newFiles = files.map((file) =>
        file.sequenceId === key ? { ...file, sequenceId: null, sequenceNumber: null } : file,
      )

      setFiles(newFiles)
    }

    const fileOrFiles = useMemo(
      () => (allowMultiple || allowSequence ? 'files' : 'file'),
      [allowMultiple, allowSequence],
    )

    // group together files with the same sequenceId
    const groupedFiles = useMemo(() => {
      const groupedFiles: { [key: string]: CustomFile[] } = {}
      for (const file of files) {
        if (!file.sequenceId) {
          groupedFiles[file.file.name] = [file]
        } else {
          if (!groupedFiles[file.sequenceId]) groupedFiles[file.sequenceId] = []
          groupedFiles[file.sequenceId].push(file)
        }
      }
      return groupedFiles
    }, [files])

    return (
      <UploadForm
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        ref={ref}
        {...props}
      >
        <div className="header">
          <h2>{fileOrFiles.charAt(0).toUpperCase() + fileOrFiles.slice(1)} Uploader</h2>
          <Spacer />
          <Button
            icon="delete"
            onClick={() => setFiles([])}
            label="Clear all"
            disabled={!files.length}
          />
          <Button icon="upload_file" className="upload-button">
            <span>Add {fileOrFiles}</span>
            <input
              ref={inputRef}
              type="file"
              id="input-file-upload"
              multiple={allowMultiple || allowSequence}
              onChange={handleChange}
            />
          </Button>
        </div>

        <div className="files">
          <label
            id="label-file-upload"
            htmlFor="input-file-upload"
            className={dragActive ? 'drag-active' : ''}
          />

          <div className="scroll-container">
            <StyledList>
              {Object.entries(groupedFiles).map(([key, files], idx) => (
                <li key={key}>
                  <FileCard
                    title={key}
                    type={files.length > 1 ? 'sequence' : files[0].file.type}
                    size={files.reduce((acc, file) => acc + file.file.size, 0)}
                    length={files.length}
                    onRemove={() => onFileRemove(key)}
                    onSplit={() => onSeqSplit(key)}
                  />
                </li>
              ))}
            </StyledList>
          </div>

          {!files.length && (
            <div className="drop-here">
              <Icon icon="upload_file" />
              <h3>Drop {fileOrFiles} here</h3>
            </div>
          )}

          {dragActive && (
            <div
              id="drag-file-element"
              onDrop={handleDrop}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              style={{
                zIndex: 200,
              }}
            />
          )}
        </div>
        {!hideSaveButton && (
          <StyledSaveButton
            active={!!files.length}
            label={confirmLabel || 'Upload ' + fileOrFiles}
          />
        )}
      </UploadForm>
    )
  },
)
