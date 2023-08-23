import styled, { css, keyframes } from 'styled-components'

export const Form = styled.form`
  min-height: 160px;
  min-width: 300px;
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 4px;
    h2 {
      margin: 0;
    }
  }

  .upload-button {
    position: relative;
    overflow: hidden;

    * > span {
      cursor: pointer;
    }
  }

  input {
    position: absolute;
    inset: 0px;
    opacity: 0;

    &::-webkit-file-upload-button {
      visibility: hidden;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0px;
      cursor: pointer;
    }
  }

  .files {
    flex: 1;
    position: relative;
    background-color: var(--panel-background);
    border-radius: 1rem;

    border-width: 2px;
    border-style: dashed;
    border-color: #6b7685;
  }

  .scroll-container {
    overflow: auto;
    position: absolute;
    inset: 0;
  }

  label {
    position: absolute;
    inset: 0;

    &.drag-active {
      background-color: rgba(0, 0, 0, 0.1);
      z-index: 100;
    }
  }

  small {
    color: #e53e3e !important;
    font-size: 0.8rem;
  }

  .drop-here {
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;

    .icon {
      font-size: 3rem;
    }
  }

  #drag-file-element {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    inset: 0;
    z-index: 25;
  }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .success,
    .error {
      display: block;
      &::after {
        content: ':';
        opacity: 0;
      }
    }

    .success {
      color: var(--md-sys-color-primary);
    }

    .error {
      color: var(--md-sys-color-error);
    }
  }
`

// fade out and scale down
export const successAnimation = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-50px);
  }
`

export const List = styled.ul<{ $isSuccess: boolean }>`
  list-style: none;
  padding: 16px;
  margin: 0;

  position: relative;
  z-index: 50;

  display: flex;
  flex-direction: column;
  gap: 2px;

  overflow: auto;

  ${({ $isSuccess }) =>
    $isSuccess &&
    css`
      animation: ${successAnimation} 0.3s ease forwards;
    `}
`
