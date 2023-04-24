import { FC } from 'react'
import DefaultValueTemplate, { DefaultValueTemplateProps } from './DefaultValueTemplate'
import styled from 'styled-components'

const TagStyled = styled.span`
  background-color: var(--color-grey-03);
  border-radius: 3px;
  padding: 2px 4px;
`

const TagsValueTemplate: FC<Omit<DefaultValueTemplateProps, 'children'>> = (props) => {
  const { value } = props

  return (
    <DefaultValueTemplate {...props} valueStyle={{ gap: 4, display: 'flex' }}>
      {value.map((v) => (
        <TagStyled key={v}>{v}</TagStyled>
      ))}
    </DefaultValueTemplate>
  )
}

export default TagsValueTemplate
