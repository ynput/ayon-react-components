import type { Meta, StoryObj } from '@storybook/react'
import { TableRow } from '.'
import { Panel } from '../../Panels/Panel'

const meta: Meta<typeof TableRow> = {
  component: TableRow,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof TableRow>

export const Default: Story = {
  render: () => (
    <Panel
      style={{
        maxWidth: 200,
      }}
    >
      <TableRow
        name="Description"
        value="Some very long string that will be truncated"
        tooltip="Say something amazing here!"
      />
    </Panel>
  ),
}
