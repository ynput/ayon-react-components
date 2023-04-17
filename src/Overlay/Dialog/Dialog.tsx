import { KeyboardEvent, MouseEvent, forwardRef, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Button } from '../../Button'

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

const DialogWindow = styled.div<{ noHeader: boolean }>`
  background-color: var(--color-grey-01);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  min-width: 200px;
  min-height: 100px;
  max-width: 85%;
  max-height: 85%;
  position: relative;
  cursor: auto;
  :focus {
    outline: none;
  }

  /* add padding to top if no header */

  ${({ noHeader }) =>
    noHeader &&
    css`
      padding-top: 46px;
    `}
`

const BaseDialogEdge = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`

const DialogHeader = styled(BaseDialogEdge)`
  font-weight: bold;
  border-bottom: 1px solid var(--color-surface-04);
  padding: 16px 0;
`

const DialogFooter = styled(BaseDialogEdge)`
  border-top: 1px solid var(--color-surface-04);
  padding: 16px 0;
`

const DialogBody = styled.div`
  display: flex;
  flex-direction: column;

  flex-grow: 1;
`

const ButtonStyled = styled(Button)`
  position: absolute;
  top: 8px;
  right: 8px;
`

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  onHide?: () => void
  header?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  headerStyle?: React.CSSProperties
  bodyStyle?: React.CSSProperties
  footerStyle?: React.CSSProperties
  visible?: boolean
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    { onHide, header, footer, children, headerStyle, bodyStyle, footerStyle, visible, ...props },
    ref,
  ) => {
    const headerComp = useMemo(() => {
      if (!header) return null
      return <DialogHeader style={headerStyle}>{header}</DialogHeader>
    }, [header])

    const footerComp = useMemo(() => {
      if (!footer) return null
      return <DialogFooter style={footerStyle}>{footer}</DialogFooter>
    }, [header])

    const onShadeClick = (event: MouseEvent<HTMLDivElement>): void => {
      if (event.currentTarget != event.target) return
      if (!onHide) return
      event.preventDefault()
      onHide()
    }

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape' && onHide) onHide()
    }

    if (!visible) return null

    return (
      <Shade className="dialog-shade" onClick={onShadeClick} onKeyDown={onKeyDown} ref={ref}>
        <DialogWindow {...props} onKeyDown={onKeyDown} tabIndex={-1} noHeader={!headerComp}>
          <ButtonStyled icon="close" autoFocus onClick={onHide} />
          {headerComp}
          <DialogBody style={bodyStyle}>{children}</DialogBody>
          {footerComp}
        </DialogWindow>
      </Shade>
    )
  },
)
