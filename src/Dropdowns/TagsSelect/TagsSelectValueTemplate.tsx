import { FC } from 'react'
import { DefaultValueTemplateProps } from '../Dropdown'
import * as Styled from './TagsSelect.styled'
import { type TagsType } from './tags'
import clsx from 'clsx'
import styled from 'styled-components'
import { Icon } from '../../Icon'
import { getTextColor } from '../../helpers'

const PlaceholderTag = styled.div`
  display: flex;
  align-items: center;
  gap: var(--base-gap-small);
  padding: 0 6px;
`

export interface TagsSelectValueTemplateProps extends Omit<DefaultValueTemplateProps, 'children'> {
  tags: TagsType
  editor?: boolean
  // editing several items: tags only some of them have are shown dashed
  mixedCounts?: Record<string, number>
  mixedTotal?: number
}

export const TagsSelectValueTemplate: FC<TagsSelectValueTemplateProps> = ({
  mixedCounts,
  mixedTotal = 0,
  ...props
}) => {
  const { value, tags = {}, editor = false } = props

  //   if value empty return placeholder tag
  if (!value?.length && editor)
    return (
      <PlaceholderTag className="placeholder">
        <Icon icon="sell" />
        <span>Select tags</span>
      </PlaceholderTag>
    )

  return (
    <Styled.TagsValueTemplate
      {...props}
      hasError={undefined}
      valueStyle={{ gap: 4, display: 'flex' }}
      className={clsx('tags', { editor }, props.className)}
    >
      {value?.map((v) => {
        const count = mixedCounts?.[v] ?? mixedTotal
        if (mixedTotal > 1 && count < mixedTotal) {
          return (
            <Styled.PartialTag
              key={v}
              className="tag partial"
              data-tooltip={`On ${count} of ${mixedTotal}`}
            >
              {v}
            </Styled.PartialTag>
          )
        }
        return (
          <Styled.Tag
            key={v}
            $backgroundColor={tags[v]?.color}
            $color={getTextColor(tags[v]?.color || '#353B46')}
            className="tag"
          >
            {v}
          </Styled.Tag>
        )
      })}
    </Styled.TagsValueTemplate>
  )
}
