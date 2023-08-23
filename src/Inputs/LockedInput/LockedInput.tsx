import { forwardRef, useEffect, useState } from 'react'
import * as Styled from './LockedInput.styled'
import { Button } from '../../Button'
import { IconType } from '../../Icon'

export interface LockedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  value: string
  onSubmit?: (value: string) => void
  onEdit?: () => void
  onCancel?: () => void
  label?: string
  disabled?: boolean
  saveLabel?: string
  cancelLabel?: string
  editIcon?: IconType
  fullUnlock?: boolean
  type?: React.HTMLInputTypeAttribute
}

export const LockedInput = forwardRef<HTMLFormElement, LockedInputProps>(
  (
    {
      value,
      onSubmit,
      onCancel,
      onEdit,
      label,
      disabled,
      saveLabel = 'Save',
      cancelLabel = 'Cancel',
      editIcon = 'edit',
      fullUnlock,
      type,
      ...props
    },
    ref,
  ) => {
    const [editingValue, setEditingValue] = useState(value)
    const [editing, setEditing] = useState(false)

    const handleOpen = () => {
      setEditingValue(value)
      setEditing(true)
    }

    const handleSubmit = (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    ) => {
      console.log(editingValue)
      e?.preventDefault()
      setEditing(false)
      onSubmit && onSubmit(editingValue)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditingValue(e.target.value)

      if (fullUnlock) {
        onSubmit && onSubmit(e.target.value)
      }
    }

    const handleCancel = () => {
      console.log('cancel')
      setEditing(false)
      setEditingValue(value)
      onCancel && onCancel()
    }

    // watch disabled and close editing
    useEffect(() => {
      if (disabled && editing) {
        setEditing(false)
      }
    }, [disabled, editing])

    return (
      <Styled.Username key={label} ref={ref} {...props} onSubmit={handleSubmit}>
        <Styled.LockedInputText
          value={editing ? editingValue : value}
          readOnly={!editing}
          onChange={handleChange}
          type={type}
          onClick={onEdit || handleOpen}
          $open={editing}
        />
        {!disabled &&
          (editing ? (
            <>
              {!fullUnlock && <Button icon="done" onClick={handleSubmit} label={saveLabel} />}
              <Button
                icon={fullUnlock ? 'lock' : 'cancel'}
                onClick={handleCancel}
                label={cancelLabel}
              />
            </>
          ) : (
            <Button icon={editIcon} onClick={onEdit || handleOpen} />
          ))}
      </Styled.Username>
    )
  },
)
