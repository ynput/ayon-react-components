import { useRef } from "react";
import * as Styled from './Modal.styled'

type ModalProps = {
    isOpen: boolean;
    hasCloseBtn?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
  };

export const Modal = ({isOpen, hasCloseBtn, onClose, children}: ModalProps) => {
    // ref for virtual DOM
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const currentModal = modalRef.current

  const toggleDialog = () => {
      if (!currentModal) return
      currentModal.hasAttribute('open') ? currentModal.close() : currentModal.showModal()
  }

  
  return (
    <>
    <button onClick={toggleDialog}>Toggle Dialog</button>
    <Styled.Dialog ref={modalRef} className="modal">
        <p>Test123</p>
        {hasCloseBtn && (
            <button className="modal-close-btn" onClick={toggleDialog}>
                Close
            </button>
            )}
            {children}
    </Styled.Dialog>
    </>
  )
}

// export default Modal