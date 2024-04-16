import styled, { css, keyframes } from 'styled-components'
import { Button } from '../../Button'
import { titleLarge } from '../../theme'


const fadeInAnimation = keyframes`
  0% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

export const Dialog = styled.dialog`
    background-color: var(--md-sys-color-surface-container);
    border: none;
    border-radius: var(--border-radius-m);
    flex-direction: column;
    gap: 16px;
    padding: 0;
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
      animation: ${fadeInAnimation} 150ms ease-in-out forwards, ${fadeInAnimation} 150ms ease-in-out backwards;
      animation-fill-mode: both;
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
  display: flex;
  flex-direction: column;
  padding: 16px;
  & > * { 
    ${titleLarge}
  }
`

export const Footer = styled(BaseDialogEdge)`
  display: flex;
  flex-direction: row-reverse;
  padding: 16px;
`
export const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex-grow: 1;
`

