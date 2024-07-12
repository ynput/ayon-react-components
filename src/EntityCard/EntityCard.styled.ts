import styled, { css } from 'styled-components'
import { EntityCardProps } from './EntityCard'
import getShimmerStyles from '../helpers/getShimmerStyles'
import { Icon } from '../Icon'
import * as Theme from '../theme'

interface StyledEntityCardProps {
  $variant?: EntityCardProps['variant']
}

const cardHoverStyles = css`
  background-color: var(--md-sys-color-surface-container-high-hover);

  /* hover to show description */
  .description {
    grid-template-rows: 1fr;
    /* transition-delay: 100ms; */
    padding: 2px;
    padding-bottom: 0;
  }
`
const blueTitleStyles = css`
  .inner-card {
    background-color: var(--selection-color);
  }
  &:hover .inner-card {
    background-color: var(--selection-color-hover);
  }
`

export const Card = styled.div<StyledEntityCardProps>`
  --loading-transition: 200ms;
  --hover-transition: 150ms;
  --selection-color: var(--md-sys-color-primary-container);
  --selection-color-hover: var(--md-sys-color-primary-container-hover);
  --selection-color-active: var(--md-sys-color-primary-container-active);
  --selection-color-text: var(--md-sys-color-on-primary-container);
  --primary-color: var(--md-sys-color-primary);

  &.isHover {
    --hover-transition: 0ms;
  }

  /* if $isSecondary, use secondary color */
  &.isSecondary {
    --selection-color: var(--md-sys-color-tertiary-container);
    --selection-color-hover: var(--md-sys-color-tertiary-container-hover);
    --selection-color-active: var(--md-sys-color-tertiary-container-active);
    --selection-color-text: var(--md-sys-color-on-tertiary-container);
    --primary-color: var(--md-sys-color-tertiary);
  }

  /* layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  /* size */
  min-width: 208px;
  height: auto;
  aspect-ratio: 16 / 9;

  padding: 2px;

  &,
  .thumbnail {
    transition: padding 100ms ease;

    padding: 2px;
    &.isActive.isActiveAnimate {
      padding: 4px;
    }
  }

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
  border-radius: var(--border-radius-xxl);
  background-color: var(--md-sys-color-surface-container-high);
  box-shadow: inset 0 0 0 2px var(--md-sys-color-surface-container-high);

  &:hover {
    ${cardHoverStyles}

    &.isFullHighlight {
      .inner-card {
        background-color: var(--md-sys-color-surface-container-high-hover);
      }
    }
  }

  &:active {
    background-color: var(--md-sys-color-surface-container-high-active);
  }

  /* for keyboard selection when in dragging mode */
  &.isDraggable {
    &:has(:focus-visible),
    &:focus-visible {
      ${cardHoverStyles}
    }
  }

  /* when active, set background color */
  &.isActive {
    /* set backgrounds */
    background-color: var(--selection-color);
    color: var(--selection-color-text);
    /* show drag handle cursor */
    cursor: grab;

    box-shadow: inset 0 0 0 2px var(--primary-color);

    /* description stays open */
    .description {
      grid-template-rows: 1fr;
      padding: 2px;
      padding-bottom: 0;
      transition-delay: 0;
    }

    &:hover {
      background-color: var(--selection-color-hover);
    }
    &:active {
      background-color: var(--selection-color-active);
    }

    &.isDraggable {
      &:focus-visible,
      &:has(:focus-visible) {
        background-color: var(--selection-color);
      }
    }

    /* $variant = 'basic' titles are blue */
    ${({ $variant }) => $variant === 'basic' && blueTitleStyles}

    /* isFullHighlight title are blue */
    &.isFullHighlight {
      ${blueTitleStyles}
    }
  }

  ${getShimmerStyles(
    'var(--md-sys-color-surface-container-high)',
    'var(--md-sys-color-surface-container-highest)',
    {
      opacity: 0.5,
      speed: 1.5,
    },
  )}

  &::after {
    transition: opacity var(--loading-transition);
  }

  /* transition text/icons opacity for loading */
  .row > span > * {
    transition: opacity var(--loading-transition);
  }

  .assignees {
    padding: 1px;
    border-radius: 14px;
    min-width: max-content;
    color: red;

    .user-image {
      border-color: var(--md-sys-color-surface-container-high);
    }
  }

  &.isLoading {
    /* LOADING ACTIVE */
    pointer-events: none;
    /* title card loading styles */
    .row > span {
      /* change color of cards */
      opacity: 1;
      min-width: 50%;
      position: relative;
      /* shimmer */
      ${getShimmerStyles(
        'var(--md-sys-color-surface-container-high)',
        'var(--md-sys-color-surface-container-highest)',
        {
          opacity: 0.5,
          speed: 1.5,
        },
      )}

      &.status,
            &.notification,
            &.assignees {
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
  }

  &:not(.isLoading) {
    /* LOADING FINISHED */
    &::after {
      opacity: 0;
    }
  }

  &.isError {
    &,
    &:hover {
      background-color: var(--md-sys-color-error-container);
    }

    &.isDraggable {
      &:focus-visible,
      &:has(:focus-visible) {
        background-color: var(--md-sys-color-error-container);
      }
    }

    .row > span {
      min-width: 50%;

      & > * {
        display: none;
      }

      &.status,
      &.notification,
      &.assignees {
        min-width: 28px;
      }
    }
  }

  &.disabled {
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
  }

  transition: rotate 100ms;

  /* if we are dragging, hide description and rotate */
  &.isDragging {
    /* box shadow */
    box-shadow: 0 0 20px 0px rgb(0 0 0 / 30%);
    rotate: 5deg;
    cursor: grabbing;

    .description {
      grid-template-rows: 0fr !important;
      padding-top: 0 !important;
    }
  }
`

interface StyledThumbnailProps {}

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
  z-index: 50;

  border-radius: var(--border-radius-xl);
  background-color: var(--md-sys-color-surface-container);
`

// IMAGE
export const Image = styled.img`
  background-color: var(--md-sys-color-surface-container);
  z-index: 10;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  /* loading transition */
  opacity: 1;
  transition: opacity 500ms;

  &.loading {
    opacity: 0;
  }
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
  gap: 4px;
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

  /* loading transition */
  opacity: 1;
  transition: opacity 500ms;

  &.loading {
    opacity: 0;
  }
`
