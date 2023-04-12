import type { Meta, StoryObj } from '@storybook/react'
import { TablePanel } from '.'

const meta: Meta<typeof TablePanel> = {
  component: TablePanel,
}

export default meta

type Story = StoryObj<typeof TablePanel>

const Template = () => (
  <TablePanel>
    <h2>{'TablePanel'}</h2>
    <p>This is a table panel. Good for containing tables</p>
    <table>
      <thead>
        <tr>
          <th>{'Header 1'}</th>
          <th>{'Header 2'}</th>
          <th>{'Header 3'}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{'Cell 1'}</td>
          <td>{'Cell 2'}</td>
          <td>{'Cell 3'}</td>
        </tr>
        <tr>
          <td>{'Cell 1'}</td>
          <td>{'Cell 2'}</td>
          <td>{'Cell 3'}</td>
        </tr>
        <tr>
          <td>{'Cell 1'}</td>
          <td>{'Cell 2'}</td>
          <td>{'Cell 3'}</td>
        </tr>
      </tbody>
    </table>
  </TablePanel>
)

export const Default: Story = {
  render: Template,
}
