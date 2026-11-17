import styled from 'styled-components'
import { bodyMedium, labelMedium, titleSmall } from '../../theme'

/** react-datepicker's hover, which skips disabled days: rules here match its specificity */
const HOVER = ":not([aria-disabled='true']):hover"

/**
 * The dates as one field, like AYON's dropdowns: the popover's button, then the arrows. One width
 * for every range, so the arrows stay put.
 */
export const Field = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  width: 272px;
  max-width: 100%;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--border-radius-m);
  background-color: var(--md-sys-color-surface-container-low);
  overflow: hidden;

  .arrow {
    flex-shrink: 0;
    width: 28px;
    min-width: 0;
    height: auto;
    padding: 0;
    border-radius: 0;
    border-left: 1px solid var(--md-sys-color-outline-variant);

    .icon {
      font-size: 18px;
    }
  }
`

export const FieldButton = styled.button`
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  padding: 0 10px 0 8px;
  ${bodyMedium}
  color: var(--md-sys-color-on-surface);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  cursor: pointer;

  &:hover,
  &.open {
    background-color: var(--md-sys-color-surface-container-low-hover);
  }
  &:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: -2px;
  }
  .icon {
    flex-shrink: 0;
    font-size: 18px;
    color: var(--md-sys-color-on-surface-variant);
  }
  &.highlighted .icon {
    color: var(--md-sys-color-primary);
  }
  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

/** on a menu's surface, in the body */
export const Popover = styled.div`
  position: fixed;
  z-index: 1000;
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 16px);
  overflow: auto;
  border-radius: 8px;
  background-color: var(--md-sys-color-surface-container-high);
  box-shadow: 0 4px 16px #00000066;
`

/**
 * The presets beside a calendar flat on the surface, with round days. Doubled class (&&): above
 * react-datepicker's own styles and InputDate's global theme.
 */
export const Calendar = styled.div`
  display: flex;
  color: var(--md-sys-color-on-surface);

  ul {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 8px;
    list-style: none;
    border-right: 1px solid var(--md-sys-color-outline-variant);
  }
  ul button {
    all: unset;
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 6px 12px;
    white-space: nowrap;
    border-radius: var(--border-radius-m);
    ${bodyMedium}
    cursor: pointer;

    &:hover {
      background-color: var(--md-sys-color-surface-container-high-hover);
    }
    &:focus-visible {
      outline: 2px solid var(--md-sys-color-primary);
      outline-offset: -2px;
    }
    &.selected {
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
    }
  }

  && {
    .react-datepicker {
      display: flex;
      gap: 16px;
      padding: 8px 12px 12px;
      border: none;
      background: transparent;
      font-family: inherit;
    }
    .react-datepicker__header {
      padding-top: 6px;
      border: none;
      background: transparent;
    }
    .react-datepicker__current-month {
      ${titleSmall}
      color: var(--md-sys-color-on-surface);
    }

    /* the months' arrows as AYON's icon buttons */
    .react-datepicker__navigation {
      top: 8px;
      border-radius: var(--border-radius-m);
      color: var(--md-sys-color-on-surface);
      text-indent: 0;
      &:hover {
        background-color: var(--md-sys-color-surface-container-highest);
      }
      &:focus-visible {
        outline: 2px solid var(--md-sys-color-primary);
        outline-offset: -2px;
      }
    }
    .react-datepicker__navigation--previous {
      left: 12px;
    }
    .react-datepicker__navigation--next {
      right: 12px;
    }
    /* its label is for screen readers (aria-label): the icon only */
    .react-datepicker__navigation-icon {
      position: static;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 0;
    }
    .react-datepicker__navigation-icon::before {
      position: static;
      width: auto;
      height: auto;
      border: none;
      transform: none;
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      line-height: 1;
      font-feature-settings: 'liga';
      color: inherit;
    }
    .react-datepicker__navigation-icon--previous::before {
      content: 'chevron_left';
    }
    .react-datepicker__navigation-icon--next::before {
      content: 'chevron_right';
    }

    .react-datepicker__day-names {
      margin-top: 8px;
    }
    .react-datepicker__day-name {
      ${labelMedium}
      color: var(--md-sys-color-on-surface-variant);
    }
    .react-datepicker__day-name,
    .react-datepicker__day {
      width: 32px;
      line-height: 32px;
      margin: 1px 0;
    }

    .react-datepicker__day {
      ${bodyMedium}
      line-height: 32px;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--md-sys-color-on-surface);
    }
    .react-datepicker__day${HOVER} {
      background-color: var(--md-sys-color-surface-container-highest);
    }
    .react-datepicker__day:focus-visible {
      outline: 2px solid var(--md-sys-color-primary);
      outline-offset: -2px;
    }
    .react-datepicker__day--outside-month {
      color: var(--md-sys-color-outline);
    }
    .react-datepicker__day--today {
      font-weight: 600;
      color: var(--md-sys-color-primary);
    }

    /* the days between: a band across */
    .react-datepicker__day--in-range,
    .react-datepicker__day--in-selecting-range {
      border-radius: 0;
      background: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
    }
    .react-datepicker__day--in-range${HOVER}, .react-datepicker__day--in-selecting-range${HOVER} {
      background: var(--md-sys-color-primary-container-hover);
    }

    /* the first and last days: full circles, the band running on from behind them, no hover */
    .react-datepicker__day--range-start,
    .react-datepicker__day--range-end,
    .react-datepicker__day--selecting-range-start,
    .react-datepicker__day--selecting-range-end {
      /* a pixel to fade over: a hard stop leaves the edge jagged */
      --circle: radial-gradient(
        circle closest-side,
        var(--md-sys-color-primary) calc(100% - 1px),
        transparent 100%
      );
      border-radius: 0;
      color: var(--md-sys-color-on-primary);
    }
    .react-datepicker__day--range-start,
    .react-datepicker__day--range-start${HOVER}, .react-datepicker__day--selecting-range-start,
    .react-datepicker__day--selecting-range-start${HOVER} {
      background: var(--circle),
        linear-gradient(to right, transparent 50%, var(--md-sys-color-primary-container) 50%);
    }
    .react-datepicker__day--range-end,
    .react-datepicker__day--range-end${HOVER}, .react-datepicker__day--selecting-range-end,
    .react-datepicker__day--selecting-range-end${HOVER} {
      background: var(--circle),
        linear-gradient(to left, transparent 50%, var(--md-sys-color-primary-container) 50%);
    }
    .react-datepicker__day--range-start.react-datepicker__day--range-end,
    .react-datepicker__day--range-start.react-datepicker__day--range-end${HOVER},
      .react-datepicker__day--selecting-range-start.react-datepicker__day--selecting-range-end,
    .react-datepicker__day--selecting-range-start.react-datepicker__day--selecting-range-end${HOVER} {
      background: var(--circle);
    }
  }
`
