import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload } from '.'
import { useState } from 'react'

const meta: Meta<typeof FileUpload> = {
  component: FileUpload,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof FileUpload>

const Template = () => {
  const [files, setFiles] = useState<File[]>([])

  return <FileUpload files={files} setFiles={setFiles} />
}

export const Default: Story = {
  render: Template,
}
