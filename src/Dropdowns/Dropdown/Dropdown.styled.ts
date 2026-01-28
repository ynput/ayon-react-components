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

// export Button as type
export type ButtonType = typeof Button

export const Dropdown = styled.div`
  position: relative;
  height: 32px;
  /* width: 100%; */
  display: inline-block;
  overflow: hidden;

  button {
    width: 100%;
  }

  & > * {
    height: 100%;
  }
`
export const dropdownMenuAnimation = () => keyframes`
    0% {
      transform: scaleY(0.85) scaleX(0.95);
      opacity: .6;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  `

export const Container = styled.div<{
  $isOpen: boolean
  $message: string
  $messageOverButton?: boolean
  $error: string
  $hidden: boolean
}>`
  width: 100%;
  position: relative;
  width: auto;
  display: inline-block;
  height: min-content;

  position: fixed;
  z-index: 10000;

  ${({ $hidden }) =>
    !$hidden &&
    css`
      animation: ${dropdownMenuAnimation()} 0.05s ease-out forwards;
    `};
  transform-origin: top center;

  /* show warning when changing multiple entities */
  ${({ $isOpen, $message, $error, $messageOverButton }) =>
    $isOpen &&
    ($error || $message) &&
    css`
      &::before {
        content: '${$error || $message}';
        top: 0;
        translate: 0 calc(-32px - 100%);
        position: absolute;

        background-color: var(--md-sys-color-surface-container-low);
        border-radius: var(--border-radius-m);
        z-index: 10;
        display: flex;
        align-items: center;
        padding: 4px 0;
        right: 0;
        left: 0;
        border: 1px solid var(--md-sys-color-outline-variant);
        justify-content: center;

        /* error styling */
        ${$error &&
        css`
          color: var(--md-sys-color-on-error-container);
          background-color: var(--md-sys-color-error-container);
        `}

        /* position message */
        ${$messageOverButton &&
        css`
          translate: 0 -100%;
          border-bottom: 0;
          border-radius: var(--border-radius-m) var(--border-radius-m) 0 0;
        `}
      }
    `}
`

export const Scrollable = styled(OverlayScrollbarsComponent)`
  border: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container-low);

  border-radius: var(--border-radius-m);
  &.no-top-radius {
    border-radius: 0 0 var(--border-radius-m) var(--border-radius-m);
  }

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
  $usingKeyboard: boolean
}>`
  cursor: pointer;
  user-select: none;

  ${({ $usingKeyboard }) =>
    !$usingKeyboard &&
    css`
      &:hover {
        background-color: var(--md-sys-color-surface-container-low-hover);
      }
      &:active {
        background-color: var(--md-sys-color-surface-container-low-active);
      }
    `}

  &.disabled {
    .option-child {
      background-color: var(--md-sys-color-surface-container-low) !important;
      color: var(--md-sys-color-outline);

      .icon {
        opacity: 0.5;
      }
    }
    /* remove hover affect */
    &:hover {
      background-color: var(--md-sys-color-surface-container-low);
    }
    cursor: default;
  }

  /* $focused */
  outline-offset: -1px;
  &.focused {
    background-color: var(--md-sys-color-surface-container-low-hover);

    & > * {
      outline: solid var(--focus-color) 1px;
      outline-offset: -1px;
      border-radius: var(--border-radius-m);
    }
  }
`

export const StartContent = styled.div`
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--border-radius-m) var(--border-radius-m) 0 0;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-bottom: none;
  padding: 4px;
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

  &.startContent {
    input {
      border-radius: 0;
    }
  }
`
