import styled, { css } from 'styled-components'
import { EntityCardProps } from './EntityCard'
import getShimmerStyles from '../helpers/getShimmerStyles'
import { Icon } from '../Icon'
import * as Theme from '../theme'

interface StyledEntityCardProps {
  $isActive: boolean
  $isSecondary?: boolean
  $variant?: EntityCardProps['variant']
  $isLoading?: boolean
  $isSuccess?: boolean
  $isError?: boolean
  $disabled?: boolean
  $isHover?: boolean
  $isDragging?: boolean
  $isDraggable?: boolean
}

const cardHoverStyles = css`
  background-color: var(--md-sys-color-surface-container-high-hover);

  /* hover to show description */
  .description {
    grid-template-rows: 1fr;
    /* transition-delay: 100ms; */
    padding-top: 2px;
  }
`

export const Card = styled.div<StyledEntityCardProps>`
  --loading-transition: 200ms;
  --hover-transition: 150ms;
  --selection-color: var(--md-sys-color-primary-container);
  --selection-color-hover: var(--md-sys-color-primary-container-hover);
  --selection-color-active: var(--md-sys-color-primary-container-active);
  --selection-color-text: var(--md-sys-color-on-primary-container);

  ${({ $isHover }) =>
    $isHover &&
    css`
      --hover-transition: 0ms;
    `}

  /* if $isSecondary, use secondary color */
  ${({ $isSecondary }) =>
    $isSecondary &&
    css`
      --selection-color: var(--md-sys-color-tertiary-container);
      --selection-color-hover: var(--md-sys-color-tertiary-container-hover);
      --selection-color-active: var(--md-sys-color-tertiary-container-active);
      --selection-color-text: var(--md-sys-color-on-tertiary-container);
    `}

  /* layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  /* size */
  min-width: 195px;
  height: auto;
  aspect-ratio: 16 / 9;

  padding: 4px;
  /* thumbnail variant no padding */
  ${({ $variant }) =>
    $variant === 'thumbnail' &&
    css`
      padding: 0;

      /* lighten thumbnail */
      &:hover .thumbnail::after {
        transition-duration: var(--hover-transition);
        transition-delay: 0;
        background-color: white;
        opacity: 0.2;
      }
    `}

  flex-shrink: 0;
  overflow: hidden;
  cursor: pointer;
  user-select: none;

  /* style */
  border-radius: var(--border-radius-xl);
  background-color: var(--md-sys-color-surface-container-high);

  &:hover {
    ${cardHoverStyles}
  }

  &:active {
    background-color: var(--md-sys-color-surface-container-high-active);
  }

  /* for keyboard selection when in dragging mode */
  ${({ $isDraggable }) =>
    $isDraggable &&
    css`
      &:has(:focus-visible),
      &:focus-visible {
        ${cardHoverStyles}
      }
    `}

  /* when active, set background color */
  ${({ $isActive, $variant, $isDraggable }) =>
    $isActive &&
    css`
      /* set backgrounds */
      background-color: var(--selection-color);
      color: var(--selection-color-text);

      &:hover {
        background-color: var(--selection-color-hover);
      }
      &:active {
        background-color: var(--selection-color-active);
      }

      ${$isDraggable &&
      css`
        &:focus-visible,
        &:has(:focus-visible) {
          background-color: var(--selection-color);
        }
      `}

      /* show drag handle cursor */
      cursor: grab;

      /* description stays open */
      .description {
        grid-template-rows: 1fr;
        padding-top: 2px;
        transition-delay: 0;
      }

      /* when variant = 'basic' titles are blue */
      ${$variant === 'basic' &&
      css`
        ${Title} {
          background-color: var(--selection-color);
        }
      `}
    `}

  ${getShimmerStyles(
    'var(--md-sys-color-surface-container-high)',
    'var(--md-sys-color-surface-container-highest)',
    {
      opacity: 1,
    },
  )}

    &::after {
    transition: opacity var(--loading-transition);
  }

  /* transition text/icons opacity for loading */
  .row > span > * {
    transition: opacity var(--loading-transition);
  }

  /* set opacity to 0 when not loading */
  ${({ $isLoading }) =>
    $isLoading
      ? css`
          /* LOADING ACTIVE */
          pointer-events: none;
          /* title card loading styles */
          .row > span {
            /* change color of cards */
            opacity: 0.7;
            min-width: 50%;

            &.status,
            &.notification {
              min-width: 28px;
            }
            /* hide all text and icons */
            & > * {
              opacity: 0;
              user-select: none;
              pointer-events: none;
            }
          }

          /* hide description */
          .description {
            grid-template-rows: 0fr !important;
            padding-top: 0 !important;
          }
        `
      : css`
          /* LOADING FINISHED */
          &::after {
            opacity: 0;
          }
        `}

  /* ERROR */
        ${({ $isError, $isDraggable }) =>
    $isError &&
    css`
      &,
      &:hover {
        background-color: var(--md-sys-color-error-container);
      }

      ${$isDraggable &&
      css`
        &:focus-visible,
        &:has(:focus-visible) {
          background-color: var(--md-sys-color-error-container);
        }
      `}

      .row > span {
        min-width: 50%;

        & > * {
          display: none;
        }

        &.status,
        &.notification {
          min-width: 28px;
        }
      }
    `}

    /* DISABLED */
    ${({ $disabled }) =>
    $disabled &&
    css`
      /* prevent clicks and hover */
      pointer-events: none;

      /* fade out text */
      .row > * > * {
        opacity: 0.5;
      }

      /* fade out image */
      .thumbnail {
        ::after {
          opacity: 0.75;
        }
      }
    `}

    transition: rotate 100ms;

  /* if we are dragging, hide description and rotate */
  ${({ $isDragging }) =>
    $isDragging &&
    css`
      /* box shadow */
      box-shadow: 0 0 20px 0px rgb(0 0 0 / 30%);
      rotate: 5deg;
      cursor: grabbing;

      .description {
        grid-template-rows: 0fr !important;
        padding-top: 0 !important;
      }
    `}
`

