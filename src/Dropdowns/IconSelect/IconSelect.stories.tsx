import type { Meta, StoryObj } from '@storybook/react'
import { IconSelect, IconSelectProps } from '.'
import { useState } from 'react'

const meta: Meta<typeof IconSelect> = {
  component: IconSelect,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof IconSelect>

const Template = ({ value: initValue, featured, multiSelect, featuredOnly }: IconSelectProps) => {
  const [value, setValue] = useState(initValue)

  return (
    <IconSelect
      {...{ value, featured, multiSelect, featuredOnly }}
      onChange={(value) => setValue(value)}
    />
  )
}

export const Default: Story = {
  args: {
    value: ['content_copy'],
    featured: [],
    multiSelect: false,
    featuredOnly: false,
  },
  render: Template,
}

export const Featured: Story = {
  render: () =>
    Template({
      value: ['content_copy'],
      featured: [
        'content_copy',
        'add_circle',
        'image',
        'folder',
        'category',
        'live_tv',
        'smart_toy',
      ],
    }),
}

export const FeaturedLimited: Story = {
  render: () =>
    Template({
      value: ['content_copy'],
      featured: [
        'content_copy',
        'add_circle',
        'image',
        'folder',
        'category',
        'live_tv',
        'smart_toy',
      ],
      featuredOnly: true,
    }),
}

export const MultiSelect: Story = {
  render: () =>
    Template({
      value: ['image', 'folder'],
      multiSelect: true,
    }),
}
