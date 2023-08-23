import styled, { css, keyframes } from 'styled-components'
import { Button } from '../../Button'

// fade in animation keyframes
export const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const Shade = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 500;
  cursor: pointer;

  /* fade in animation */
  animation: ${fadeInAnimation} 0.13s ease-in-out;
`

// opening up animation keyframes
export const openAnimation = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

export const Window = styled.div<{ $noHeader: boolean }>`
  background-color: var(--md-sys-color-surface-container);
  border-radius: var(--border-radius-m);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  min-width: 200px;
  min-height: 100px;
  max-width: 85%;
  max-height: 85%;
  position: relative;
  cursor: auto;
  :focus {
    outline: none;
  }

  /* open animation */
  animation: ${openAnimation} 0.13s ease-in-out;

  /* add padding to top if no header */

  ${({ $noHeader }) =>
    $noHeader &&
    css`
      padding-top: 46px;
    `}
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
  display: flex;
  flex-direction: column;
  overflow: auto;

  flex-grow: 1;
`

export const Close = styled(Button)`
  position: absolute;
  top: 8px;
  right: 8px;
`
