import { DropdownProps } from '../Dropdown'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { TagsSelectValueTemplate, TagsSelectValueTemplateProps } from './TagsSelectValueTemplate'
import { type TagsOrderType, type TagsType } from './tags'
import * as Styled from './TagsSelect.styled'
import { Icon } from '../../Icon'

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
}

export const TagsSelect = forwardRef<HTMLDivElement, TagsSelectProps>(
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

    // set input value
    useEffect(() => {
      setValue(inputValue)
    }, [inputValue])

    return (
      <Styled.TagSelectDropdown
        {...props}
        value={value}
        valueTemplate={(v, s, o) => (
          <TagsSelectValueTemplate
            value={(o ? s : v) || []}
            {...valueProps}
            tags={tags}
            editor={editor}
          />
        )}
        itemTemplate={(tag, isActive, isSelected, i) => (
          <Styled.DefaultItem
            $isSelected={isSelected}
            className="option-child"
            style={{
              color: tag.color,
              justifyContent: i ? 'center' : undefined,
            }}
          >
            {tag.icon && <Icon icon={tag.icon} />}
            <span>{tag.name || tag.label}</span>
          </Styled.DefaultItem>
        )}
        options={tagsOptions || []}
        dataKey={'name'}
        disabled={disabled}
        onChange={(tags) => onChange && onChange(tags.map((tag) => tag.toString() as string))}
        widthExpand={widthExpand}
        multiSelect
        search
        searchFields={['name', 'fullName']}
        ref={ref}
        editable
        align={align}
        style={styleDropdown}
        width={width}
      />
    )
  },
)
