import { forwardRef, useEffect, useRef, useState } from "react";
import * as Styled from './Modal.styled'
import { Button, ButtonProps } from '../../Button'

type ModalProps = {
    header?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    closeProps?: ButtonProps;
    hideCancelButton?: boolean;
    isOpen: boolean;
    onClose?: () => void;
    classNames?: ClassNames;
  };

  type ClassNames = {
    header?: string;
    body?: string;
    footer?: string;
    cancelButton?: string;
    closeButton?: string;
  };


export const Modal = forwardRef<HTMLDialogElement, ModalProps>(( props) => {
    const { children, header, footer, hideCancelButton = false, closeProps, isOpen, onClose, classNames } = props

    const [isModalOpen, setModalOpen] = useState(isOpen);
    const modalRef = useRef<HTMLDialogElement | null>(null);

    const closeIfClickOutside = (e: React.MouseEvent) => {
        if (e.currentTarget === e.target) handleCloseModal()
    }

    useEffect(() => setModalOpen(isOpen), [isOpen]);

    useEffect(() => {
      const modalElement = modalRef.current;
      if (!modalElement) return
      isModalOpen ? modalElement.showModal() : modalElement.close()
    }, [isModalOpen]);


    const handleCloseModal = () => {
      if (onClose) onClose()
      setModalOpen(false);
    };

  //*TODO resolveClassNames() ? *//


  return (
      <Styled.Dialog {...props} ref={modalRef} onClick={(e) => closeIfClickOutside(e)} className="modal">
          {hideCancelButton ? null : <Styled.Close className={classNames ? 'cancelButton'+ ' ' + classNames.cancelButton : 'cancelButton'} icon="close" variant="text" autoFocus onClick={handleCloseModal} /> }
           <Styled.Header className={classNames ? 'header'+ ' ' + classNames.header : 'header' }>{header ? header : ''}</Styled.Header>
          {children && <Styled.Body className={classNames ? 'body'+ ' ' + classNames.body : 'body' }>{children}</Styled.Body>}
          {footer ? <Styled.Footer> {footer} </Styled.Footer> : <Button className={classNames ? 'closeButton' + ' ' + classNames.closeButton : 'closeButton'} {...closeProps} variant="text" onClick={handleCloseModal} />}
      </Styled.Dialog>
  )
})