import { FC } from 'react'
import { DefaultValueTemplateProps, DefaultValueTemplate } from '.'
import styled from 'styled-components'

const TagStyled = styled.span`
  background-color: var(--md-sys-color-surface-container-high);
  border-radius: var(--border-radius-m);
  padding: 2px 4px;
`

const TagsValueTemplate: FC<Omit<DefaultValueTemplateProps, 'children'>> = (props) => {
  const { value } = props

  return (
    <DefaultValueTemplate
      {...props}
      valueStyle={{ gap: 4, display: 'flex' }}
      style={{ padding: '0 4px' }}
    >
      {value.map((v) => (
        <TagStyled key={v}>{v}</TagStyled>
      ))}
    </DefaultValueTemplate>
  )
}

export default TagsValueTemplate
