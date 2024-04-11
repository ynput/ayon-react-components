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

const Template = () => {

  const modalRef = useRef<HTMLDialogElement | null>(null);

  const toggleDialog = () => {
    const modalElement = modalRef.current
      if (!modalElement) return
      if (modalElement) {
        modalElement.hasAttribute('open') ? modalElement.close() : modalElement.showModal();
      }
  }

  
  return (
    <>
      <Button onClick={() => toggleDialog()} icon="open_in_full">
        Show Modal
      </Button>
      <Modal 
        hasCloseBtn={true}
        header={'Dialog Header'}
        children={'Dialog Body'}
        footer={'Dialog Footer'}
        toggleDialog={toggleDialog}
        ref={modalRef}
      />
    </>
  )
}

export const Default: Story = {
  render: () => Template(),
}
