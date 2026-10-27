import styled, { css } from 'styled-components'
import { DefaultValueTemplate, Dropdown } from '../Dropdown'
import { Button } from '../../Buttons/Button'
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

// the colour button shows on the hovered or focused tag, and always on the "add new" option
export const ColorAction = styled(Button)`
  margin-left: auto;
  padding: 2px;
  opacity: 0;

  .option:hover &,
  .option.focused &,
  .option:first-child & {
    opacity: 1;
  }
`

export const Swatches = styled.div`
  display: flex;
  gap: 4px;
  margin-left: auto;
`

export const Swatch = styled.button`
  width: 16px;
  height: 16px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--md-sys-color-outline-variant);
  cursor: pointer;

  &:hover {
    outline: 2px solid var(--md-sys-color-on-surface);
    outline-offset: 1px;
  }
`

export const PartialTag = styled.span`
  border-radius: 3px;
  padding: 1px 3px;
  border: 1px dashed var(--md-sys-color-outline);
  color: var(--md-sys-color-on-surface-variant);
`

export const Tag = styled.span<{ $backgroundColor?: string; $color: string }>`
  background-color: ${({ $backgroundColor }) =>
    $backgroundColor ?? 'var(--md-sys-color-surface-container-high)'};
  border-radius: 3px;
  padding: 2px 4px;
  color: ${({ $color }) => $color};
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
