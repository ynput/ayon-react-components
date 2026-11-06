import { forwardRef, useEffect, useRef } from 'react'
import * as Styled from './Dialog.styled'
import { Button, ButtonProps } from '../../Buttons/Button'
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
  /**
   * Called on Enter anywhere in the dialog, the same as clicking its primary action.
   * Not called when the key comes from a multiline field, a button or link (they handle Enter
   * themselves), with a modifier key, or when a child already handled it (preventDefault).
   */
  onConfirm?: (e: React.KeyboardEvent<HTMLElement>) => void
  classNames?: ClassNames
  size?: 'sm' | 'md' | 'lg' | 'full'
  hideBackdrop?: boolean
  enableBackdropClose?: boolean
  portalRef?: HTMLElement
  pt?: {
    backdrop?: React.HTMLAttributes<HTMLDivElement>
  }
}

type ClassNames = {
  header?: string
  body?: string
  footer?: string
  cancelButton?: string
  closeButton?: string
}

// elements that handle Enter themselves: a focused button, link or action input clicks itself,
// a picker input opens its picker, a multiline field adds a newline
const HANDLES_ENTER =
  'textarea, button, a[href], select, [role="button"], [role="listbox"], ' +
  'input:is([type="button"], [type="submit"], [type="reset"], [type="image"], [type="color"], [type="file"])'

// Enter without modifiers, typed in this dialog (not in a dialog portalled out of it) and not on
// an element that handles Enter itself
const isConfirmKey = (e: React.KeyboardEvent<HTMLElement>) => {
  if (e.key !== 'Enter' || e.nativeEvent.isComposing) return false
  if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return false
  const target = e.target as HTMLElement
  // React events bubble through portals: Enter in a nested dialog must not confirm this one
  if (!e.currentTarget.contains(target)) return false
  if (target.isContentEditable) return false
  return !target.closest(HANDLES_ENTER)
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const {
    children,
    header,
    footer,
    hideCancelButton = false,
    showCloseButton = false,
    hideBackdrop = false,
    enableBackdropClose = true,
    closeProps,
    isOpen,
    onClose,
    className,
    classNames,
    size,
    onShow,
    onConfirm,
    portalRef,
    pt,
    onKeyDown,
    ...rest
  } = props

  const dialogRef = useRef<HTMLDivElement | null>(null)
  const setRefs = (el: HTMLDivElement | null) => {
    dialogRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) ref.current = el
  }

  const handleCloseModal = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    onClose && onClose(e)
  }

  // onShow callback
  useEffect(() => {
    if (isOpen && onShow) onShow()
  }, [isOpen])

  // Focus the dialog itself when it opens, so Escape and Enter reach it. A child that took focus
  // (autoFocus on a field or the primary button) keeps it. The close button is not focused: Enter
  // on it would close the dialog instead of confirming it.
  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && dialog && !dialog.contains(document.activeElement)) {
      dialog.focus({ preventScroll: true })
    }
  }, [isOpen])

  const closeIfClickOutside = (e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget === e.target && enableBackdropClose) handleCloseModal(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // a handler passed by the consumer runs first; when it exists it owns Escape, as before
    onKeyDown?.(e)
    if (e.defaultPrevented) return

    if (e.key === 'Escape' && !onKeyDown) {
      handleCloseModal(e)
    }

    if (onConfirm && isConfirmKey(e)) {
      e.preventDefault()
      onConfirm(e)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <Styled.Backdrop
      onClick={(e) => closeIfClickOutside(e)}
      className={clsx({ hideBackdrop })}
      {...pt?.backdrop}
    >
      <Styled.Dialog
        $size={size}
        ref={setRefs}
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
    // the end of body, after what is open already: a dialog opened from a menu or popover is above it
    portalRef || document.body,
  )
})
