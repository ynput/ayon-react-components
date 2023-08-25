import styled, { css } from 'styled-components'
import { InputText } from '../InputText'

export const Username = styled.form`
  display: flex;
  flex-direction: row;
  gap: 4px;

  input {
    flex: 1;
  }
`

export const LockedInputText = styled(InputText)<{ $open: boolean }>`
  ${({ $open }) =>
    !$open &&
    css`
      cursor: pointer;
      background-color: var(--md-sys-color-surface-container-high);
      font-style: normal;

      &:hover {
        background-color: var(--md-sys-color-surface-container-high-hover);
      }
      &:active {
        background-color: var(--md-sys-color-surface-container-high-active);
      }
    `}
`
