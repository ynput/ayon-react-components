import { FC } from 'react'
import { DefaultValueTemplateProps } from '../Dropdown'
import * as Styled from './TagsSelect.styled'
import { type TagsType } from './tags'
import clsx from 'clsx'

export interface TagsSelectValueTemplateProps extends Omit<DefaultValueTemplateProps, 'children'> {
  tags: TagsType
  editor?: boolean
}

export const TagsSelectValueTemplate: FC<TagsSelectValueTemplateProps> = (props) => {
  const { value, tags = {}, editor = false } = props

  //   if value empty return placeholder tag
  if (!value?.length) value?.push('Add tags')

  return (
    <Styled.TagsValueTemplate
      {...props}
      hasError={undefined}
      valueStyle={{ gap: 4, display: 'flex' }}
      className={clsx({ editor }, props.className)}
    >
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
