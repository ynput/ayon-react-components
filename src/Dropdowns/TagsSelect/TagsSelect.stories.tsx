import type { Meta, StoryObj } from '@storybook/react'
import { TagsSelect, tags, tagsOrder } from '.'
import type { TagsType } from './tags'
import { useEditOptionDialog } from '../Dropdown/EditOptionDialog.stories.helper'
import { useState } from 'react'
import { applyMixedChange, getMixedCounts, type MixedChange } from '../Dropdown/mixedValues'

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

// editing the tags of several items: each tag is added to, removed from or left on every item
export const SeveralItems: Story = {
  args: {
    tags,
    tagsOrder,
    editor: true,
  },
  render: (args) => {
    const [items, setItems] = useState<string[][]>([
      tagsOrder.slice(0, 2),
      tagsOrder.slice(0, 3),
      tagsOrder.slice(1, 2),
      [tagsOrder[0], 'not-in-anatomy'],
    ])
    const allTags = [...new Set(items.flat())]
    const [tagDefinitions, setTagDefinitions] = useState<TagsType>(tags)
    const { onEditOption, dialog } = useEditOptionDialog({
      dataKey: 'name',
      fields: ['color'],
      onSave: ({ value: name, color = '' }) =>
        setTagDefinitions({ ...tagDefinitions, [name]: { name, color } }),
    })

    const handleMixedChange = (change: MixedChange) => {
      console.log(change)
      setItems(items.map((itemTags) => applyMixedChange(itemTags, change)))
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TagsSelect
          {...args}
          tags={tagDefinitions}
          value={allTags}
          mixedCounts={getMixedCounts(items)}
          mixedTotal={items.length}
          mixedLabel="items"
          onMixedChange={handleMixedChange}
          onEditOption={onEditOption}
        />
        {dialog}
        <ul>
          {items.map((itemTags, i) => (
            <li key={i}>{itemTags.join(', ') || '-'}</li>
          ))}
        </ul>
      </div>
    )
  },
}

// a tag's colour is edited in a dialog, and a new tag can be given one as it is added
export const EditTags: Story = {
  args: {
    tagsOrder,
    editor: true,
  },
  render: (args) => {
    const [value, setValue] = useState(['no-colour-yet'])
    const [allTags, setAllTags] = useState<TagsType>({
      ...tags,
      'no-colour-yet': { name: 'no-colour-yet', color: '' },
    })
    const { onEditOption, dialog } = useEditOptionDialog({
      dataKey: 'name',
      fields: ['color'],
      onSave: ({ value: name, color = '' }) => setAllTags({ ...allTags, [name]: { name, color } }),
    })

    return (
      <>
        <TagsSelect
          {...args}
          tags={allTags}
          tagsOrder={undefined}
          value={value}
          onChange={setValue}
          onEditOption={onEditOption}
          editOptionTooltip="Change colour"
        />
        {dialog}
      </>
    )
  },
}
