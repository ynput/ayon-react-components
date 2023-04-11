import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown, DropdownProps } from './Dropdown'
import { useState } from 'react'

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
}

export default meta

type Story = StoryObj<typeof Dropdown>

const options = [
  { value: 'favorite', keyword: 'like' },
  { value: 'search', keyword: 'find' },
  { value: 'settings', keyword: 'configuration' },
  { value: 'home', keyword: 'house' },
  { value: 'account_circle', keyword: 'user' },
  { value: 'add', keyword: 'create' },
  { value: 'add_circle', keyword: 'plus' },
  { value: 'add_circle_outline', keyword: 'empty_plus' },
  { value: 'add_shopping_cart', keyword: 'cart' },
  { value: 'alarm', keyword: 'clock' },
]

const Template = (args: DropdownProps) => {
  const [value, setValue] = useState<(string | number)[]>(args.value || [options[0].value])

  return <Dropdown {...args} value={value} onChange={setValue} options={args.options || options} />
}

// simple dropdown with three items
export const Basic: Story = {
  render: Template,
}

// simple dropdown with 1000 items and search
export const Search: Story = {
  args: {
    searchFields: ['value', 'keyword'],
    search: true,
  },
  render: Template,
}

// icons and multi select
export const Icons: Story = {
  args: {
    options: options.map((option) => ({ ...option, icon: option.value })),
    multiSelect: true,
  },
  render: Template,
}

// custom item and option renderers
// TODO: fix this!
// export const CustomRenderers: Story = {
//   args: {
//     options: options.map((option) => ({ ...option, icon: option.value })),
//     multiSelect: true,
//     itemTemplate: (value) => (
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         <span style={{ marginRight: '10px' }}>{value}</span>
//         <span>{value}</span>
//       </div>
//     ),
//     valueTemplate: (option) => (
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         <span style={{ marginRight: '10px' }}>{option.icon}</span>
//         <span>{option.keyword}</span>
//       </div>
//     ),
//   },
//   render: Template,
// }
