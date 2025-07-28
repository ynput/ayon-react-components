import type { Meta, StoryObj } from '@storybook/react'
import { LockedInput } from '.'
import { useState } from 'react'
import { Dialog } from '../../Overlay/Dialog'
import { InputText } from '../InputText'
import { Button } from '../../Buttons/Button'

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
  render: (args) => {
    const [value, setValue] = useState(args.value)

    return <LockedInput {...args} value={value} onSubmit={setValue} />
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
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
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

export const Disabled: Story = {
  render: () => {
    const names = ['bob', 'joe', 'jane']
    const [selected, setSelected] = useState(['bob'])

    const handleButtonClick = (name: string) => {
      // add or remove name from selected
      if (selected.includes(name)) {
        setSelected(selected.filter((n) => n !== name))
      } else {
        setSelected([...selected, name])
      }
    }

    return (
      <div
        style={{
          maxWidth: 200,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          {names.map((name) => (
            <Button
              key={name}
              label={name}
              onClick={() => handleButtonClick(name)}
              style={{
                outline: selected.includes(name) ? '1px solid green' : 'none',
              }}
            />
          ))}
        </div>
        <LockedInput value={selected.join(', ')} disabled={selected.length > 1} />
      </div>
    )
  },
}
