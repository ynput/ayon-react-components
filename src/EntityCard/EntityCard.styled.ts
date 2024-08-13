import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import * as Theme from '../theme'
import adjustHexBrightness from '../helpers/adjustHexBrightness'

const showFullPath = css`
  /* show full path */
  grid-template-columns: 1fr;
  .path {
    padding-right: 4px;
  }
`

const boxShadowSizes = `inset 0 0 0 2px`

const cardHoverStyles = css`
  background-color: var(--default-color-hover);
  box-shadow: ${boxShadowSizes} var(--default-color-hover);

  .header .expander {
    ${showFullPath}
  }
`

type CardProps = {
  $statusColor?: string
}

export const Card = styled.div<CardProps>`
  --size: 28px;
  --hover-duration: 150ms;
  --hover-transition: var(--hover-duration);
  --default-color: var(--md-sys-color-surface-container-high);
  --default-color-hover: var(--md-sys-color-surface-container-high-hover);
  --default-color-active: var(--md-sys-color-surface-container-high-active);
  --active-color: var(--md-sys-color-primary-container);
  --active-color-hover: var(--md-sys-color-primary-container-hover);
  --active-color-active: var(--md-sys-color-primary-container-active);
  --active-color-text: var(--md-sys-color-on-primary-container);
  --active-border-color: var(--md-sys-color-primary);

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

  /* change bg color based on variant */
  &.status {
    /* change bg colour and box shadow color */
    --default-color: ${(props) => props.$statusColor};

    --default-color-lighter: ${(props) =>
      props.$statusColor ? adjustHexBrightness(props.$statusColor, 8) : undefined};
    --default-color-darker: ${(props) =>
      props.$statusColor ? adjustHexBrightness(props.$statusColor, -8) : undefined};

    --default-color-hover: var(--default-color-lighter);
    --default-color-active: ${(props) => props.$statusColor};
    /* Active is the same as default */
    --active-color: var(--default-color);
    --active-color-hover: var(--default-color-hover);
    --active-color-active: var(--default-color-active);
    --active-border-color: var(--active-color);
    &:hover {
      --active-border-color: var(--active-color-hover);
    }
    &:active {
      --active-border-color: var(--active-color-active);
    }
  }

  &.isLoading {
    --default-color: var(--md-sys-color-surface-container);
    --default-color-hover: var(--md-sys-color-surface-container);
    --default-color-active: var(--md-sys-color-surface-container);
  }

  /* style */
  border-radius: var(--border-radius-xxl);
  background-color: var(--default-color);
  box-shadow: ${boxShadowSizes} var(--default-color);

  &:hover {
    ${cardHoverStyles}
  }

  &:active {
    background-color: var(--default-color-active);
  }

  /* for keyboard active when in dragging mode */
  &.draggable {
    &:has(:focus-visible),
    &:focus-visible {
      ${cardHoverStyles}
    }
  }

  /* when active, set background color */
  &.active:not(.isLoading) {
    /* set backgrounds */
    background-color: var(--active-color);
    color: var(--active-color-text);

    box-shadow: ${boxShadowSizes} var(--active-border-color);

    &:hover {
      background-color: var(--active-color-hover);
    }
    &:active {
      background-color: var(--active-color-active);
    }

    &.draggable {
      /* show drag handle cursor */
      cursor: grab;
      &:focus-visible,
      &:has(:focus-visible) {
        background-color: var(--active-color);
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
    .tag.status {
      background-color: var(--active-color);
      /* targets label and icon */
      span {
        color: var(--md-sys-color-inverse-on-surface) !important;
      }
    }

    /* hover but not active */
    &:not(.active):hover {
      .tag.status {
        background-color: var(--active-color-hover);
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
          background-color: var(--default-color);
        }
        .users {
          .user-image {
            border-color: var(--default-color);
          }
        }

        /* priority icon */
        .icon {
          color: var(--md-sys-color-inverse-on-surface) !important;
        }
      }
      /* expand status full width */
      /* hide icon */
      .status-wrapper {
        background-color: var(--default-color);
        border-radius: 0px;
        width: 100%;
        bottom: 0;
        min-height: calc(var(--size) + 4px);
        max-height: calc(var(--size) + 4px);
      }

      &:hover {
        /* remove shadow (border) hover */
        box-shadow: ${boxShadowSizes} var(--default-color);
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

    .row.row-bottom {
      bottom: -1px;
    }
  }

  transition: rotate 100ms, max-height 150ms, min-height 150ms, aspect-ratio 150ms, box-shadow 150ms;

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
    transition: bottom var(--hover-transition);
  }
`

// little tags inside the thumbnail
export const Tag = styled.span`
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

  &.isLoading {
    opacity: 0.2;
    background-color: var(--md-sys-color-surface-container-high) !important;
    & > * {
      visibility: hidden;
    }
  }

  /* user image overrides */
  &.users {
    padding: 0 1px;
    background-color: unset;

    .user-image {
      border-color: var(--md-sys-color-surface-container-high);
      padding: 0px;
    }
  }

  &.subTitle {
    .inner-text {
      direction: rtl;
      unicode-bidi: plaintext;
    }
  }

  &.tag.editable:hover {
    background-color: var(--default-color-darker) !important;
  }

  &.tag.editable.users:hover .user-image {
    border-color: var(--default-color-darker) !important;
  }
`

// container is always full width
export const StatusContainer = styled.div`
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

  /* the wrapper is the element that expands full width */
  .status-wrapper {
    max-height: var(--size);
    min-height: var(--size);
    min-width: var(--size);
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    bottom: 2px;
    gap: 0px;
    border-radius: var(--border-radius-l);
  }

  .status {
    gap: 0px;
    .status-label {
      white-space: nowrap;
    }
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

export const Editor = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 32px;

  display: grid;
  grid-template-columns: 1fr; /* Single column */
  grid-template-rows: 1fr;

  .dropdown {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    width: 100%;
    visibility: hidden;
    z-index: 0;

    /* hide everything inside */
    & > * > * {
      display: none;
    }
  }
`

export const EditorLeaveZone = styled.div`
  position: absolute;
  bottom: -6px;
  left: -6px;
  right: -6px;
  top: -6px;
`
