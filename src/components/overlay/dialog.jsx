import { useMemo } from 'react'
import styled from 'styled-components'

const Shade = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 500;
  cursor: pointer;
`

const DialogWindow = styled.div`
  padding: 6px;
  background-color: var(--color-grey-01);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
  min-height: 100px;
  max-width: 85%;
  max-height: 85%;
  position: relative;
  cursor: auto;
  :focus {
    outline: none;
  }
`

const BaseDialogEdge = styled.div`
  padding: 12px 6px;
  display: flex;
  flex-direction: row;
  gap: 6px;
`

const DialogHeader = styled(BaseDialogEdge)`
  font-weight: bold;
  border-bottom: 1px solid var(--color-surface-04);
`

const DialogFooter = styled(BaseDialogEdge)`
  border-top: 1px solid var(--color-surface-04);
`

const DialogBody = styled.div`
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
  overflow: auto;
`

const Dialog = ({
  onHide,
  header,
  footer,
  children,
  style,
  className,
  headerStyle,
  bodyStyle,
  footerStyle,
}) => {
  const headerComp = useMemo(() => {
    if (!header) return null
    return <DialogHeader style={headerStyle}>{header}</DialogHeader>
  }, [header])

  const footerComp = useMemo(() => {
    if (!footer) return null
    return <DialogFooter style={footerStyle}>{footer}</DialogFooter>
  }, [header])

  const onShadeClick = (event) => {
    if (event.currentTarget != event.target) return
    if (!onHide) return
    event.preventDefault()
    onHide()
  }

  const onKeyDown = (event) => {
    if (event.key === 'Escape') onHide()
  }

  return (
    <Shade className="dialog-shade" onClick={onShadeClick} onKeyDown={onKeyDown}>
      <DialogWindow className={className} style={style} onKeyDown={onKeyDown} tabIndex={-1}>
        {headerComp}
        <DialogBody style={bodyStyle}>{children}</DialogBody>
        {footerComp}
      </DialogWindow>
    </Shade>
  )
}

export default Dialog
