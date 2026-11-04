import styled from 'styled-components'
import clsx from 'clsx'
import { IconSelect } from '../Dropdowns/IconSelect'
import { Icon, IconType } from '../Icon'
import { dropdownVariantStyles, fieldSubmittingStyles } from './fieldStyles'
import { EMPTY_VALUE, ReadOnlyValue } from './common.styled'

const StyledIconSelect = styled(IconSelect)`
  width: 100%;
  max-width: unset !important;

  ${dropdownVariantStyles}
  ${fieldSubmittingStyles}
`

const StyledReadOnly = styled(ReadOnlyValue)`
  gap: 8px;
`

export interface IconFieldProps {
  /** Material symbol name */
  value: string
  onChange: (value: string) => void
  /** Icon picks are immediate, so this is called on every change */
  onCommit?: (value: string) => void
  /** Icons listed first */
  featured?: string[]
  isSubmitting?: boolean
  isReadOnly?: boolean
  disabled?: boolean
  className?: string
}

export const IconField = ({
  value,
  onChange,
  onCommit,
  featured = [],
  isSubmitting,
  isReadOnly,
  disabled,
  className,
}: IconFieldProps) => {
  const handleChange = (nextValue: string[]) => {
    const next = String(nextValue?.[0] ?? '')
    onChange(next)
    onCommit?.(next)
  }

  if (isReadOnly) {
    return (
      <StyledReadOnly className={clsx(className, 'read-only')}>
        {value ? <Icon icon={value} /> : null}
        {value || EMPTY_VALUE}
      </StyledReadOnly>
    )
  }

  return (
    <StyledIconSelect
      value={value ? [value] : []}
      featured={featured as IconType[]}
      onChange={handleChange}
      disabled={disabled}
      widthExpand
      className={clsx(className, { submitting: isSubmitting })}
    />
  )
}
