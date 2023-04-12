import type { Meta, StoryObj } from '@storybook/react'
import { FormLayout } from '.'
import { FormRow } from '../FormRow'
import { InputText } from '../../Inputs/InputText'

const meta: Meta<typeof FormLayout> = {
  component: FormLayout,
}

export default meta

type Story = StoryObj<typeof FormLayout>

const Template = () => (
  <FormLayout
    style={{
      maxWidth: '400px',
    }}
  >
    <FormRow label="username">
      <InputText placeholder="username..." />
    </FormRow>
    <FormRow label="fullName">
      <InputText placeholder="my name..." />
    </FormRow>
    <FormRow label="avatarUrl">
      <InputText />
    </FormRow>
  </FormLayout>
)

export const Default: Story = {
  render: Template,
}
