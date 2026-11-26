import styled from 'styled-components'
import { readOnlyValueStyles } from './fieldStyles'
import { labelSmall } from '../theme'

export const ReadOnlyValue = styled.span`
  ${readOnlyValueStyles}
`

export const FieldErrorText = styled.div`
  font-size: 12px;
  color: var(--md-sys-color-error);
`

// Shown in read-only mode when there is no value
export const EMPTY_VALUE = '–'

// Small error text under the input that takes no space: the row keeps its height
export const FieldErrorOverlay = styled.span`
  ${labelSmall}
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1;
  color: var(--md-sys-color-error);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
