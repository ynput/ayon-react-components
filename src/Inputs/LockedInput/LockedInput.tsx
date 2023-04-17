import { forwardRef, useState } from 'react'
import styled from 'styled-components'
import { InputText } from '../InputText'
import { Button } from '../../Button'
import { IconType } from '../../Icon'

const UsernameStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;

  input {
    flex: 1;
  }
`

export interface LockedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLDivElement>, 'onSubmit'> {
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

export const LockedInput = forwardRef<HTMLDivElement, LockedInputProps>(
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

    const handleSubmit = () => {
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
      setEditing(false)
      setEditingValue(value)
      onCancel && onCancel()
    }

    console.log(editing)

    return (
      <UsernameStyled key={label} ref={ref} {...props}>
        <InputText
          value={editing ? editingValue : value}
          disabled={!editing}
          onChange={handleChange}
          type={type}
        />
        {!disabled &&
          (editing ? (
            <>
              <Button
                icon={fullUnlock ? 'lock' : 'cancel'}
                onClick={handleCancel}
                label={cancelLabel}
              />
              {!fullUnlock && <Button icon="done" onClick={handleSubmit} label={saveLabel} />}
            </>
          ) : (
            <Button icon={editIcon} onClick={onEdit || handleOpen} />
          ))}
      </UsernameStyled>
    )
  },
)
