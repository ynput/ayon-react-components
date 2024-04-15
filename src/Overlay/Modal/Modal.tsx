import { forwardRef } from "react";
import * as Styled from './Modal.styled'
import { Button } from '../../Button'

type ModalProps = {
    toggleDialog: () => void;
    header?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    closeProps?: CloseProps;
    hideCancelButton: boolean;
  };

type CloseProps = {
    label: string
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(( props, ref) => {
    const { children, header, footer, toggleDialog, hideCancelButton = false, closeProps } = props


    const hasCloseLabel = !!closeProps?.label

    const closeIfClickOutside = (e: React.MouseEvent) => {
        if (e.currentTarget === e.target) toggleDialog()
    }
  
  return (
    <>
    <Styled.Dialog {...props} ref={ref} onClick={(e) => closeIfClickOutside(e)} className="modal">
        {hideCancelButton ? null : <Styled.Close icon="close" variant="text" autoFocus onClick={toggleDialog} /> }
        {header && <Styled.Header>{header}</Styled.Header>}
        {children && <Styled.Body>{children}</Styled.Body>}
        <Styled.Footer>{footer ? footer : <Button variant="text" label={hasCloseLabel ? closeProps.label : 'Cancel'} onClick={toggleDialog} />}</Styled.Footer>
    </Styled.Dialog>
    </>
  )
})

// export default Modal