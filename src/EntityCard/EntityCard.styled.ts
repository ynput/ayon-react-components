import styled, { css } from 'styled-components'
import { EntityCardProps } from './EntityCard'
import { Icon } from '../Icon'
import * as Theme from '../theme'

const showFullPath = css`
  /* show full path */
  .header .expander {
    grid-template-columns: 1fr;
    .path {
      padding-right: 4px;
    }
  }
`

interface StyledEntityCardProps {
  $variant?: EntityCardProps['variant']
}

const cardHoverStyles = css`
  background-color: var(--md-sys-color-surface-container-high-hover);
  box-shadow: inset 0 0 0 2px var(--md-sys-color-surface-container-high-hover);

  ${showFullPath}
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

  /* layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  /* size */
  min-width: 208px;
  height: auto;

  aspect-ratio: 16 / 9;
  &:has(.header) {
    aspect-ratio: 16 / 10.5;
  }

  padding: 2px;

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
  &.active {
    /* set backgrounds */
    background-color: var(--selection-color);
    color: var(--selection-color-text);
    /* show drag handle cursor */
    cursor: grab;

    box-shadow: inset 0 0 0 2px var(--primary-color);

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
  }

  &::after {
    transition: opacity var(--loading-transition);
  }

  /* transition text/icons opacity for loading */
  .row > span > * {
    transition: opacity var(--loading-transition);
  }

  .users {
    background-color: unset;
    border-radius: 14px;
    min-width: max-content;

    .user-image {
      border-color: var(--md-sys-color-surface-container-high);
      padding: 0px;
    }
  }

  &.isLoading {
    /* LOADING ACTIVE */
    pointer-events: none;
    /* title card loading styles */
    .row > span {
      &.status,
      &.notification,
      &.users {
        min-width: 28px;
      }
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
      &.users {
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

  /* if we are dragging, rotate */
  &.isDragging {
    /* box shadow */
    box-shadow: 0 0 20px 0px rgb(0 0 0 / 30%);
    rotate: 5deg;
    cursor: grabbing;
  }
`

export const Header = styled.div`
  width: 100%;
  height: 20px;
  padding: 0px 4px;
  display: flex;

  /* CSS trick to expand width with transition */
  .expander {
    display: grid;
    grid-template-columns: 0fr;
    transition: grid-template-columns 130ms;
    overflow: hidden;
  }

  .path {
    min-width: 0;
    padding-right: 0px;
    transition: padding-right 130ms;
  }

  span {
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .shot {
    ${Theme.labelLarge}
    flex: 1;
  }
`

interface StyledThumbnailProps {}

// THUMBNAIL
export const Thumbnail = styled.div<StyledThumbnailProps>`
  position: relative;
  display: flex;
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
  z-index: 100;
  gap: 4px;

  position: absolute;
  left: 2px;
  right: 2px;

  &.row-top {
    top: 2px;
  }

  &.row-bottom {
    bottom: 2px;
  }
`

// little tags inside the thumbnail
export const Tag = styled.span`
  --size: 28px;
  max-height: var(--size);
  min-height: var(--size);
  min-width: var(--size);
  padding: 2px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  overflow: hidden;

  span:not(.icon) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
    /* font size etc */
    ${Theme.labelMedium}
    padding-right: 2px;
  }

  border-radius: var(--border-radius-l);
  background-color: var(--md-sys-color-surface-container-high);
  /* opacity transition for loading styles */
  transition: opacity var(--loading-transition);

  .icon {
    font-size: 20px;
  }

  &.subTitle {
    .inner-text {
      direction: rtl;
      unicode-bidi: plaintext;
    }
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
