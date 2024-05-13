import { forwardRef, useEffect } from 'react'
import * as Styled from './Dialog.styled'
import { Button, ButtonProps } from '../../Button'
import clsx from 'clsx'
import { createPortal } from 'react-dom'

export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'open'> {
  header?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  closeProps?: ButtonProps
  hideCancelButton?: boolean
  showCloseButton?: boolean
  isOpen: boolean
  onClose: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
  onShow?: () => void
  classNames?: ClassNames
  size?: 'sm' | 'md' | 'lg' | 'full'
  hideBackdrop?: boolean
  portalRef?: HTMLElement
}

type ClassNames = {
  header?: string
  body?: string
  footer?: string
  cancelButton?: string
  closeButton?: string
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const {
    children,
    header,
    footer,
    hideCancelButton = false,
    showCloseButton = false,
    hideBackdrop = false,
    closeProps,
    isOpen,
    onClose,
    className,
    classNames,
    size,
    onShow,
    portalRef,
    ...rest
  } = props

  const handleCloseModal = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    onClose && onClose(e)
  }

  // onShow callback
  useEffect(() => {
    if (isOpen && onShow) onShow()
  }, [isOpen])

  const closeIfClickOutside = (e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget === e.target) handleCloseModal(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      handleCloseModal(e)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <Styled.Backdrop onClick={(e) => closeIfClickOutside(e)} className={clsx({ hideBackdrop })}>
      <Styled.Dialog
        $size={size}
        ref={ref}
        className={clsx('dialog', className)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        {...rest}
      >
        <Styled.Header className={clsx('header', { hideCancelButton }, classNames?.header)}>
          {header ? header : ''}

          <Styled.Close
            className={clsx(
              'cancelButton',
              { isHidden: hideCancelButton },
              classNames?.cancelButton,
            )}
            icon="close"
            variant="text"
            onClick={handleCloseModal}
            autoFocus
          />
        </Styled.Header>
        {children && (
          <Styled.Body className={clsx('body', classNames?.body)}>{children}</Styled.Body>
        )}
        {(footer || showCloseButton) && (
          <Styled.Footer className={clsx('footer', classNames?.footer)}>
            {showCloseButton && (
              <Button
                label={!!closeProps?.label ? closeProps.label : 'Close'}
                className={clsx('closeButton', classNames?.closeButton)}
                variant="text"
                onClick={handleCloseModal}
                {...closeProps}
              />
            )}
            {footer && footer}
          </Styled.Footer>
        )}
      </Styled.Dialog>
    </Styled.Backdrop>,
    portalRef || document.getElementById('root') || document.body,
  )
})
