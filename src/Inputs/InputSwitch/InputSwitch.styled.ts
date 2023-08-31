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

      &:before {
        position: absolute;
        content: '';
        height: calc(var(--bheight) * 0.8);
        width: calc(var(--bheight) * 0.8);
        left: calc(var(--bheight) * 0.1);
        bottom: calc(var(--bheight) * 0.1);
        transition: 0.2s;
        border-radius: 50%;
        scale: 0.8;
      }
    }

    /* not check styles */
    input:not(:checked) + .slider {
      background-color: var(--md-sys-color-surface-container-highest);
      outline: 2px solid var(--md-sys-color-outline);
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
      outline: 2px solid var(--md-sys-color-primary);
      &::before {
        transform: translateX(calc(var(--bheight) * 0.65));
        scale: 1.1;
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
