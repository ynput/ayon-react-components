import type { Meta, StoryObj } from '@storybook/react'
import { CustomFile, FileUpload } from '.'
import { useState } from 'react'
import { Panel } from '../Panels/Panel'

const meta: Meta<typeof FileUpload> = {
  component: FileUpload,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof FileUpload>

const Template = (args: { allowMultiple?: boolean; allowSequence?: boolean }) => {
  const [files, setFiles] = useState<CustomFile[]>([])

  return <FileUpload files={files} setFiles={setFiles} {...args} />
}

export const Single: Story = {
  render: Template,
}
export const MultipleSeq: Story = {
  args: {
    allowMultiple: true,
    allowSequence: true,
  },
  render: Template,
}
