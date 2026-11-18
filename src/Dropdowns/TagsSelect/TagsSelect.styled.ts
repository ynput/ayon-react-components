import styled, { css } from 'styled-components'
import { DefaultValueTemplate, Dropdown } from '../Dropdown'
import type { TagColors } from '../../helpers'
export { DefaultItemStyled as DefaultItem } from '../Dropdown'

export const TagSelectDropdown = styled(Dropdown)<{ $width: number; $checkboxes?: boolean }>`
  .options {
    width: ${({ $width }) => ($width ? `${$width}px` : '100%')};

    /* without checkboxes the tags wrap in rows */
    ${({ $checkboxes }) =>
      !$checkboxes &&
      css`
        flex-direction: row;
        flex-wrap: wrap;
        gap: 4px;
        padding: 4px;

        .option {
          flex: 1;
        }

        /* add new full width */
        .option:first-child {
          min-width: 100%;
          margin: -4px;
          margin-bottom: 0px;
        }

        .option:not(:first-child) {
          max-width: 33%;
          border-radius: var(--border-radius-m);
          .option-child {
            border-radius: var(--border-radius-m);
            text-align: center;
          }
        }
      `}
  }
`

export const PartialTag = styled.span`
  border-radius: 3px;
  padding: 1px 3px;
  border: 1px dashed var(--md-sys-color-outline);
  color: var(--md-sys-color-on-surface-variant);
`

export const Tag = styled.span<{ $colors?: TagColors }>`
  background-color: ${({ $colors }) =>
    $colors?.background ?? 'var(--md-sys-color-surface-container-high)'};
  /* an inset border, so a tag is the same size with or without one */
  box-shadow: inset 0 0 0 1px ${({ $colors }) => $colors?.border ?? 'transparent'};
  border-radius: 3px;
  padding: 2px 4px;
  color: ${({ $colors }) => $colors?.text ?? 'var(--md-sys-color-on-surface)'};
`

export const TagsValueTemplate = styled(DefaultValueTemplate)`
  padding: 0 4px;

  &.editor {
    /* remove border */
    border: none;
    /* remove icon */
    .icon {
      display: none;
    }
  }
`
