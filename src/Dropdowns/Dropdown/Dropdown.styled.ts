import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
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
export const dropdownMenuAnimation = () => keyframes`
    0% {
      transform: scaleY(0.8) scaleX(0.95);
      opacity: .3;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  `

export const Container = styled.div<{
  $isOpen: boolean
  $message: string
}>`
  width: 100%;
  position: relative;
  width: auto;
  display: inline-block;
  height: min-content;

  position: fixed;
  z-index: 2000;

  animation: ${dropdownMenuAnimation()} 0.06s ease forwards;
  transform-origin: top center;

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

type ScrollableProps = {
  $message: string
  $search: boolean
}

export const Scrollable = styled(OverlayScrollbarsComponent)<ScrollableProps>`
  border: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: ${({ $message, $search }) =>
    $message || $search
      ? '0 0 var(--border-radius-m) var(--border-radius-m)'
      : 'var(--border-radius-m)'};

  box-shadow: 0 1px 16px rgb(0 0 0 / 20%);

  .os-scrollbar-handle {
    background-color: var(--md-sys-color-surface-container-highest);
    opacity: 0.75;

    &:hover {
      opacity: 1;
      background-color: var(--md-sys-color-surface-container-highest);
    }

    &:active {
      background-color: var(--md-sys-color-surface-container-highest-active);
    }
  }
`

export const Options = styled.ul`
  width: auto;
  list-style-type: none;
  padding: unset;

  display: flex;
  flex-direction: column;

  margin: 0px;

  z-index: 20;

  position: relative;

  /* fixes focus outline being cutoff for first item */
  padding-top: 1px;
  margin-top: -1px;

  /* move first child up by 1px to line up with list item (as it has no bottom border) */
  li:first-child {
    margin-top: -1px;
  }
`

export const ListItem = styled.li<{
  $focused: boolean
  $usingKeyboard: boolean
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
  }
`
