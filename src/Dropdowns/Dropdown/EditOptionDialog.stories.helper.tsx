// for stories only: a dialog that edits a dropdown option, as an app would do it with onEditOption
import { useState } from 'react'
import { Dialog } from '../../Overlay/Dialog'
import { Button } from '../../Buttons/Button'
import { InputText } from '../../Inputs/InputText'
import { ColorPicker } from '../../Inputs/ColorPicker'
import type { EditOptionHandler } from './Dropdown'

export type EditedOption = { value: string; label?: string; color?: string }

export const useEditOptionDialog = ({
  dataKey = 'value',
  fields,
  onSave,
}: {
  dataKey?: string
  // what can be changed besides the value, which is only set when creating
  fields: ('label' | 'color')[]
  onSave: (option: EditedOption, isNew: boolean) => void
}) => {
  const [editing, setEditing] = useState<{
    draft: EditedOption
    isNew: boolean
    resolve: (value?: string) => void
  } | null>(null)

  const onEditOption: EditOptionHandler = (option, isNew) =>
    new Promise((resolve) =>
      setEditing({
        draft: { value: option[dataKey] || '', label: option.label, color: option.color },
        isNew,
        resolve,
      }),
    )

  const setDraft = (change: Partial<EditedOption>) =>
    editing && setEditing({ ...editing, draft: { ...editing.draft, ...change } })

  const close = (save: boolean) => {
    if (!editing) return
    if (save) onSave(editing.draft, editing.isNew)
    editing.resolve(save ? editing.draft.value : undefined)
    setEditing(null)
  }

  const dialog = (
    <Dialog
      isOpen={!!editing}
      size="sm"
      header={editing?.isNew ? 'Add new' : `Edit ${editing?.draft.value}`}
      onClose={() => close(false)}
      footer={
        <Button
          variant="filled"
          label={editing?.isNew ? 'Add' : 'Save'}
          disabled={!editing?.draft.value}
          onClick={() => close(true)}
        />
      }
    >
      {editing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {editing.isNew && (
            <InputText
              autoFocus
              placeholder="Name"
              value={editing.draft.value}
              onChange={(e) => setDraft({ value: e.target.value })}
            />
          )}
          {fields.includes('label') && (
            <InputText
              placeholder="Label"
              value={editing.draft.label || ''}
              onChange={(e) => setDraft({ label: e.target.value })}
            />
          )}
          {fields.includes('color') && (
            <ColorPicker value={editing.draft.color} onChange={(color) => setDraft({ color })} />
          )}
        </div>
      )}
    </Dialog>
  )

  return { onEditOption, dialog }
}
