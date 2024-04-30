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
    isModalOpen ? modalElement.showModal() : modalElement.close()
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
      {hideCancelButton ? null : (
        <Styled.Close
          className={classNames ? 'cancelButton' + ' ' + classNames.cancelButton : 'cancelButton'}
          icon="close"
          variant="text"
          autoFocus
          onClick={handleCloseModal}
        />
      )}
      <Styled.Header className={classNames ? 'header' + ' ' + classNames.header : 'header'}>
        {header ? header : ''}
      </Styled.Header>
      {children && (
        <Styled.Body className={classNames ? 'body' + ' ' + classNames.body : 'body'}>
          {children}
        </Styled.Body>
      )}
      <Styled.Footer>
        {footer ? (
          footer
        ) : (
          <Button
            className={classNames ? 'closeButton' + ' ' + classNames.closeButton : 'closeButton'}
            {...closeProps}
            variant="text"
            onClick={handleCloseModal}
          />
        )}
      </Styled.Footer>
    </Styled.Dialog>
  )
})
