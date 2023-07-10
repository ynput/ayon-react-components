import styled, { css } from 'styled-components'
import { EntityCardProps } from './EntityCard'

interface StyledEntityCardProps {
  $isActive: boolean
  $isSecondary?: boolean
  $variant?: EntityCardProps['variant']
}

export const StyledEntityCard = styled.div<StyledEntityCardProps>`
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
`
export const StyledThumbnail = styled.div`
  display: flex;
  padding: 2px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;

  border-radius: var(--card-border-radius-m);
  background-color: var(--button-background);
`

// for the header and footer inside the thumbnail
export const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

// little tags inside the thumbnail
export const StyledTitle = styled.span`
  display: flex;
  padding: 4px;
  align-items: center;
  min-height: 28px;

  border-radius: var(--card-border-radius-m);
  background: var(--card-background, #2c313a);

  .icon {
    font-size: 20px;
  }

  &.subtitle {
    padding: 4px 6px;
  }
`

export const StyledDescription = styled.div`
  /* use the 1 row grid animation trick */
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 150ms, padding 150ms;

  /* when hovering set to 1fr */
  /* also when $isActive but that's set in StyledEntityCard */
  ${StyledEntityCard}:hover & {
    grid-template-rows: 1fr;
    transition-delay: 100ms;
    padding-top: 2px;
  }

  span {
    word-break: break-all;
    font-size: 12px;
    overflow: hidden;
  }
`
