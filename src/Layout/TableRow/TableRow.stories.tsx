import type { Meta, StoryObj } from '@storybook/react'
import { TableRow } from '.'
import { Panel } from '../../Panels/Panel'

const meta: Meta<typeof TableRow> = {
  component: TableRow,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof TableRow>

const rows = [
  {
    name: 'Description',
    value: 'Some very long string that will be truncated',
    tooltip: 'Say something amazing here!',
    onCopy: () => console.log('copied'),
  },
  {
    name: 'Age',
    value: 42,
  },
  {
    name: 'Is Active',
    value: true,
  },
  {
    name: 'Has Children',
    value: false,
  },
  {
    name: 'color',
    value: ['red', 'green', 'blue'],
  },
  {
    name: 'custom',
    children: (
      <div
        style={{ backgroundColor: 'var(--md-sys-color-on-primary)', padding: 4, borderRadius: 4 }}
      >
        Custom Div
      </div>
    ),
  },
  {
    name: 'birthday',
    value: new Date().toISOString(),
    type: 'date',
  },
  {
    name: 'Value Node',
    value: <div>Some JSX</div>,
  },
]

export const Default: Story = {
  render: () => (
    <Panel
      style={{
        maxWidth: 300,
        gap: 0,
      }}
    >
      {rows.map((row, i) => (
        <TableRow
          key={i}
          name={row.name}
          value={row.value}
          tooltip={row.tooltip}
          onCopy={row.onCopy}
          type={row.type}
        >
          {row.children}
        </TableRow>
      ))}
    </Panel>
  ),
}
