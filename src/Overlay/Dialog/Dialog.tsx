import { forwardRef, useEffect, useRef, useState } from 'react'
import * as Styled from './Dialog.styled'
import { Button, ButtonProps } from '../../Button'
import clsx from 'clsx'

export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDialogElement>, 'open'> {
  header?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  closeProps?: ButtonProps
  hideCancelButton?: boolean
  isOpen: boolean
  onClose?: () => void
  classNames?: ClassNames
  variant?: 'dialog' | 'modal'
  size?: 'sm' | 'md' | 'lg' | 'full'
}

type ClassNames = {
  header?: string
  body?: string
  footer?: string
  cancelButton?: string
  closeButton?: string
}

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>((props) => {
  const {
    children,
    header,
    footer,
    hideCancelButton = false,
    closeProps,
    isOpen,
    onClose,
    className,
    classNames,
    size,
    variant = 'modal'
  } = props

  const [isModalOpen, setModalOpen] = useState(isOpen)
  const modalRef = useRef<HTMLDialogElement | null>(null)

  const closeIfClickOutside = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) handleCloseModal()
  }

  useEffect(() => setModalOpen(isOpen), [isOpen])

  useEffect(() => {
    const modalElement = modalRef.current
    if (!modalElement) return
    const showDialog =  variant === 'dialog' && modalElement.show()
    const showModal =  variant === 'modal' && modalElement.showModal()
    isModalOpen ? (showDialog || showModal) : modalElement.close()
  }, [isModalOpen])

  const handleCloseModal = () => {
    if (onClose) onClose()
    setModalOpen(false)
  }

  return (
    <Styled.Dialog
      $size={size}
      ref={modalRef}
      onClick={(e) => closeIfClickOutside(e)}
      className={clsx('modal', className)}
      {...props}
    >
      <Styled.Header className={clsx('header', classNames?.header)}>
          {header ? header : ''}
          {hideCancelButton ? null : (
            <Styled.Close 
              className={clsx('cancelButton', classNames?.cancelButton)}
              icon="close"
              variant="text"
              autoFocus
              onClick={handleCloseModal}
            /> )}
      </Styled.Header>
      {children && <Styled.Body className={clsx('body', classNames?.body)}>{children}</Styled.Body>}
      <Styled.Footer className={clsx('footer', classNames?.footer)}>
          { footer && footer } 
          <Button
            label={!!closeProps?.label ? closeProps.label : 'Cancel'}
            className={clsx('closeButton', classNames?.closeButton)}
            variant="text"
            onClick={handleCloseModal}
            {...closeProps}
          />
      </Styled.Footer>
    </Styled.Dialog>
)})
