import styled from 'styled-components'

interface StyledEntityCardProps {
  $isActive: boolean
}

export const StyledEntityCard = styled.div<StyledEntityCardProps>`
  /* layout */
  display: flex;
  width: 200px;
  height: 112px;
  padding: 4px;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;

  /* style */
  border-radius: var(--card-border-radius-l);
  background-color: var(--card-background);

  &:hover {
    background-color: var(--button-background);
  }
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
`

// little tags inside the thumbnail
export const StyledTitle = styled.span`
  display: flex;
  padding: 2px 4px;
  align-items: center;

  border-radius: var(--card-border-radius-m);
  background: var(--card-background, #2c313a);
`

export const StyledDescription = styled.span`
  word-break: break-all;
`
