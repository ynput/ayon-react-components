import type { Meta, StoryObj } from '@storybook/react'
import { Dialog } from '.'
import { useState } from 'react'
import { Button } from '../../Button'
import { InputColor } from '../../Inputs/InputColor'
import { Dropdown } from '../../Dropdowns/Dropdown'

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

const defaultArgs: Story['args'] = {
  header: <HeaderContent />,
  children: <BodyContent />,
  size: 'full',
  onShow: () => console.log('onShow'),
  closeProps: closeProps,
  hideCancelButton: true,
}

const Template = (args: Story['args']) => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <Button onClick={() => setOpenModal(!openModal)} icon="open_in_full">
        Show Modal
      </Button>
      <Dialog {...defaultArgs} {...args} isOpen={openModal} onClose={() => setOpenModal(false)} />
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
export const DropdownInput: Story = {
  render: Template,
  args: {
    children: (
      <Dropdown
        options={[
          { value: 'option1' },
          {
            value: 'option2',
          },
        ]}
        value={['option1']}
      />
    ),
  },
}

export const ColorPicker: Story = {
  render: Template,
  args: {
    children: <InputColor value={'#fff'} onChange={() => console.log('onChange')} />,
  },
}
