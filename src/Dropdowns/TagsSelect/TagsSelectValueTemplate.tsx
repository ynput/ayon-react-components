import { FC } from 'react'
import { DefaultValueTemplateProps } from '../Dropdown'
import * as Styled from './TagsSelect.styled'
import { type TagsType } from './tags'

export interface TagsSelectValueTemplateProps extends Omit<DefaultValueTemplateProps, 'children'> {
  tags: TagsType
  editor?: boolean
}

export const TagsSelectValueTemplate: FC<TagsSelectValueTemplateProps> = (props) => {
  const { value, tags = {}, editor = false } = props

  //   if value empty return placeholder tag
  if (!value?.length) value?.push('Add tags')

  return (
    <Styled.TagsValueTemplate {...props} valueStyle={{ gap: 4, display: 'flex' }} editor={editor}>
      {value?.map((v) => (
        <Styled.Tag
          key={v}
          style={{
            color: tags[v]?.color,
          }}
        >
          {v}
        </Styled.Tag>
      ))}
    </Styled.TagsValueTemplate>
  )
}
