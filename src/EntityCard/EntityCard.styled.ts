import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import * as Theme from '../theme'

const showFullPath = css`
  /* show full path */
  grid-template-columns: 1fr;
  .path {
    padding-right: 4px;
  }
`

const boxShadowSizes = `inset 0 0 0 2px`

const cardHoverStyles = css`
  background-color: var(--md-sys-color-surface-container-high-hover);
  box-shadow: ${boxShadowSizes} var(--md-sys-color-surface-container-high-hover);

  .header .expander {
    ${showFullPath}
  }
`

type CardProps = {
  $statusColor?: string
}

export const Card = styled.div<CardProps>`
  --hover-duration: 150ms;
  --hover-transition: var(--hover-duration);
  --selection-color: var(--md-sys-color-primary-container);
  --selection-color-hover: var(--md-sys-color-primary-container-hover);
  --selection-color-active: var(--md-sys-color-primary-container-active);
  --selection-color-text: var(--md-sys-color-on-primary-container);
  --primary-color: var(--md-sys-color-primary);

  &.hover {
    --hover-transition: 0ms;
  }

  /* layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  /* size */
  height: auto;
  min-height: 110px;
  max-height: 170px;
  width: 100%;

  aspect-ratio: 16 / 9;
  &:has(.header) {
    aspect-ratio: 16 / 10.5;
  }

  padding: 2px;

  flex-shrink: 0;
  overflow: hidden;
  cursor: pointer;
  user-select: none;

  /* style */
  border-radius: var(--border-radius-xxl);
  background-color: var(--md-sys-color-surface-container-high);
  box-shadow: ${boxShadowSizes} var(--md-sys-color-surface-container-high);

  &:hover {
    ${cardHoverStyles}
  }

  &:active {
    background-color: var(--md-sys-color-surface-container-high-active);
  }

  /* for keyboard selection when in dragging mode */
  &.draggable {
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

    box-shadow: ${boxShadowSizes} var(--primary-color);

    &:hover {
      background-color: var(--selection-color-hover);
    }
    &:active {
      background-color: var(--selection-color-active);
    }

    &.draggable {
      &:focus-visible,
      &:has(:focus-visible) {
        background-color: var(--selection-color);
      }
    }
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
    .row > span {
      &.status,
      &.notification,
      &.users {
        min-width: 28px;
      }
    }
  }

  &.error {
    &,
    &:hover {
      background-color: var(--md-sys-color-error-container);
    }

    &.draggable {
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
  }

  /* VARIANT */
  &.status {
    /* change bg colour and box shadow color */
    box-shadow: ${boxShadowSizes} ${(props) => props.$statusColor};
    background-color: ${(props) => props.$statusColor};

    .status {
      background-color: ${(props) => props.$statusColor};
      /* targets label and icon */
      span {
        color: var(--md-sys-color-inverse-on-surface) !important;
      }
    }

    /* on hover show status label */
    &:hover,
    &.active {
      .status-label.expander {
        padding: 0 2px;
        grid-template-columns: 1fr;
      }
    }

    &.active {
      .thumbnail {
        border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
      }

      .row-bottom {
        .tag {
          background-color: ${(props) => props.$statusColor};
        }
        .users .user-image {
          border-color: ${(props) => props.$statusColor};
        }

        /* priority icon */
        .icon {
          color: var(--md-sys-color-inverse-on-surface) !important;
        }
      }
      /* expand status full width */
      /* hide icon */
      .status {
        border-radius: 0px;
        width: 100%;
        bottom: 0;
        min-height: calc(var(--size) + 4px);
        max-height: calc(var(--size) + 4px);
      }
    }
  }

  /* COLLAPSED (mostly for status variant) */
  &.collapsed {
    min-height: 34px;
    max-height: 34px;

    .thumbnail {
      border-radius: 0 !important;
      transition: border-bottom-left-radius var(--hover-duration),
        border-bottom-right-radius var(--hover-duration),
        border-top-right-radius var(--hover-duration) var(--hover-duration),
        border-top-top-radius var(--hover-duration) var(--hover-duration);
    }
  }

  transition: rotate 100ms, max-height 150ms, min-height 150ms, aspect-ratio 150ms;

  /* if we are dragging, rotate */
  &.dragging {
    /* box shadow */
    box-shadow: 0 0 20px 0px rgb(0 0 0 / 30%);
    rotate: 5deg;
    cursor: grabbing;
  }

  container-name: card;
  container-type: inline-size;
  /* use container query for when the card gets smaller */
  @container card (inline-size < 150px) {
    .playable {
      display: none;
    }
    .title {
      .icon {
        display: none;
      }
      .inner-text {
        padding: 0 2px;
      }
    }
  }
  @container card (inline-size < 100px) {
    .playable {
      display: none;
    }
    /* hide title text but show icon */
    .title {
      .icon {
        display: block;
      }
      .inner-text {
        display: none;
      }
    }

    /* hide status */
    .status {
      display: none;
    }
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

    /* always show path */
    &.show {
      ${showFullPath}
    }
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

// THUMBNAIL
export const Thumbnail = styled.div`
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

  transition: border-bottom-left-radius var(--hover-duration),
    border-bottom-right-radius var(--hover-duration);

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
    bottom: 0px;
    left: 0px;
    right: 0px;
    padding: 2px;
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
  z-index: 10;
  transition: all var(--hover-duration);

  &.title span:not(.icon) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
    /* font size etc */
    ${Theme.labelMedium}
    padding-right: 2px;
  }

  &:not(:has(.icon)) {
    padding: 0 2px;
  }

  border-radius: var(--border-radius-l);
  background-color: var(--md-sys-color-surface-container-high);

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

export const StatusWrapper = styled.div`
  z-index: 0;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  min-height: calc(var(--size) + 4px);
  max-height: calc(var(--size) + 4px);

  display: flex;
  justify-content: center;
  align-items: flex-end;
  .status {
    transition: all var(--hover-duration);
    position: relative;
    bottom: 2px;
    gap: 0px;

    /* CSS trick to expand width with transition */
    .status-label.expander {
      padding: 0;
      display: grid;
      grid-template-columns: 0fr;
      transition: all 130ms;
      span {
        overflow: hidden;
      }
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
