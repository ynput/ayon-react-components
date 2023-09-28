import styled, { css } from 'styled-components'

export const Card = styled.div<{ $disabled: boolean }>`
  background-color: var(--md-sys-color-primary);
  span:not(.action) {
    color: var(--md-sys-color-on-primary);
    font-weight: 500;
  }

  /* layout */
  display: flex;
  padding: 0px 4px;
  justify-content: center;
  align-items: center;
  min-height: unset;
  gap: 4px;
  overflow: hidden;

  /* styling */
  border-radius: 9px;
  pointer-events: all;

  .remove {
    border-radius: 100%;
    padding: 0;
    font-size: 16px;

    color: var(--md-sys-color-on-primary);
    /* increase the icon weight */
  }

  .icon {
    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 300, 'opsz' 20;
  }

  /* prevent hover when disabled */
  ${({ $disabled }) =>
    $disabled
      ? css`
          pointer-events: none;
        `
      : css`
          .remove {
            &:hover {
              background-color: var(--md-sys-color-on-primary-hover);
              color: var(--md-sys-color-on-surface);
            }
            &:active {
              background-color: var(--md-sys-color-on-primary-active);
            }
          }

          .sort-order {
            &:hover {
              background-color: var(--md-sys-color-on-primary-hover);

              .icon {
                color: var(--md-sys-color-on-surface);
              }
            }
            &:active {
              background-color: var(--md-sys-color-on-primary-active);
            }
          }
        `}
`

export const SortWrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 100%;

  .icon {
    font-size: 20px;
  }
`
