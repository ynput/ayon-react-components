import { forwardRef } from "react";
import * as Styled from './Modal.styled'
import { Button } from '../../Button'

type ModalProps = {
    toggleDialog: () => void;
    header?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
  };

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(( props, ref) => {
    const { children, header, footer, toggleDialog } = props

    const closeIfClickOutside = (e: React.MouseEvent) => {
        if (e.currentTarget === e.target) toggleDialog()
    }
  
  return (
    <>
    <Styled.Dialog ref={ref} onClick={(e) => closeIfClickOutside(e)}className="modal">
        <Styled.Close icon="close" autoFocus onClick={toggleDialog} />
        {header && <Styled.Header>{header}</Styled.Header>}
        {children && <Styled.Body>{children}</Styled.Body>}
        {footer ? <Styled.Footer>{footer}</Styled.Footer> : <Button onClick={toggleDialog}>Close</Button>}
    </Styled.Dialog>
    </>
  )
})

// export default Modal