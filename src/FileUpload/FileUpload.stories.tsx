import type { Meta, StoryObj } from '@storybook/react'
import { CustomFile, FileUpload, FileUploadProps } from '.'
import { useState } from 'react'
import { Panel } from '../Panels/Panel'
import { Button } from '../Button'
import filesData from './filesData'

const getFileObjects = async (files: CustomFile[]): Promise<CustomFile[]> => {
  const fileObjects: CustomFile[] = []
  for (const f of files) {
    const fileReader = new FileReader()
    const dataUrl = await new Promise<string>((resolve) => {
      fileReader.onload = () => {
        resolve(fileReader.result as string)
      }
      fileReader.readAsDataURL(f.file)
    })
    const fileObject: CustomFile = {
      ...f,
      file: {
        name: f.file.name,
        type: f.file.type,
        size: f.file.size,
      },
      // dataUrl: dataUrl,
    }
    fileObjects.push(fileObject)
  }
  return fileObjects
}

const meta: Meta<typeof FileUpload> = {
  component: FileUpload,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof FileUpload>

const Template = (args: FileUploadProps) => {
  const [files, setFiles] = useState<CustomFile[]>(args.files || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // if true, set to false after 1s
  if (isSubmitting) {
    setTimeout(() => {
      setIsSubmitting(false)
      setIsFinished(true)
      // 50% chance of success
      const isSuccess = Math.random() > 0.5
      setIsSuccess(isSuccess)
      if (isSuccess) setFiles([])
    }, 1000)
  }

  const handleSubmit = async () => {
    const fileObjects = await getFileObjects(files)

    console.log(fileObjects)

    setIsSubmitting(true)
    setIsSuccess(false)
    setIsFinished(false)
  }

  return (
    <Panel style={{ maxWidth: 700, height: 300 }}>
      <FileUpload
        {...args}
        files={files}
        setFiles={setFiles}
        isFetching={isSubmitting}
        isSuccess={isFinished && isSuccess}
        isError={isFinished && !isSuccess}
        onSubmit={handleSubmit}
      />
    </Panel>
  )
}

export const Single: Story = {
  render: Template,
}
export const AllAllowed: Story = {
  args: {
    allowMultiple: true,
    allowSequence: true,
  },
  render: Template,
}
export const SingleSeqExtensions: Story = {
  args: {
    allowMultiple: false,
    allowSequence: true,
    validExtensions: ['jpg', 'png'],
  },
  render: Template,
}

export const MultipleNoSeq: Story = {
  args: {
    allowMultiple: true,
    allowSequence: false,
    validExtensions: ['jpg'],
  },
  render: Template,
}

export const CustomUpload: Story = {
  args: {
    allowMultiple: true,
    allowSequence: true,
    saveButton: <Button icon="magic_button">Custom Save</Button>,
    dropIcon: 'magic_button',
    placeholder: 'Drop special files here',
    title: 'Special files',
  },
  render: Template,
}

export const Disabled: Story = {
  args: {
    allowMultiple: true,
    allowSequence: true,
    disabled: true,
  },
  render: Template,
}

export const ReadUploaded: Story = {
  args: {
    allowMultiple: true,
    allowSequence: true,
    readOnly: true,
    title: 'Uploaded files',
    placeholder: 'No files uploaded',
    files: filesData,
  },
  render: Template,
}
