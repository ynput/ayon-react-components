import styled from 'styled-components'

const Loader = styled.div`
  --loader-size: 40px;
  display: inline-block;
  width: 80px;
  height: 80px;
  &:after {
    content: ' ';
    display: block;
    width: var(--loader-size);
    height: var(--loader-size);
    margin: 8px;
    border-radius: 50%;
    border: 4px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 0.8s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const Shade = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;

  .message {
    font-weight: bold;
  }
`

const LoaderShade = ({ className, style, message }) => {
  return (
    <Shade className={className} style={style}>
      <Loader />
      <div className="message">{message}</div>
    </Shade>
  )
}

export { Shade, LoaderShade }
