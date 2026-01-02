import type { Meta, StoryObj } from '@storybook/react'
import { FormRow } from '.'
import { InputText } from '../../Inputs/InputText'

const meta: Meta<typeof FormRow> = {
  component: FormRow,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof FormRow>

const Template = () => (
  <div
    style={{
      display: 'flex',
      width: '100%',
    }}
  >
    <FormRow label="username">
      <InputText placeholder="username..." />
    </FormRow>
  </div>
)

export const Default: Story = {
  render: Template,
}

export const WithShortcut: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        width: '100%',
      }}
    >
      <FormRow label="username" shortcut="Ctrl+U">
        <InputText placeholder="username..." />
      </FormRow>
    </div>
  ),
}
