import styled, { css, keyframes } from 'styled-components'
import { Button } from '../../Button'
import { titleMedium } from '../../theme'

const fadeInAnimation = keyframes`
  0% {
    opacity: 0.3;
    scale: 0.8;
  }
  100% {
    opacity: 1;
    scale: 1;
  }
`

const widthSizes = {
  sm: '400px',
  md: '600px',
  lg: '800px',
  full: '85%',
}

const heightSizes = {
  sm: '300px',
  md: '400px',
  lg: '500px',
  full: '85%',
}

const getWidthSize = (size: string) =>
  size ? widthSizes[size as keyof typeof widthSizes] : widthSizes.sm
const getHeightSize = (size: string) =>
  size ? heightSizes[size as keyof typeof heightSizes] : heightSizes.sm

export const Dialog = styled.div<{ $size?: string }>`
  background-color: var(--md-sys-color-surface-container);
  border: none;
  border-radius: var(--border-radius-m);
  flex-direction: column;
  padding: 0;

  width: ${({ $size }) =>
    $size
      ? css`
          ${getWidthSize($size)}
        `
      : '200px'};
  max-height: ${({ $size }) =>
    $size
      ? css`
          ${getHeightSize($size)}
        `
      : '100px'};

  position: relative;
  pointer-events: auto;

  min-width: 200px;
  min-height: 100px;
  max-width: 85%;

  display: flex;
  animation: ${fadeInAnimation} 150ms ease-in-out forwards,
    ${fadeInAnimation} 150ms ease-in-out backwards;
  animation-fill-mode: both;

  z-index: 1000;
`

export const Close = styled(Button)`
  position: absolute;
  right: 8px;
  top: 8px;

  &.isHidden {
    user-select: none;
    opacity: 0;
    pointer-events: none;
  }
`

export const BaseDialogEdge = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`

export const Header = styled(BaseDialogEdge)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
  padding-right: 48px;

  &.hideCancelButton {
    padding-right: 16px;
  }

  ${titleMedium}
  & > * {
    ${titleMedium}
  }
`

export const Footer = styled(BaseDialogEdge)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
`
export const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex-grow: 1;
`

const fadeIn = keyframes`
  from {
    opacity: 0;


  } to {
    opacity: 1;
  
  }`

export const Backdrop = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  animation: ${fadeIn} 150ms ease-in-out forwards;
  animation-fill-mode: both;
  z-index: 999;

  display: flex;
  align-items: center;
  justify-content: center;

  &.hideBackdrop {
    pointer-events: none;
    background-color: unset;
  }
`
