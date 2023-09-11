import styled, { css } from 'styled-components'

export const CircleImage = styled.span`
  border-radius: 100%;
  aspect-ratio: 1/1;

  width: 30px;
  max-height: 30px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
  background-color: var(--md-sys-color-surface-container-highest);
  border: solid 1px var(--md-sys-color-outline);
  user-select: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* if highlight true make border green */
  ${({ $highlight }: { $highlight?: boolean }) =>
    $highlight &&
    css`
      border-color: var(--md-sys-color-tertiary);
    `}
`
