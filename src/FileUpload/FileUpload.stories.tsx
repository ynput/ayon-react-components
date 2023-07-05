import type { Meta, StoryObj } from '@storybook/react'
import { CustomFile, FileUpload, FileUploadProps } from '.'
import { useState } from 'react'
import { Panel } from '../Panels/Panel'

const meta: Meta<typeof FileUpload> = {
  component: FileUpload,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof FileUpload>

const Template = (args: FileUploadProps) => {
  const [files, setFiles] = useState<CustomFile[]>([])

  return (
    <Panel style={{ maxWidth: 700, height: 300 }}>
      <FileUpload {...args} files={files} setFiles={setFiles} />
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
