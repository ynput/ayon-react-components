import styled from 'styled-components'
import clsx from 'clsx'
import { StatusSelect, StatusField, Status } from '../Dropdowns/StatusSelect'
import { IconType } from '../Icon'
import { fieldSubmittingStyles } from './fieldStyles'
import { EnumFieldOption, resolveEnumFieldIcon } from './EnumField'

const StyledStatusValue = styled(StatusField)`
  height: 30px;
  margin: 1px 0;
`

const StyledStatusSelect = styled(StatusSelect)`
  ${fieldSubmittingStyles}
`

export interface StatusSelectFieldProps {
  /** Status name */
  value: string
  /** Statuses; `value` is the status name */
  options: EnumFieldOption[]
  onChange: (value: string) => void
  /** Selections are immediate, so this is called on every change */
  onCommit?: (value: string) => void
  placeholder?: string
  isReadOnly?: boolean
  isSubmitting?: boolean
  disabled?: boolean
  invert?: boolean
  className?: string
}

export const StatusSelectField = ({
  value,
  options,
  onChange,
  onCommit,
  placeholder,
  isReadOnly = false,
  isSubmitting = false,
  disabled,
  invert = false,
  className,
}: StatusSelectFieldProps) => {
  const statusOptions: Status[] = options.map((option) => ({
    name: String(option.value),
    icon: resolveEnumFieldIcon(option.icon) as IconType | undefined,
    color: option.color,
  }))

  if (isReadOnly) {
    const status = statusOptions.find((status) => status.name === value)
    if (!status) return null
    return (
      <StyledStatusValue status={status} invert={invert} className={clsx(className, 'read-only')} />
    )
  }

  return (
    <StyledStatusSelect
      value={[value]}
      onChange={(next) => {
        onChange(next)
        onCommit?.(next)
      }}
      options={statusOptions}
      placeholder={placeholder}
      invert={invert}
      disabled={disabled}
      className={clsx(className, { submitting: isSubmitting })}
    />
  )
}
