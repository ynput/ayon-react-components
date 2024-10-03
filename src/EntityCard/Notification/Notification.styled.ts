import styled from 'styled-components'

export const Notification = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  translate: 40% -30%;
  width: 20px;
  height: 20px;
  z-index: 100;

  border-radius: 12px;
  box-shadow: -1px 1px 4px 1px #00000040;

  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    font-size: 16px;
    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 200, 'opsz' 5;
  }
`
