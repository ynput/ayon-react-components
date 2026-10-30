import styled from 'styled-components'
import { readOnlyValueStyles } from './fieldStyles'

export const ReadOnlyValue = styled.span`
  ${readOnlyValueStyles}
`

export const FieldErrorText = styled.div`
  font-size: 12px;
  color: var(--md-sys-color-error);
`

// Shown in read-only mode when there is no value
export const EMPTY_VALUE = '–'
