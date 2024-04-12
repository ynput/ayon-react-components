import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from '.'
import { useRef } from 'react'
import { Button } from '../../Button'

const meta: Meta<typeof Modal> = {
  component: Modal,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Modal>

// const payload = {
//   message: 'Are you sure you want to discard your changes?',
//   header: 'Confirmation',
//   icon: 'pi pi-exclamation-triangle',
//   accept: () => {
//     setIsOpen(false)
//     setEditorValue('')
//   },
// }

const HeaderContent = () => (
    <div>This is title of modal</div>
)

const BodyContent = () => (
  <>
    <div>Are you sure you want to permanently delete this folder and all its associated tasks, products, versions, representations, and workfiles?</div>
  </>
)

const FooterContent = () => <span>Ynput is awesome. Copyright ©2024 Ynput</span>



const Template = () => {

  const modalRef = useRef<HTMLDialogElement | null>(null);

  const toggleDialog = () => {
    const modalElement = modalRef.current
    const isModalOpen =  modalElement?.hasAttribute('open')
    if (!modalElement) return
    isModalOpen ? modalElement.close() : modalElement.showModal()
  }

  
  return (
    <>
      <Button onClick={() => toggleDialog()} icon="open_in_full">
        Show Modal
      </Button>
      <Modal 
        header={<HeaderContent/>}
        children={<BodyContent />}
        // footer={<FooterContent />}
        toggleDialog={toggleDialog}
        ref={modalRef}
      />
    </>
  )
}

export const Default: Story = {
  render: () => Template(),
}
