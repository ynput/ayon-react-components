import { forwardRef, useEffect, useRef, useState } from "react";
import * as Styled from './Modal.styled'
import { Button, ButtonProps } from '../../Button'

type ModalProps = {
    header?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    closeProps?: ButtonProps;
    hideCancelButton: boolean;
    isOpen: boolean;
    onClose?: () => void;
  };


export const Modal = forwardRef<HTMLDialogElement, ModalProps>(( props) => {
    const { children, header, footer, hideCancelButton = false, closeProps, isOpen, onClose } = props

    const [isModalOpen, setModalOpen] = useState(isOpen);
    const modalRef = useRef<HTMLDialogElement | null>(null);

    const closeIfClickOutside = (e: React.MouseEvent) => {
        if (e.currentTarget === e.target) handleCloseModal()
    }

    useEffect(() => {
      setModalOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
      const modalElement = modalRef.current;
      if (!modalElement) return
      isModalOpen ? modalElement.showModal() : modalElement.close()
    }, [isModalOpen]);


    const handleCloseModal = () => {
      if (onClose) {
        onClose();
      }
      setModalOpen(false);
    };

  return (
      <Styled.Dialog {...props} ref={modalRef} onClick={(e) => closeIfClickOutside(e)} className="modal">
          {hideCancelButton ? null : <Styled.Close icon="close" variant="text" autoFocus onClick={handleCloseModal} /> }
          {header && <Styled.Header>{header}</Styled.Header>}
          {children && <Styled.Body>{children}</Styled.Body>}
          <Styled.Footer>{footer ? footer : <Button {...closeProps} variant="text" onClick={handleCloseModal} />}</Styled.Footer>
      </Styled.Dialog>
  )
})