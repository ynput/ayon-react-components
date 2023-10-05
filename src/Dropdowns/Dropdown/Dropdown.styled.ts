import styled, { css, keyframes } from 'styled-components'

export const Button = styled.button<{
  $isChanged: boolean
  $isOpen: boolean
}>`
  user-select: none;
  /* remove defaults */
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  background-color: var(--md-sys-color-surface-container-low);
  &:not(:focus) {
    border: inherit;
  }
  z-index: 12;
  position: relative;

  /* if isOpen and :focus-visible remove outline */
  ${({ $isOpen }: { $isOpen: boolean }) =>
    $isOpen &&
    css`
      &:focus-visible {
        outline: none;
      }
    `}

  &:hover {
    background-color: var(--md-sys-color-surface-container-low-hover);
  }

  &:active {
    background-color: var(--md-sys-color-surface-container-low-active);
  }

  border-radius: var(--border-radius-m);

  ${({ $isChanged }) =>
    $isChanged &&
    css`
      background-color: var(--md-sys-color-primary);

      &,
      span,
      .icon {
        color: var(--md-sys-color-on-primary);
      }

      :hover {
        background-color: var(--md-sys-color-primary-hover);
      }
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.7;
      font-style: italic;

      /* no hover */
      &:hover {
        background-color: var(--md-sys-color-surface-container-low);
      }

      .icon {
        opacity: 0.5;
      }
    `}
`

export const Dropdown = styled.div`
  position: relative;
  height: 32px;
  /* width: 100%; */
  display: inline-block;

  button {
    width: 100%;
  }

  & > * {
    height: 100%;
  }
`

export const Container = styled.div<{
  $isOpen: boolean
  $height?: number
  $message: string
  $startAnimation: boolean
}>`
  width: 100%;
  position: relative;
  height: ${({ $height }) => `${$height}px`};
  width: auto;
  display: inline-block;
  height: min-content;

  position: fixed;
  z-index: 60;

  /* position: fixed; */

  /* hide when startAnimation false */
  ${({ $startAnimation }) =>
    !$startAnimation &&
    css`
      opacity: 0;
    `}

  /* show warning when changing multiple entities */
    ${({ $isOpen, $message }) =>
    $isOpen &&
    $message &&
    css`
      &::before {
        content: '${$message}';
        top: 0;
        translate: 0 -100%;
        position: absolute;
        background-color: var(--md-sys-color-surface-container-low);
        border-radius: var(--border-radius-m) var(--border-radius-m) 0 0;
        z-index: 10;
        display: flex;
        align-items: center;
        padding: 4px 0;
        right: 0;
        left: 0;
        border: 1px solid #383838;
        justify-content: center;
      }
    `}
`

export const dropdownMenuAnimation = (end: number) => keyframes`
    0% {
      max-height: 0;
      opacity: 0;
  }
  100% {
      max-height: ${end}px;
      opacity: 1;
  }
  `

export const Options = styled.ul<{
  $message: string
  $search: boolean
  $startAnimation: boolean
  $animationHeight: number
  $maxHeight?: number
}>`
  width: auto;
  list-style-type: none;
  padding: unset;

  display: flex;
  flex-direction: column;

  margin: 0px;
  border: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container-low);
  z-index: 20;
  border-radius: ${({ $message, $search }) =>
    $message || $search
      ? '0 0 var(--border-radius-m) var(--border-radius-m)'
      : 'var(--border-radius-m)'};
  overflow: clip;

  position: relative;

  /* fixes focus outline being cutoff for first item */
  padding-top: 1px;
  margin-top: -1px;

  /* move first child up by 1px to line up with list item (as it has no bottom border) */
  li:first-child {
    margin-top: -1px;
  }

  /* play animation on $startAnimation */
  ${({ $startAnimation, $animationHeight, $maxHeight }) =>
    $maxHeight &&
    ($startAnimation
      ? css`
          animation: ${dropdownMenuAnimation($animationHeight)} 0.1s ease-in-out forwards;
          max-height: ${$maxHeight}px;
        `
      : css`
          opacity: 0;
          max-height: ${$maxHeight}px;
        `)}

  overflow-y: scroll;
  /* scrollbar */
  scrollbar-width: 8px;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background: var(--md-sys-color-surface-container-low);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--md-sys-color-outline);
    border-radius: 8px;
  }
`

export const slideDown = keyframes`
    0% {
      transform: translateY(-100%);
      opacity: 0;
  }
  100% {
      transform: translateY(0);
      opacity: 1;
  }
  `

export const ListItem = styled.li<{
  $focused: boolean
  $usingKeyboard: boolean
  $startAnimation: boolean
  $disabled?: boolean
}>`
  cursor: pointer;
  user-select: none;

  ${({ $usingKeyboard, $disabled }) =>
    !$usingKeyboard &&
    (!$disabled
      ? css`
          &:hover {
            background-color: var(--md-sys-color-surface-container-low-hover);
          }
          &:active {
            background-color: var(--md-sys-color-surface-container-low-active);
          }
        `
      : css`
          text-decoration: line-through;
          background-color: var(--md-sys-color-surface-container-low-hover);
          &,
          & > * {
            cursor: not-allowed;
          }
          opacity: 0.3;
        `)}

  /* $focused */
    outline-offset: -1px;
  ${({ $focused }) =>
    $focused &&
    css`
      background-color: var(--md-sys-color-surface-container-low-hover);

      & > * {
        outline: solid var(--focus-color) 1px;
        outline-offset: -1px;
        border-radius: var(--border-radius-m);
      }
    `}

  /* start animation, slide down 100% height */
        ${({ $startAnimation }) =>
    $startAnimation &&
    css`
      animation: ${slideDown} 0.1s ease-in-out forwards;
    `}
`

export const DefaultItem = styled.span<{
  $isSelected: boolean
}>`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 32px;
  padding: 0 8px;

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
    `}
`

export const Search = styled.div`
  /* put to top of list */
  order: -2;
  position: relative;
  height: 29px;
  width: 100%;

  /* search icon */
  .icon {
    position: absolute;
    left: 8px;
    top: 50%;
    translate: 0 -50%;
    z-index: 10;
    z-index: 40;
  }

  /* input */
  input {
    width: 100%;
    position: relative;
    height: 100%;
    text-indent: 35px;

    border-radius: var(--border-radius-m) var(--border-radius-m) 0 0;

    &:focus {
      outline-offset: -1px;
      z-index: 30;
    }

    opacity: 0;
    /* $startAnimation transition opacity 0 to 1 */
    ${({ $startAnimation }: { $startAnimation: boolean }) =>
      $startAnimation &&
      css`
        transition: opacity 0.05;
        opacity: 1;
      `}
  }
`
