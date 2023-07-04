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

const Template = () => {
  const [files, setFiles] = useState<CustomFile[]>([])

  return (
    <Panel style={{ maxWidth: 400 }}>
      <FileUpload files={files} setFiles={setFiles} />
    </Panel>
  )
}

export const Default: Story = {
  render: Template,
}
