import type { Meta, StoryObj } from '@storybook/react'
import { FormRow } from '.'
import { InputText } from '../../Inputs/InputText'

const meta: Meta<typeof FormRow> = {
  component: FormRow,
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
