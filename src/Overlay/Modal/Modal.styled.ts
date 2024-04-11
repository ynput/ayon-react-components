import styled, { css, keyframes } from 'styled-components'
import { Button } from '../../Button'

export const Dialog = styled.dialog`
    background-color: var(--md-sys-color-surface-container);
    border: none;
    border-radius: var(--border-radius-m);
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    min-width: 200px;
    min-height: 100px;
    max-width: 85%;
    max-height: 85%;
    position: relative;
    cursor: auto;
    
    /* Backdrop property affects inactive area around modal */
    &::backdrop {
        background-color: rgba(0, 0, 0, 0.3);
    }
`

export const Close = styled(Button)`
  position: absolute;
  top: 8px;
  right: 8px;
`

export const BaseDialogEdge = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`


export const Header = styled(BaseDialogEdge)`
  font-weight: bold;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  padding: 16px 0;
`

export const Footer = styled(BaseDialogEdge)`
  border-top: 1px solid var(--md-sys-color-outline-variant);
  padding: 16px 0;
`
export const Body = styled.div`
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex-grow: 1;
`

