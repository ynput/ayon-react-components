import styled, { css, keyframes } from 'styled-components'
import getShimmerStyles from '../helpers/getShimmerStyles'
import { Button } from '../Button'
import { ButtonProps } from '../Button/Button.styled'

const messageAnimation = keyframes`
  from {
    scale: 0.5;
    translate: 0 -50%;
    opacity: 0;
  }
  to {
    scale: 1;
    opacity: 1;
    translate: 0 -100%;
  }
`

interface FileCardProps {
  $isFetching: boolean
  $message?: string
}

export const FileCard = styled.div<FileCardProps>`
  background-color: var(--md-sys-color-surface-container-high);
  display: flex;
  border-radius: 4px;
  padding: 2px;
  align-items: center;
  cursor: pointer;
  gap: 4px;
  position: relative;

  .title {
    margin-left: 4px;
  }

  .length {
    opacity: 0.5;
    white-space: nowrap;
  }

  .size {
    opacity: 0.5;
    margin: 0 4px;
    white-space: nowrap;
  }

  .icon {
    font-size: 24px;
  }

  img {
    width: 24px;
    height: 24px;
    object-fit: cover;
    border-radius: 4px;
  }

  ${({ $isFetching }) =>
    $isFetching &&
    css`
      user-select: none;
      pointer-events: none;

      & > * {
        opacity: 0.5;
      }

      ${getShimmerStyles(undefined, undefined, {
        // random number between 0.2 and 1.5
        delay: Math.random() * (1.5 - 0.2) + 0.2,
        speed: 1,
      })}
    `}

  ${({ $message }) =>
    $message &&
    css`
      &:hover {
        /* little triangle */
        &::before {
          content: '';
          position: absolute;
          translate: 0 -100%;
          top: -8px;
          right: 12px;
          border: 4px solid transparent;
          border-top-color: var(--md-custom-color-warning);
          border-right-color: var(--md-custom-color-warning);
          rotate: 135deg;
          animation: ${messageAnimation} 100ms ease-in-out;
          transform-origin: bottom;
        }

        &::after {
          content: '${$message}';
          position: absolute;
          top: -4px;

          padding: 4px;
          border-radius: 4px;
          font-size: 12px;
          right: -8px;
          translate: 0 -100%;
          animation: ${messageAnimation} 100ms ease-in-out;
          transform-origin: right;
          background-color: var(--md-custom-color-warning);
          color: black;
        }
      }
    `}
`

interface IconProps extends ButtonProps {
  $error?: boolean
}

export const Icon = styled(Button)<IconProps>`
  padding: 2px;

  .icon {
    color: var(--md-sys-color-on-surface);
  }

  ${({ $error }) =>
    $error &&
    css`
      .icon {
        color: var(--md-custom-color-warning);
      }
    `}
`
