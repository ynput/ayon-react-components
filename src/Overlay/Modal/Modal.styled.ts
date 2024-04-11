import styled, { css, keyframes } from 'styled-components'
import { Button } from '../../Button'


const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const Dialog = styled.dialog`
    background-color: var(--md-sys-color-surface-container);
    border: none;
    border-radius: var(--border-radius-m);
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    min-width: 200px;
    min-height: 100px;
    max-width: 85%;
    max-height: 85%;
   

    /* Backdrop property affects inactive area around modal */
    &::backdrop {
        background-color: rgba(0, 0, 0, 0.3);
    }

    /* Styles for dialogs that carry modal behavior */
    &:modal {
       
    }

    &:modal[open] {
      animation: ${fadeInAnimation} 0.13s ease-in-out;
    }

    /* Styles for dialogs that carry non-modal behavior */
    &:not(:modal) {
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
  gap: 8px;
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

