import styled, { css } from 'styled-components'
import { DefaultValueTemplate, Dropdown } from '../Dropdown'
export { DefaultItemStyled as DefaultItem } from '../Dropdown'

export const TagSelectDropdown = styled(Dropdown)<{ $width: number }>`
  .options {
    flex-direction: row;
    width: ${({ $width }) => ($width ? `${$width}px` : '100%')};
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
  }
`

export const Tag = styled.span`
  background-color: var(--md-sys-color-surface-container-high);
  border-radius: 3px;
  padding: 2px 4px;
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
