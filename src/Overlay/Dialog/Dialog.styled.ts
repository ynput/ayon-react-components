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

const widthSizes  = {
  sm: '400px',
  md: '600px',
  lg: '800px',
  full: '85%',
};

const heightSizes  = {
  sm: '300px',
  md: '400px',
  lg: '500px',
  full: '85%',
};

const getWidthSize = (size: string) => size ? widthSizes[size as keyof typeof widthSizes] : widthSizes.sm;
const getHeightSize = (size: string) => size ? heightSizes[size as keyof typeof heightSizes] : heightSizes.sm;


export const Dialog = styled.dialog<{ $size?: string }>`
    background-color: var(--md-sys-color-surface-container);
    border: none;
    border-radius: var(--border-radius-m);
    flex-direction: column;
    gap: 16px;
    padding: 0;
    min-width: 200px;
    min-height: 100px;
    max-width: 85%;
    width: ${({ $size }) => $size ? css` ${getWidthSize($size)}` : '200px'};
    max-Height: ${({ $size }) => $size ? css` ${getHeightSize($size)}` : '100px' };

    /* Backdrop property affects inactive area around modal */
    &::backdrop {
        background-color: rgba(0, 0, 0, 0.3);
    }

    /* Styles for dialogs that carry modal behavior */
    &:modal {
      display: flex;
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
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
`

export const BaseDialogEdge = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`


export const Header = styled(BaseDialogEdge)<{ hideCancelButton?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
  ${({ hideCancelButton }) => !hideCancelButton && css`padding-right: 40px;`}
  & > * { 
    ${titleLarge}
  }
`

export const Footer = styled(BaseDialogEdge)`
  display: flex;
  padding: 16px;
`
export const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex-grow: 1;
`

