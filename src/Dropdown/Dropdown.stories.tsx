import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown, DropdownProps } from '.'
import { useState } from 'react'
import { Button } from '../Button'

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  tags: ['autodocs'],
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

  const handleClear = () => {
    args.onClear?.()
    // if minSelected is set, we need to set the value to the minSelected
    const newValue = args.minSelected ? options.slice(0, args.minSelected).map((o) => o.value) : []
    setValue(newValue)
  }

  return (
    <Dropdown
      {...args}
      value={value}
      onChange={setValue}
      options={args.options || options}
      onClear={args.onClear ? handleClear : undefined}
      widthExpand
      style={{
        width: 250,
      }}
    />
  )
}

// icons and multi select
export const Icons: Story = {
  args: {
    options: options.map((option) => ({ ...option, icon: option.value })),
    multiSelect: true,
    minSelected: 1,
    widthExpand: true,
  },
  render: Template,
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
    onClear: () => console.log('clear'),
    placeholder: 'Selected an Icon...',
    value: [],
  },
  render: Template,
}

export const Multiple: Story = {
  args: {
    isMultiple: true,
    value: [options[0].value, options[1].value],
    widthExpand: true,
    multiSelect: true,
    minSelected: 2,
    onClear: () => console.log('clear'),
  },
  render: Template,
}

// custom item and option renderers
// TODO: fix this!
export const CustomTemplates: Story = {
  args: {
    value: [options[0].value, options[1].value],
    options: options.map((option) => ({ ...option, icon: option.value })),
    multiSelect: true,
    widthExpand: true,
    listStyle: { backgroundColor: 'black' },
    valueTemplate: (value) => (
      <div
        style={{
          background: 'orange',
          borderRadius: 3,
          padding: 10,
          display: 'flex',
        }}
      >
        {value?.map((v) => (
          <Button
            label={v.toString()}
            icon={v.toString()}
            style={{
              marginLeft: 4,
              backgroundColor: 'unset',
              color: 'black',
            }}
            iconStyle={{ color: 'black' }}
          />
        ))}
      </div>
    ),
    itemTemplate: (option, isActive, isSelected) => (
      <div
        style={{
          background: isActive && isSelected ? 'orange' : isSelected ? '#029cfd' : '#292c2e',
          borderRadius: 3,
          margin: 4,
          padding: 10,
        }}
      >
        {isSelected ? '✓' : ' '}
        {option?.value}
      </div>
    ),
  },
  render: Template,
}
