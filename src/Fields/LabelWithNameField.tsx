import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { Icon } from '../Icon'
import { InputText } from '../Inputs/InputText'
import { labelLarge, labelMedium } from '../theme'
import { fieldSubmittingStyles } from './fieldStyles'
import { TextField } from './TextField'
import { FieldErrorText } from './common.styled'
import { NameFormat, formatName } from './nameFormat'

export interface LabelWithNameFieldProps {
  labelValue: string
  nameValue: string
  /**
   * How the name is generated from the label: 'snake_case' (default), 'kebab-case', 'camelCase',
   * or a function. Names typed by hand go through it too.
   */
  nameFormat?: NameFormat
  onLabelChange: (value: string) => void
  /** Called when the label is committed (Enter or blur) — use for auto-save */
  onLabelCommit?: (value: string) => void
  onNameChange: (value: string) => void
  /** Called when the name is committed (Enter or blur) — use for auto-save */
  onNameCommit?: (value: string) => void
  labelError?: string
  nameError?: string
  autoFocus?: boolean
  isSubmitting?: boolean
  disabled?: boolean
  /** The name can no longer be edited, e.g. after creation */
  nameLocked?: boolean
  labelLabel?: string
  nameLabel?: string
  labelPlaceholder?: string
  lockedTitle?: string
  editableTitle?: string
  /** Tooltip of an info icon next to the name */
  nameInfo?: string
  variant?: 'inline' | 'stacked'
  className?: string
}

/**
 * A label input with a name generated from it. The name follows the label until the user
 * edits it by hand; it can be locked once the entity exists.
 */
export const LabelWithNameField = ({
  labelValue,
  nameValue,
  nameFormat = 'snake_case',
  onLabelChange,
  onLabelCommit,
  onNameChange,
  onNameCommit,
  labelError,
  nameError,
  autoFocus = true,
  isSubmitting = false,
  disabled = false,
  nameLocked = false,
  labelLabel = 'Label',
  nameLabel = 'Name',
  labelPlaceholder,
  lockedTitle = 'Name is fixed after creation.',
  editableTitle = 'Click to edit the generated name.',
  nameInfo,
  variant = 'stacked',
  className,
}: LabelWithNameFieldProps) => {
  const generatedName = formatName(labelValue, nameFormat)
  const [isEditingName, setIsEditingName] = useState(false)
  const [draftName, setDraftName] = useState(nameValue)
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const [hasCustomName, setHasCustomName] = useState(
    Boolean(nameValue) && nameValue !== generatedName,
  )

  useEffect(() => {
    setDraftName(nameValue)
  }, [nameValue])

  useEffect(() => {
    if (!isEditingName) return
    nameInputRef.current?.focus()
    nameInputRef.current?.select()
  }, [isEditingName])

  // The name follows the label until it is edited by hand
  useEffect(() => {
    if (nameLocked) {
      setIsEditingName(false)
      return
    }

    if (!hasCustomName && nameValue !== generatedName) {
      onNameChange(generatedName)
    }
  }, [generatedName, hasCustomName, nameLocked, nameValue, onNameChange])

  const startEditingName = () => {
    if (disabled || nameLocked) return
    setDraftName(nameValue || generatedName)
    setIsEditingName(true)
  }

  const commitName = () => {
    const resolvedName = formatName(draftName, nameFormat) || generatedName

    onNameChange(resolvedName)
    if (resolvedName !== nameValue) onNameCommit?.(resolvedName)
    setHasCustomName(Boolean(resolvedName) && resolvedName !== generatedName)
    setIsEditingName(false)
  }

  const cancelEditingName = () => {
    setDraftName(nameValue)
    setIsEditingName(false)
  }

  const handleNameInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return

    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      commitName()
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      cancelEditingName()
    }
  }

  const nameTitle = nameLocked ? lockedTitle : editableTitle

  return (
    <InputsContainer className={clsx(className, { inline: variant === 'inline' })}>
      <LabelRow className="label-row">
        <Label>{labelLabel}</Label>
      </LabelRow>
      <div className="field-group">
        <TextField
          aria-label={labelLabel}
          value={labelValue}
          onChange={onLabelChange}
          onCommit={onLabelCommit}
          placeholder={labelPlaceholder}
          disabled={disabled}
          isSubmitting={isSubmitting}
          autoFocus={autoFocus}
        />
        {labelError && <FieldErrorText>{labelError}</FieldErrorText>}

        <NameRow>
          <Label>{nameLabel}</Label>
          {nameInfo ? (
            <InfoIcon icon="info" data-tooltip={nameInfo} data-tooltip-delay={0} />
          ) : null}
          {isEditingName ? (
            <NameInput
              aria-label={nameLabel}
              ref={nameInputRef}
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onBlur={commitName}
              onKeyDown={handleNameInputKeyDown}
              disabled={disabled}
              className={clsx({ submitting: isSubmitting })}
            />
          ) : (
            <NameDisplay
              className={clsx({ active: !nameLocked && !disabled })}
              onClick={startEditingName}
              title={nameTitle}
            >
              <NameValue title={nameTitle}>{nameValue || generatedName}</NameValue>
              {!nameLocked && !disabled && <Icon icon="edit" className="icon" />}
            </NameDisplay>
          )}
        </NameRow>
        {nameError && <FieldErrorText>{nameError}</FieldErrorText>}
      </div>
    </InputsContainer>
  )
}

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--base-gap-small);
  width: 100%;

  label {
    white-space: nowrap;
  }

  .field-group {
    width: 100%;
  }

  &.inline {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--base-gap-large);

    .label-row {
      min-width: 96px;
      padding-top: 8px;
    }

    .field-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--base-gap-small);
      min-width: 0;
    }
  }
`

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--base-gap-small);
`

const Label = styled.label`
  ${labelMedium}
  color: var(--md-sys-color-on-surface-variant);
`

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--base-gap-small);
  width: 100%;
  word-break: break-all;
`

const InfoIcon = styled(Icon)`
  cursor: help;
  font-size: 16px;
  color: var(--md-sys-color-on-surface-variant);
`

const NameDisplay = styled.span`
  position: relative;
  padding: 2px 6px;
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  gap: var(--base-gap-small);
  border: 0;
  background: transparent;
  border-radius: var(--border-radius-m);
  color: var(--md-sys-color-on-surface-variant);
  user-select: text;

  .icon {
    display: none;
    font-size: 14px;
    color: var(--md-sys-color-on-surface-variant);
  }

  &:hover,
  &:focus-visible {
    background-color: var(--md-sys-color-surface-container-low);
    outline: none;
  }

  &.active {
    cursor: pointer;
    &:hover .icon,
    &:focus-visible .icon {
      display: inline-flex;
    }
  }
`

const NameValue = styled.span`
  height: 24px;
  ${labelLarge}
  min-width: 0;
  display: inline-flex;
  align-items: center;
  color: var(--md-sys-color-on-surface);
  user-select: text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const NameInput = styled(InputText)`
  height: 28px;
  width: 400px;
  max-width: 100%;
  min-height: 0;
  border: 0;
  padding: 1px 6px;
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);

  &:focus {
    background: var(--md-sys-color-surface-container-low);
    border: none;
    outline: 1px solid var(--md-sys-color-primary);
  }
  ${fieldSubmittingStyles}
`
