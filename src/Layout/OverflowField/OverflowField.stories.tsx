import type { Meta, StoryObj } from '@storybook/react'
import { OverflowField } from '.'
import { Panel } from '../../Panels/Panel'

const meta: Meta<typeof OverflowField> = {
  component: OverflowField,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof OverflowField>

export const Default: Story = {
  render: () => (
    <Panel
      style={{
        maxWidth: 150,
        margin: '20px 0',
      }}
    >
      <OverflowField
        value={'Some very long string that will be truncated'}
        align={'left'}
        onClick={() => window.alert('clicked')}
        icon="content_copy"
        isCopy
      />
    </Panel>
  ),
}
