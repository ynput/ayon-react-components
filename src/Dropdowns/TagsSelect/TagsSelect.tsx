import { DropdownProps, DropdownRef } from '../Dropdown'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { TagsSelectValueTemplate, TagsSelectValueTemplateProps } from './TagsSelectValueTemplate'
import { type TagsOrderType, type TagsType } from './tags'
import * as Styled from './TagsSelect.styled'
import { Icon } from '../../Icon'
import clsx from 'clsx'
import { TagColorAction } from './TagColorAction'

export interface TagsSelectProps extends Omit<DropdownProps, 'onChange'> {
  value: string[]
  options: {
    name: string
    fullName?: string
    avatarUrl?: string
  }[]
  onChange?: (names: string[]) => void
  widthExpand?: boolean
  disabled?: boolean
  isMultiple?: boolean
  tags: TagsType
  tagsOrder?: TagsOrderType
  editor?: boolean
  align?: 'left' | 'right'
  styleDropdown?: React.CSSProperties
  width?: number
  valueProps?: TagsSelectValueTemplateProps
  // every tag, and a typed new one, gets a button to pick its colour
  onTagColorChange?: (tag: { name: string; color: string }) => void
  // the button's tooltip
  tagColorLabel?: string | ((tag: { name: string; color?: string }) => string)
  tagColors?: string[]
}

export const TagsSelect = forwardRef<DropdownRef, TagsSelectProps>(
  (
    {
      value: inputValue = [],
      onChange,
      widthExpand = true,
      disabled,
      tags,
      tagsOrder,
      editor,
      align,
      styleDropdown,
      width = 300,
      valueProps,
      isMultiple,
      checkboxes = true,
      onTagColorChange,
      tagColorLabel = 'Pick a colour',
      tagColors,
      ...props
    },
    ref,
  ) => {
    // tags options is an array of tags
    const tagsOptions = useMemo(() => {
      // if no order provided, return object to array
      if (!tagsOrder) return Object.values(tags)
      // if order provided, return array of tags
      const tagsArray = []
      const addedTags: string[] = []
      for (const tag of tagsOrder) {
        if (!tags[tag] || addedTags.includes(tag)) continue
        tagsArray.push(tags[tag])
        addedTags.push(tag)
      }
      return tagsArray
    }, [tags, tagsOrder])

    const [value, setValue] = useState<string[]>([])
    // the tag whose colours are shown
    const [colorPickingTag, setColorPickingTag] = useState<string | null>(null)

    // set input value
    useEffect(() => {
      setValue(inputValue)
    }, [inputValue])

    return (
      <Styled.TagSelectDropdown
        {...props}
        error={null}
        value={value}
        valueTemplate={(v, s, o) => (
          <TagsSelectValueTemplate
            value={(o ? s : v) || []}
            {...valueProps}
            tags={tags}
            editor={editor}
            isMultiple={isMultiple}
            isOpen={o}
            mixedCounts={props.mixedCounts}
            mixedTotal={props.mixedTotal}
          />
        )}
        itemTemplate={(tag, isActive, isSelected, i) => (
          <Styled.DefaultItem
            className={clsx('option-child', {
              selected: isSelected,
              'picking-color': colorPickingTag === tag.name,
            })}
            style={{
              color: tag.color,
              justifyContent: i && !checkboxes ? 'center' : undefined,
            }}
          >
            {tag.icon && <Icon icon={tag.icon} />}
            <span>{tag.name || tag.label}</span>
            {onTagColorChange && tag.name && (
              <TagColorAction
                isPicking={colorPickingTag === tag.name}
                color={tags[tag.name]?.color}
                colors={tagColors}
                label={
                  typeof tagColorLabel === 'function'
                    ? tagColorLabel({ name: tag.name, color: tags[tag.name]?.color })
                    : tagColorLabel
                }
                // the first option adds the typed tag, so it is selected too
                isAddNew={i === 0}
                onOpen={() => setColorPickingTag(tag.name)}
                onPick={(color) => {
                  setColorPickingTag(null)
                  onTagColorChange({ name: tag.name, color })
                }}
              />
            )}
          </Styled.DefaultItem>
        )}
        options={tagsOptions || []}
        dataKey={'name'}
        disabled={disabled}
        onChange={(tags) =>
          onChange &&
          onChange(
            tags.map((tag) => tag.toString() as string).filter((tag) => tag && tag !== 'Add tags'),
          )
        }
        widthExpand={widthExpand}
        multiSelect
        search
        searchFields={['name', 'fullName']}
        ref={ref}
        editable
        align={align}
        style={styleDropdown}
        $width={width}
        $checkboxes={checkboxes}
        checkboxes={checkboxes}
        sortBySelected
        onClose={() => {
          setColorPickingTag(null)
          props.onClose?.()
        }}
      />
    )
  },
)
