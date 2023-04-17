import type { Meta, StoryObj } from '@storybook/react'
import { Section } from '.'

const meta: Meta<typeof Section> = {
  component: Section,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Section>

const Template = () => (
  <Section
    style={{
      backgroundColor: 'gray',
      padding: '1rem',
    }}
  >
    <h1>Section</h1>
    <div>Item 1</div>
    <div>Item 2</div>
  </Section>
)

export const Default: Story = {
  render: Template,
}
