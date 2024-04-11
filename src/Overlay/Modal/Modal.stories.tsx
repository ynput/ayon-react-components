import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from '.'
import { useState } from 'react'
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
  // const [isNewsletterModalOpen, setNewsletterModalOpen] = useState<boolean>(false);
  // const [newsletterFormData, setNewsletterFormData] = useState<NewsletterModalData | null>(null);

  // const handleCloseNewsletterModal = () => {
  //   setNewsletterModalOpen(false);
  // };

  
  return (
    <>
      {/* <Button onClick={() => show()} icon="open_in_full">
        Show Modal
      </Button> */}
      <Modal 
        hasCloseBtn={true}
        header={'Dialog Header'}
        children={'Dialog Body'}
        footer={'Dialog Footer'}
      />
    </>
  )
}

export const Default: Story = {
  render: () => Template(),
}
