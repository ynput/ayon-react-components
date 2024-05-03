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
    <div>Are you sure you want to permanently delete this folder and all its associated tasks, products, versions, representations, and workfiles?</div>
  </>
)

const FooterContent = () => <span>Ynput is awesome. Copyright ©2024 Ynput</span>

const closeProps = {
  label: 'Close'
}

const Template = () => {

  const [openModal, setOpenModal] = useState(false)
  
  return (
    <>
      <Button onClick={() => setOpenModal(!openModal)} icon="open_in_full">
        Show Modal
      </Button>
      <Dialog 
        header={<HeaderContent/>}
        children={<BodyContent />}
        footer={<FooterContent />}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        closeProps={closeProps}
        hideCancelButton={false}
        size='full'
        variant='dialog'
        onShow={() => console.log('test123')}
      />
    </>
  )
}

export const Default: Story = {
  render: () => Template(),
}
