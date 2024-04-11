import { useRef } from "react";
import * as Styled from './Modal.styled'
import { Button } from '../../Button'

type ModalProps = {
    isOpen: boolean;
    hasCloseBtn?: boolean;
    onClose?: () => void;
    header?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
  };

export const Modal = ({isOpen, hasCloseBtn, onClose, children, header, footer}: ModalProps) => {
    // ref for virtual DOM
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const currentModal = modalRef.current

  const toggleDialog = () => {
    console.log('here')
      if (!currentModal) return
      if (currentModal) {
        console.log('here2')
        currentModal.hasAttribute('open') ? currentModal.close() : currentModal.showModal();
      }
  }

  
  return (
    <>
    <button onClick={toggleDialog}>Toggle Dialog</button>
    <Styled.Dialog ref={modalRef} className="modal">
        <Styled.Close icon="close" autoFocus onClick={toggleDialog} />
        {header && <Styled.Header>{header}</Styled.Header>}
        {children && <Styled.Body>{children}</Styled.Body>}
        {footer && <Styled.Footer>{footer}</Styled.Footer>}
        {hasCloseBtn && <div><Button onClick={toggleDialog}>Close</Button></div>}
    </Styled.Dialog>
    </>
  )
}

// export default Modal