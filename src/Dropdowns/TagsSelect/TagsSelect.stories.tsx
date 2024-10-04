import type { Meta, StoryObj } from '@storybook/react'
import { TagsSelect, tags, tagsOrder } from '.'
import { useState } from 'react'

const meta: Meta<typeof TagsSelect> = {
  component: TagsSelect,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof TagsSelect>

const initValue = tagsOrder.slice(0, 3)

export const Default: Story = {
  args: {
    tags,
    tagsOrder,
    editor: true,
  },
  render: (args) => {
    const [value, setValue] = useState(initValue)

    const handleChange = (v: string[]) => {
      console.log(v)
      setValue(v)
    }

    return <TagsSelect {...args} value={value} onChange={handleChange} />
  },
}

export const Multiple: Story = {
  args: {
    tags,
    tagsOrder,
  },
  render: (args) => {
    const [value, setValue] = useState(initValue)

    const handleChange = (v: string[]) => {
      console.log(v)
      setValue(v)
    }

    return <TagsSelect {...args} value={value} onChange={handleChange} isMultiple />
  },
}
