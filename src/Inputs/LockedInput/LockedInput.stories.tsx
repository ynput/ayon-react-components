import type { Meta, StoryObj } from '@storybook/react'
import { LockedInput } from '.'
import { useState } from 'react'
import { Dialog } from '../../Overlay/Dialog'
import { InputText } from '../InputText'
import { Button } from '../../Button'

const meta: Meta<typeof LockedInput> = {
  component: LockedInput,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof LockedInput>

export const Default: Story = {
  args: {
    value: 'first.last.name',
    placeholder: 'Username...',
    onEdit: undefined,
  },
}

// FIX: broken state
export const OpenDialog: Story = {
  args: Default.args,
  render: (args) => {
    const [value, setValue] = useState(args.value)
    const [editingValue, setEditingValue] = useState(value)
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleSave = () => {
      setValue(editingValue)
      setDialogOpen(false)
    }

    const handleCancel = () => {
      setEditingValue(value)
      setDialogOpen(false)
    }

    return (
      <>
        <LockedInput value={value} onEdit={() => setDialogOpen(true)} />
        {dialogOpen && (
          <Dialog
            header="Edit Username"
            visible={dialogOpen}
            onHide={() => setDialogOpen(false)}
            footer={
              <>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </>
            }
          >
            <InputText value={editingValue} onChange={(e) => setEditingValue(e.target.value)} />
          </Dialog>
        )}
      </>
    )
  },
}
