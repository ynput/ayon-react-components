import styled, { css, keyframes } from 'styled-components'

export const Button = styled.button<{
  $isChanged: boolean
  $isOpen: boolean
}>`
  /* remove defaults */
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  background-color: var(--color-grey-00);
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
    background-color: var(--color-grey-02);
  }

  border-radius: var(--border-radius);

  ${({ $isChanged }) =>
    $isChanged &&
    css`
      background-color: var(--color-hl-00);
      color: black;
      .icon {
        color: black;
      }

      :hover {
        filter: brightness(1.15);
        background-color: var(--color-hl-00);
      }
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: var(--input-disabled-background-color) !important;
      color: var(--color-text-dim);
      font-style: italic;

      .icon {
        opacity: 0.3;
      }
    `}
`

export const Dropdown = styled.div`
  position: relative;
  height: 30px;
  /* width: 100%; */
  display: inline-block;

  button {
    width: 100%;
  }

  & > * {
    height: 100%;
  }
`

export const Container = styled.form<{
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
        background-color: var(--color-grey-00);
        border-radius: var(--border-radius) var(--border-radius) 0 0;
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
  /* same border used as primereact dropdowns */
  border: 1px solid var(--color-grey-03);
  background-color: var(--color-grey-00);
  z-index: 20;
  border-radius: ${({ $message, $search }) =>
    $message || $search ? '0 0 var(--border-radius) var(--border-radius)' : 'var(--border-radius)'};
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
          animation: ${dropdownMenuAnimation($animationHeight)} 0.12s ease-in-out forwards;
          max-height: ${$maxHeight}px;
        `
      : css`
          opacity: 0;
          max-height: ${$maxHeight}px;
        `)}

  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
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

  ${({ $usingKeyboard, $disabled }) =>
    !$usingKeyboard &&
    (!$disabled
      ? css`
          &:hover {
            background-color: var(--color-grey-02);
          }
        `
      : css`
          cursor: not-allowed;
        `)}

  /* $focused */
    outline-offset: -1px;
  ${({ $focused }) =>
    $focused &&
    css`
      background-color: var(--color-grey-02);

      & > * {
        outline: solid #93cbf9 1px;
        outline-offset: -1px;
        border-radius: var(--border-radius);
      }
    `}

  /* start animation, slide down 100% height */
        ${({ $startAnimation }) =>
    $startAnimation &&
    css`
      animation: ${slideDown} 0.12s ease-in-out forwards;
    `}
`

export const DefaultItem = styled.span<{
  $isSelected: boolean
}>`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 30px;
  padding: 0 8px;

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background-color: var(--color-row-hl);
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

    border-radius: var(--border-radius) var(--border-radius) 0 0;

    &:focus {
      /* outline: unset;
        border: 1px solid var(--color-hl-00); */
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
