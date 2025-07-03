import { useState, useRef, useMemo, forwardRef, useEffect } from 'react'
import * as Styled from './FileUpload.styled'
import { Button } from '../Buttons/Button'
import { Icon, IconType } from '../Icon'
import { FileCard } from '../FileCard'
import { Spacer } from '../Layout/Spacer'
import { SaveButton } from '../Buttons/SaveButton'
import { AcceptType } from './fileTypes'
import { extractSequence, getSeqError } from './FileUploadHelpers'

export interface CustomFile {
  sequenceId: string | null
  sequenceNumber: number | null
  message?: string
  file: File
  dataUrl?: string | null
}

// BREAKING CHANGES
// - mode: single, multiple, sequence replaced with allowMultiple, allowSequence
// - showMaxFiles: removed
// - formProps renamed to props
// - CustomFile interface added

type FormProps = Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'>
export interface FileUploadProps extends FormProps {
  files: CustomFile[]
  setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>
  allowMultiple?: boolean
  allowSequence?: boolean
  allowBrokenSequence?: boolean
  onlySequences?: boolean
  accept?: (AcceptType | string)[]
  confirmLabel?: string
  saveButton?: React.ReactNode
  header?: React.ReactNode
  extraHeaderActions?: React.ReactNode
  footer?: React.ReactNode
  onSubmit?: (files: CustomFile[]) => void
  isFetching?: boolean
  isSuccess?: boolean
  successMessage?: string
  isError?: boolean
  disabled?: boolean
  title?: string
  placeholder?: string
  listStyle?: React.CSSProperties
  dropIcon?: IconType
  readOnly?: boolean
  disableImagePreviews?: boolean
  maxImagePreviewSize?: number
  errorMessage?: string
  message?: string
}

