import type { Meta, StoryObj } from '@storybook/react'
import { Dialog } from '.'
import { useState } from 'react'
import { Button } from '../../Button'

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Dialog>

const Template = () => {
  const [visible, setVisible] = useState(true)

  return (
    <>
      <Button onClick={() => setVisible(true)} icon="open_in_full">
        Show Dialog
      </Button>
      <Dialog
        onHide={() => setVisible(false)}
        visible={visible}
        header={'Dialog Header'}
        footer={'Dialog Footer'}
      >
        <span>Hello, This is a Dialog!</span>
      </Dialog>
    </>
  )
}

export const Default: Story = {
  render: () => Template(),
}
