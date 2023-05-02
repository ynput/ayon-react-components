import { DefaultItemStyled, Dropdown } from '../Dropdown'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { TagsSelectValueTemplate } from './TagsSelectValueTemplate'
import { type TagsOrderType, type TagsType } from './tags'
import styled from 'styled-components'
import { Icon } from '../Icon'

const StyledDropdown = styled(Dropdown)`
  .options {
    flex-direction: row;
    width: ${({ width }: { width?: number }) => (width ? `${width}px` : '100%')};
    flex-wrap: wrap;
    gap: 4px;
    padding: 4px;

    .option {
      flex: 1;
    }

    /* add new full width */
    .option:first-child {
      min-width: 100%;
      margin: -4px;
      margin-bottom: 0px;
    }

    .option:not(:first-child) {
      max-width: 33%;
      border-radius: var(--border-radius);
      .option-child {
        border-radius: var(--border-radius);
        text-align: center;
      }
    }
  }
`

export interface TagsSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
      <StyledDropdown
        value={value}
        valueTemplate={() => (
          <TagsSelectValueTemplate value={value} {...props} tags={tags} editor={editor} />
        )}
        itemTemplate={(tag, isActive, isSelected, i) => (
          <DefaultItemStyled
            isSelected={isSelected}
            className="option-child"
            style={{
              color: tag.color,
              justifyContent: i ? 'center' : undefined,
            }}
          >
            {tag.icon && <Icon icon={tag.icon} />}
            <span>{tag.name || tag.label}</span>
          </DefaultItemStyled>
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
