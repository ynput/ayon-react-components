import styled from 'styled-components'

export const Switch = styled.div`
  max-height: var(--base-input-size);
  min-height: var(--base-input-size);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .switch-body {
    --bheight: calc(var(--base-input-size) * 0.7);
    --bwidth: calc(var(--bheight) * 1.75);
    position: relative;
    display: inline-block;
    height: var(--bheight);
    width: var(--bwidth);

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    /* main slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transition: 0.2s;
      border-radius: calc(var(--bheight) / 2);
      border: 1px solid var(--md-sys-color-outline);

      &:before {
        position: absolute;
        content: '';
        height: calc(var(--bheight) * 0.7);
        width: calc(var(--bheight) * 0.7);
        left: calc(var(--bheight) * 0.11);
        bottom: calc(var(--bheight) * 0.1);
        transition: 0.2s;
        border-radius: 50%;
      }
    }

    /* not check styles */
    input:not(:checked) + .slider {
      background-color: var(--md-sys-color-surface-container-highest);
      :before {
        background-color: var(--md-sys-color-on-surface);
      }

      &:hover {
        background-color: var(--md-sys-color-surface-container-highest-hover);
      }
    }

    /* checked styles */
    input:checked + .slider {
      background-color: var(--md-sys-color-primary);
      border-color: var(--md-sys-color-primary);
      &::before {
        transform: translateX(calc(var(--bheight) * 0.75));
        background-color: var(--md-sys-color-on-primary);
      }

      &:hover {
        &::before {
          background-color: var(--md-sys-color-on-primary-hover);
        }
      }
    }

    input:focus-visible + * {
      outline: 2px solid var(--md-sys-color-tertiary) !important;
    }
  } // switch-body
`
