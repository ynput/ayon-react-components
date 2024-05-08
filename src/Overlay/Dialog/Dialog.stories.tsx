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

const HeaderContent = () => <div>This is title of dialog</div>

const BodyContent = () => (
  <>
    <div>
      Are you sure you want to permanently delete this folder and all its associated tasks,
      products, versions, representations, and workfiles?
    </div>
  </>
)

const FooterContent = () => <span>Ynput is awesome. Copyright ©2024 Ynput</span>

const closeProps = {
  label: 'Close',
}

const Template = (args: Story['args']) => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <Button onClick={() => setOpenModal(!openModal)} icon="open_in_full">
        Show Modal
      </Button>
      <Dialog
        {...args}
        header={<HeaderContent />}
        children={<BodyContent />}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onShow={() => console.log('onShow')}
        closeProps={closeProps}
        hideCancelButton={false}
        size="lg"
      />
    </>
  )
}

export const Default: Story = {
  render: Template,
}

export const Footer: Story = {
  render: Template,
  args: {
    footer: <FooterContent />,
  },
}

export const DialogVariant: Story = {
  render: Template,
}