export const FileUpload = forwardRef<HTMLFormElement, FileUploadProps>(
  (
    {
      files,
      setFiles,
      allowMultiple = false,
      allowSequence = false,
      allowBrokenSequence = false,
      onlySequences = false,
      accept = ['*'],
      confirmLabel,
      saveButton,
      header,
      extraHeaderActions,
      footer,
      onSubmit,
      isFetching,
      successMessage = 'Upload successful',
      isSuccess,
      isError,
      disabled,
      title,
      placeholder,
      listStyle,
      dropIcon,
      readOnly,
      disableImagePreviews,
      maxImagePreviewSize = 1 * 1024 * 1024,
      errorMessage,
      message,
      ...props
    },
    ref,
  ) => {
    // Valid modes: single, multiple, sequence

    // this is mainly used for the success out animation
    const [localFilesState, setLocalFilesState] = useState<CustomFile[]>([])
    // file images previews
    const [filePreviews, setFilePreviews] = useState<{
      [key: string]: string | null
    }>({})

    // when files changes, update filePreviews
    useEffect(() => {
      if (!Array.isArray(files)) return
      for (const file of files) {
        // only if image and below 1mb
        if (file.file.type.startsWith('image/') && file.file.size <= maxImagePreviewSize) {
          const reader = new FileReader()
          reader.onload = () => {
            setFilePreviews((filePreviews) => ({
              ...filePreviews,
              [file.file.name]: reader.result as string,
            }))
          }
          if (file.file instanceof Blob) {
            reader.readAsDataURL(file.file)
          } else if (file.dataUrl) {
            // look for dataUrl on file
            setFilePreviews((filePreviews) => ({
              ...filePreviews,
              [file.file.name]: file.dataUrl as string,
            }))
          }
        }
      }
    }, [files])

    // every time files changes, update localFilesState, unless isSuccess
    useMemo(() => {
      if (isSuccess) return
      setLocalFilesState(files)
    }, [files, isSuccess])

    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [successMessageOpen, setSuccessMessageOpen] = useState<string | null>()
    const [internalErrorMessage, setErrorMessage] = useState<string | null>(null)

    // every time successMessage changes or isSuccess, clear it after 3 seconds
    useMemo(() => {
      if (successMessage && isSuccess) {
        setSuccessMessageOpen(successMessage)
        const timeout = setTimeout(() => setSuccessMessageOpen(null), 3000)
        return () => clearTimeout(timeout)
      }
    }, [successMessage, isSuccess])

    // every time internalErrorMessage changes, clear it after 3 seconds
    useMemo(() => {
      if (internalErrorMessage) {
        const timeout = setTimeout(() => setErrorMessage(null), 3000)
        return () => clearTimeout(timeout)
      }
    }, [internalErrorMessage])

    // if we are fetching, set dragActive to false
    useMemo(() => {
      if (isFetching) setDragActive(false)
    }, [isFetching])

    // if isError, set internalErrorMessage
    useMemo(() => {
      if (isError) setErrorMessage('Upload failed: try again')
    }, [isError])

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

      // if we don't allow multiple, remove all files
      if (!allowMultiple) setFiles([])

      let acceptedFiles: CustomFile[] = []

      // sort files by name
      const newFilesArray = Array.from(newFiles).sort((a, b) => a.name.localeCompare(b.name))

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
      for (const file of newFilesArray) {
        const fileName = file.name
        const extension = fileName.split('.').pop()
        const extensionWithDot = '.' + extension

        // match extension with accept list
        const foundExtension = accept.includes(extensionWithDot) && extension
        // or match mime type with accept list, image/jpeg or image/*
        const foundMimeType =
          accept.includes(file.type) || accept.includes(file.type.split('/')[0] + '/*')

        if (
          !foundExtension &&
          !foundMimeType &&
          accept.length &&
          !accept.includes('*/*') &&
          !accept.includes('*')
        ) {
          setErrorMessage(`Invalid file type: ${extension}`)
          // skip this file
          continue
        }

        // check if file already exists
        if (files?.find((f) => f.file.name === fileName)) {
          setErrorMessage(`File already exists: ${fileName}`)
          // skip this file
          continue
        }

        // check we can even have sequences
        if (!allowSequence && !onlySequences) {
          acceptedFiles.push({ file, sequenceNumber: null, sequenceId: null })
          continue
        }

        // check if it is part of an image sequence
        const seqMatch = extractSequence(fileName)

        if (!seqMatch.length) {
          if (!onlySequences) {
            acceptedFiles.push({ file, sequenceNumber: null, sequenceId: null })
          } else {
            setErrorMessage('Only sequences allowed')
          }
          continue
        }

        // if it is, add it to the sequence
        const [prefix, sequenceNumber] = seqMatch
        // if the sequence doesn't exist, create it
        const sequenceId = prefix + extensionWithDot

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
        if (acceptedFiles.length > 1) {
          console.log('only one file allowed')
          setErrorMessage('Only 1 file allowed')
          // return first file
          setFiles([acceptedFiles[0]])
          return
        } else if (Object.keys(sequences).length) {
          if (Object.keys(sequences).length > 1) {
            console.log('only one sequence allowed')
            setErrorMessage('Only 1 sequence allowed')
          }
          // return first file from first sequence
          const firstSequence = Object.values(sequences)[0]
          if (firstSequence && firstSequence.files.length) {
            setFiles([{ ...firstSequence.files[0], sequenceId: null }])
            return
          } else {
            setErrorMessage('No files found')
            // return no files
            setFiles([])
            return
          }
        }
      }

      // if we don't allowMultiple but do allow sequences, remove all but first accepted file
      if (!allowMultiple && acceptedFiles.length > 1) {
        if (Object.keys(sequences).length > 1) {
          setErrorMessage('Only 1 file allowed')
        }
        // splice out all accepted files after the first
        acceptedFiles.splice(1, acceptedFiles.length - 1)
      }

      // for each sequence
      for (const [id, { files, counts }] of Object.entries(sequences)) {
        if (files.length < 2) {
          if (!onlySequences) {
            // if there is only one file in the sequence, add it to the accepted files
            acceptedFiles.push({ ...files[0], sequenceId: null, sequenceNumber: null })
          } else {
            // we must have a sequence, discard if file is not part of a sequence
            setErrorMessage('Only sequences allowed')
            continue
          }
          if (!allowMultiple && allowSequence) {
            setErrorMessage('Only 1 file allowed')
            break
          } else {
            continue
          }
        }

        // check if broken sequences are allow and if the sequence is broken
        if (counts.length > 1 && !allowBrokenSequence) {
          setErrorMessage('Broken sequences not allowed')
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
          sequenceId +=
            '[' +
            counts
              .map((count) => (count[0] === count[1] ? `${count[0]}` : `${count[0]}-${count[1]}`))
              .join(', ') +
            ']'
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
          // Overwrite current files with this sequence
          setFiles(seqFiles)
          return
        } else if (allowSequence) {
          // add the sequence to the accepted files
          acceptedFiles.push(...seqFiles)
        }
      }

      if (!acceptedFiles.length) return
      else {
        const newFiles = [...files]
        for (const file of acceptedFiles) {
          newFiles.push(file)
        }
        setFiles(newFiles)
      }
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

    // we do this so that we can show the success out animation temporarily
    const filesToGroup = useMemo(() => {
      if (!isSuccess || !localFilesState.length) {
        if (Array.isArray(files)) return files
        else return []
      } else return localFilesState
    }, [files, isSuccess, localFilesState])

    // group together files with the same sequenceId
    const groupedFiles = useMemo(() => {
      const groupedFiles: { [key: string]: CustomFile[] } = {}
      for (const file of filesToGroup) {
        if (!file) continue
        if (!file.sequenceId) {
          groupedFiles[file.file.name] = [file]
        } else {
          if (!groupedFiles[file.sequenceId]) groupedFiles[file.sequenceId] = []
          groupedFiles[file.sequenceId].push(file)
        }
      }
      return groupedFiles
    }, [filesToGroup])

    const allowedFileTypes = `Allowed:${allowMultiple ? ' Multiple uploads,' : ' Single upload,'}${
      allowSequence ? ` Sequence${onlySequences ? ' only' : ''},` : ''
    }${accept.length && accept.join('') !== '*' ? ' ' + accept.join(', ') : ' All files types'}`

    return (
      <Styled.Form
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        ref={ref}
        {...props}
      >
        <div className="header">
          {header || readOnly ? (
            header || 'Uploaded ' + fileOrFiles
          ) : (
            <>
              {!extraHeaderActions &&
                (title ? (
                  <h3>{title}</h3>
                ) : (
                  <h3>{fileOrFiles.charAt(0).toUpperCase() + fileOrFiles.slice(1)} Uploader</h3>
                ))}
              {extraHeaderActions && extraHeaderActions}
              <Spacer />
              <Button
                icon="delete"
                onClick={() => setFiles([])}
                label="Clear all"
                disabled={!files?.length || isFetching || disabled}
              />
              <Button
                icon="upload_file"
                className="upload-button"
                disabled={isFetching || disabled}
              >
                <span>Add {fileOrFiles}</span>
                <input
                  ref={inputRef}
                  type="file"
                  id="input-file-upload"
                  accept={accept.length ? accept.join(',') : undefined}
                  multiple={allowMultiple || allowSequence}
                  onChange={handleChange}
                  disabled={isFetching || disabled}
                />
              </Button>
            </>
          )}
        </div>

        <div className="files">
          <label
            id="label-file-upload"
            htmlFor="input-file-upload"
            className={dragActive ? 'drag-active' : ''}
          />

          <div className="scroll-container">
            <Styled.List
              $isSuccess={!!isSuccess && !!localFilesState.length}
              onAnimationEnd={() => setLocalFilesState([])}
              style={listStyle}
            >
              {Object.entries(groupedFiles).map(([key, files], idx) => (
                <li key={key}>
                  <FileCard
                    index={idx}
                    title={key}
                    type={
                      files?.length > 1
                        ? 'sequence'
                        : (files?.length && files[0].file.type) || 'unknown'
                    }
                    size={files?.reduce((acc, file) => acc + file.file.size, 0)}
                    length={files?.length}
                    onRemove={() => onFileRemove(key)}
                    onSplit={() => onSeqSplit(key)}
                    splitDisabled={files?.length < 2 || !allowMultiple}
                    isFetching={isFetching}
                    readOnly={readOnly}
                    disabled={disabled}
                    message={
                      files?.length > 1
                        ? getSeqError(files)
                        : (files?.length && files[0].message) || ''
                    }
                    preview={!disableImagePreviews ? filePreviews[files[0].file.name] : null}
                  />
                </li>
              ))}
            </Styled.List>
          </div>

          {!filesToGroup.length && (
            <div className="drop-here">
              <Icon icon={dropIcon ? dropIcon : disabled ? 'file_upload_off' : 'upload'} />
              {placeholder ? (
                <h3>{placeholder}</h3>
              ) : disabled ? (
                <h3>Upload disabled</h3>
              ) : (
                <h3>Drop {fileOrFiles} here</h3>
              )}
            </div>
          )}

          {dragActive && !disabled && (
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
        {footer || readOnly ? (
          footer || <span className="allowed">{allowedFileTypes}</span>
        ) : (
          <footer>
            <div>
              <span className="allowed">{allowedFileTypes}</span>
              {message && <span>{message}</span>}
              <span className={successMessageOpen ? 'success' : 'error'}>
                {successMessageOpen ? successMessageOpen : internalErrorMessage}
              </span>
              {errorMessage && <span className="error">{errorMessage}</span>}
            </div>
            {!saveButton && onSubmit ? (
              <SaveButton
                active={!!files?.length && !disabled}
                saving={isFetching}
                label={confirmLabel || 'Upload ' + fileOrFiles}
                onClick={() => onSubmit(files)}
              />
            ) : (
              saveButton
            )}
          </footer>
        )}
      </Styled.Form>
    )
  },
)
