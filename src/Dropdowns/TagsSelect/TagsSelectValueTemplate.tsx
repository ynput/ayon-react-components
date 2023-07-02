import { FC } from 'react'
import { DefaultValueTemplateProps, DefaultValueTemplate } from '../Dropdown'
import styled, { css } from 'styled-components'
import { type TagsType } from './tags'

const TagStyled = styled.span`
  background-color: var(--color-grey-03);
  border-radius: 3px;
  padding: 2px 4px;
`

const DefaultValueTemplateStyled = styled(DefaultValueTemplate)`
  padding: 0 4px;

  &:hover {
    background-color: var(--color-grey-02);
  }

  ${({ editor }: { editor?: boolean }) =>
    !editor &&
    css`
      /* remove border */
      border: none;
      /* remove icon */
      .icon {
        display: none;
      }
    `}
`

export interface TagsSelectValueTemplateProps extends Omit<DefaultValueTemplateProps, 'children'> {
  tags: TagsType
  editor?: boolean
}

export const TagsSelectValueTemplate: FC<TagsSelectValueTemplateProps> = (props) => {
  const { value, tags = {}, editor = false } = props

  //   if value empty return placeholder tag
  if (!value.length) value.push('Add tags')

  return (
    <DefaultValueTemplateStyled {...props} valueStyle={{ gap: 4, display: 'flex' }} editor={editor}>
      {value.map((v) => (
        <TagStyled
          key={v}
          style={{
            color: tags[v]?.color,
          }}
        >
          {v}
        </TagStyled>
      ))}
    </DefaultValueTemplateStyled>
  )
}
