import type { Meta, StoryObj } from '@storybook/react'
import { Panel } from '../Panels/Panel'
import { SaveButton } from './SaveButton'
import { FormRow } from '../Layout/FormRow'
import { InputText } from '../Inputs/InputText'
import { Button } from '../Button'
import { Section } from '../Layout/Section'
import { useState } from 'react'

const meta: Meta<typeof SaveButton> = {
  component: SaveButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SaveButton>

const SaveButtonTemplate = (args: Story['args']) => {
  const [name, setName] = useState('')
  // saving state
  const [saving, setSaving] = useState(false)

  // simulate saving
  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setName('')
    }, 1000)
  }

  return (
    <Panel style={{ maxWidth: 300 }}>
      <FormRow label="name">
        <InputText value={name} onChange={(e) => setName(e.target.value)} />
      </FormRow>
      <Section direction="row" style={{ width: '100%' }}>
        <Button variant="text" label="Clear" onClick={() => setName('')} />
        <SaveButton {...args} active={!!name} saving={saving} onClick={handleSave} />
      </Section>
    </Panel>
  )
}

export const Default: Story = {
  args: {
    label: 'Save',
    icon: 'save_as',
  },
  render: SaveButtonTemplate,
}
