import { forwardRef, useEffect, useRef, useState } from "react";
import * as Styled from './Modal.styled'
import { Button } from '../../Button'

type ModalProps = {
    header?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    closeProps?: CloseProps;
    hideCancelButton: boolean;
    isOpen: boolean;
    onClose?: () => void;
  };

type CloseProps = {
    label: string
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(( props) => {
    const { children, header, footer, hideCancelButton = false, closeProps, isOpen, onClose } = props

    const [isModalOpen, setModalOpen] = useState(isOpen);
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const hasCloseLabel = !!closeProps?.label

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
    <>
    <Styled.Dialog {...props} ref={modalRef} onClick={(e) => closeIfClickOutside(e)} className="modal">
        {hideCancelButton ? null : <Styled.Close icon="close" variant="text" autoFocus onClick={handleCloseModal} /> }
        {header && <Styled.Header>{header}</Styled.Header>}
        {children && <Styled.Body>{children}</Styled.Body>}
        <Styled.Footer>{footer ? footer : <Button variant="text" label={hasCloseLabel ? closeProps.label : 'Cancel'} onClick={handleCloseModal} />}</Styled.Footer>
    </Styled.Dialog>
    </>
  )
})