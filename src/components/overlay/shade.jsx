import styled from 'styled-components'

const Shade = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
`

const LoaderShade = (className, style, message) => {
  return (
    <Shade className={className} style={style}>
      <div className="loader" />
      <div className="message">{message}</div>
    </Shade>
  )
}

export { Shade, LoaderShade }