interface StyledThumbnailProps {
  $isImageLoading: boolean
  $isImageValid: boolean
  $disableImageAnimation: boolean
}

// THUMBNAIL
export const Thumbnail = styled.div<StyledThumbnailProps>`
  position: relative;
  display: flex;
  padding: 2px;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;

  border-radius: var(--border-radius-l);
  background-color: var(--md-sys-color-surface-container);

  /* image styles */
  background-size: cover;
  background-position: center;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    background-color: var(--md-sys-color-surface-container-high);
    transition: opacity var(--loading-transition);
    /* sometime the image takes a bit to show */
    transition-delay: 100ms;
  }

  ${({ $disableImageAnimation }) =>
    $disableImageAnimation &&
    css`
      &::after {
        display: none;
      }
    `}

  ${({ $isImageLoading }) =>
    $isImageLoading &&
    css`
      &::after {
        opacity: 1;
      }
    `}
`

// for the header and footer inside the thumbnail
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  z-index: 100;
  gap: 4px;
`

// little tags inside the thumbnail
export const Title = styled.span`
  display: flex;
  padding: 4px;
  align-items: center;
  min-height: 28px;
  overflow: hidden;

  span:not(.icon) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
    direction: rtl;
    /* font size etc */
    ${Theme.labelMedium}
  }

  border-radius: var(--border-radius-l);
  background-color: var(--md-sys-color-surface-container-high);
  /* opacity transition for loading styles */
  transition: opacity var(--loading-transition);

  &.status,
  &.description {
    min-width: 28px;
  }

  .icon {
    font-size: 20px;
  }

  &.subtitle {
    padding: 4px 6px;
  }
`

export const Description = styled.div`
  /* use the 1 row grid animation trick */
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--hover-transition), padding var(--hover-transition);
  max-height: 42%;

  span {
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    /* font size etc */
    ${Theme.labelMedium}
  }
`

export const NoImageIcon = styled(Icon)`
  position: absolute;
  /* center */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  color: var(--md-sys-color-outline);
`
