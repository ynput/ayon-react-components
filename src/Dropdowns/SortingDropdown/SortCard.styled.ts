import styled, { css } from 'styled-components'

export const Card = styled.div<{ $disabled: boolean }>`
  background-color: var(--md-sys-color-primary);
  span:not(.remove) {
    color: var(--md-sys-color-on-primary);
  }

  /* layout */
  display: flex;
  padding: 0px 4px;
  justify-content: center;
  align-items: center;
  min-height: unset;
  gap: 0;
  overflow: hidden;

  /* styling */
  border-radius: 9px;
  pointer-events: all;

  .remove {
    border-radius: 100%;
    padding: 0;
    margin-right: 4px;
    font-size: 16px;
    background-color: var(--md-sys-color-on-primary);
  }

  /* prevent hover when disabled */
  ${({ $disabled }) =>
    $disabled
      ? css`
          pointer-events: none;
        `
      : css`
          &:hover {
            background-color: var(--md-sys-color-primary-hover);
          }
          &:active {
            background-color: var(--md-sys-color-primary-active);
          }

          .remove {
            &:hover {
              background-color: var(--md-sys-color-on-primary-hover);
            }
            &:active {
              background-color: var(--md-sys-color-on-primary-active);
            }
          }
        `}
`
