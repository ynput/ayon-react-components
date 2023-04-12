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

export interface FileUploadProps extends React.HTMLAttributes<HTMLFormElement> {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  mode?: 'single' | 'multiple' | 'sequence'
  validExtensions?: string[]
  showMaxFiles?: number
  style?: React.CSSProperties
  className?: string
}

export const FileUpload = forwardRef<HTMLFormElement, FileUploadProps>(
  (
    {
      files,
      setFiles,
      mode = 'single',
      validExtensions,
      showMaxFiles = 4,
      style,
      className,
      ...formProps
    },
    ref,
  ) => {
    // Valid modes: single, multiple, sequence

    const [dragActive, setDragActive] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const multiple = mode === 'multiple' || mode === 'sequence'

    // handles the drag events
    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true)
      } else if (e.type === 'dragleave') {
        setDragActive(false)
      }
    }

    const handleFiles = (newFiles: FileList) => {
      const acceptedFiles: File[] = []

      for (const file of newFiles) {
        if (validExtensions) {
          const extension = file.name.split('.').pop()
          if (!extension || !validExtensions.includes(extension)) {
            setErrorMessage(`Invalid file type: ${extension}`)
            return
          }
        }

        if (mode === 'sequence') {
          // TODO: Handle sequence validation
        }

        acceptedFiles.push(file)
        if (!multiple) {
          break
        }
      }
      setErrorMessage(null)
      if (!acceptedFiles) return
      if (mode === 'single') setFiles([acceptedFiles[0]])
      else setFiles((files) => [...(files || []), ...acceptedFiles])
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

    const formContents = useMemo(() => {
      if (files?.length > showMaxFiles) {
        return (
          <>
            <span>{files.length} files selected</span>
            <button
              onClick={() => {
                setFiles([])
                if (inputRef.current) inputRef.current.value = ''
              }}
            >
              clear
            </button>
          </>
        )
      } else if (files?.length) {
        return (
          <FileList>
            {files.map((file, idx) => (
              <li key={idx}>
                {file.name}
                <button
                  onClick={() => {
                    const newFiles = [...files]
                    newFiles.splice(idx, 1)
                    setFiles(newFiles)
                  }}
                >
                  x
                </button>
              </li>
            ))}
          </FileList>
        )
      } else {
        return (
          <>
            <span>Drag and drop your file here or</span>
            <button className="upload-button" onClick={onButtonClick}>
              upload a file
            </button>
            <small>{errorMessage}</small>
          </>
        )
      }
    }, [files, errorMessage])

    return (
      <UploadForm
        // onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        style={style}
        className={className}
        ref={ref}
        {...formProps}
      >
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={multiple}
          onChange={handleChange}
        />

        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? 'drag-active' : ''}
        >
          {formContents}
        </label>

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
