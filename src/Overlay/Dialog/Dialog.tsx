import { KeyboardEvent, MouseEvent, forwardRef, useMemo } from 'react'
import * as Styled from './Dialog.styled'

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
      return <Styled.Header style={headerStyle}>{header}</Styled.Header>
    }, [header])

    const footerComp = useMemo(() => {
      if (!footer) return null
      return <Styled.Footer style={footerStyle}>{footer}</Styled.Footer>
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
      <Styled.Shade className="dialog-shade" onClick={onShadeClick} onKeyDown={onKeyDown} ref={ref}>
        <Styled.Window {...props} onKeyDown={onKeyDown} tabIndex={-1} $noHeader={!headerComp}>
          <Styled.Close icon="close" autoFocus onClick={onHide} />
          {headerComp}
          <Styled.Body style={bodyStyle}>{children}</Styled.Body>
          {footerComp}
        </Styled.Window>
      </Styled.Shade>
    )
  },
)
