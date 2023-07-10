import styled, { css } from 'styled-components'
import { EntityCardProps } from './EntityCard'
import getShimmerStyles from '../helpers/getShimmerStyles'
import { Icon } from '../Icon'

interface StyledEntityCardProps {
  $isActive: boolean
  $isSecondary?: boolean
  $variant?: EntityCardProps['variant']
  $isLoading?: boolean
  $isSuccess?: boolean
  $isError?: boolean
}

export const StyledEntityCard = styled.div<StyledEntityCardProps>`
  --loading-transition: 200ms;
  --hover-transition: 150ms;
  --selection-color: var(--selected-blue);

  /* if $isSecondary, use secondary color */
  ${({ $isSecondary }) =>
    $isSecondary &&
    css`
      --selection-color: var(--selected-green);
    `}

  /* layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  /* size */
  min-width: 200px;
  height: auto;
  aspect-ratio: 16 / 9;

  padding: 4px;

  flex-shrink: 0;
  overflow: hidden;
  cursor: pointer;
  user-select: none;

  /* style */
  border-radius: var(--card-border-radius-l);
  background-color: var(--card-background);

  &:hover {
    background-color: var(--card-hover);

    /* hover to show description */
    .description {
      grid-template-rows: 1fr;
      /* transition-delay: 100ms; */
      padding-top: 2px;
    }
  }

  /* when active, set background color */
  ${({ $isActive, $variant }) =>
    $isActive &&
    css`
      /* set backgrounds */
      &,
      &:hover {
        background-color: var(--selection-color);
      }

      /* description stays open */
      .description {
        grid-template-rows: 1fr;
        padding-top: 2px;
        transition-delay: 0;
      }

      /* when variant = 'basic' titles are blue */
      ${$variant === 'basic' &&
      css`
        ${StyledTitle} {
          background-color: var(--selection-color);
        }
      `}
    `}

  ${getShimmerStyles('var(--color-grey-02)', 'var(--color-grey-03)', {
    opacity: 1,
  })}

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
        ${({ $isError }) =>
    $isError &&
    css`
      &,
      &:hover {
        background-color: var(--color-hl-error);
      }

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
`

interface StyledThumbnailProps {
  $isImageLoading: boolean
  $isImageValid: boolean
}

// THUMBNAIL
export const StyledThumbnail = styled.div<StyledThumbnailProps>`
  position: relative;
  display: flex;
  padding: 2px;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;

  border-radius: var(--card-border-radius-m);
  background-color: var(--card-hover);

  /* image styles */
  background-size: cover;
  background-position: center;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    background-color: var(--button-background);
    transition: opacity var(--loading-transition);
    /* sometime the image takes a bit to show */
    transition-delay: 100ms;
  }

  ${({ $isImageLoading }) =>
    $isImageLoading &&
    css`
      &::after {
        opacity: 1;
      }
    `}
`

// for the header and footer inside the thumbnail
export const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  z-index: 100;
`

// little tags inside the thumbnail
export const StyledTitle = styled.span`
  display: flex;
  padding: 4px;
  align-items: center;
  min-height: 28px;

  border-radius: var(--card-border-radius-m);
  background-color: var(--card-background, #2c313a);
  /* opacity transition for loading styles */
  transition: opacity var(--loading-transition);

  .icon {
    font-size: 20px;
  }

  &.subtitle {
    padding: 4px 6px;
    font-weight: bold;
  }
`

export const StyledDescription = styled.div`
  /* use the 1 row grid animation trick */
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--hover-transition), padding var(--hover-transition);

  span {
    word-break: break-all;
    font-size: 12px;
    overflow: hidden;
  }
`

export const NoImageIcon = styled(Icon)`
  position: absolute;
  /* center */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  color: var(--card-background);
`
