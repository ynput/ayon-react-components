import { ReactNode, forwardRef } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { Icon } from '../Icon'
import { Button } from '../Buttons/Button'
import { labelMedium, labelSmall } from '../theme'
import { compactFieldRowStyles } from './fieldStyles'

const StyledErrorBanner = styled.span`
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  padding: var(--padding-s) var(--padding-m);
  border-radius: var(--border-radius-m);
`

export type FieldErrorBannerProps = React.HTMLAttributes<HTMLSpanElement>

export const FieldErrorBanner = forwardRef<HTMLSpanElement, FieldErrorBannerProps>((props, ref) => (
  <StyledErrorBanner {...props} ref={ref} />
))
FieldErrorBanner.displayName = 'FieldErrorBanner'

const StyledMixed = styled.span`
  font-size: 11px;
  color: var(--md-sys-color-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export interface FieldMixedIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  show: boolean
}

// Marks a field whose value differs between the selected items
export const FieldMixedIndicator = ({ show, ...props }: FieldMixedIndicatorProps) =>
  show ? <StyledMixed {...props}>mixed</StyledMixed> : null

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Row = styled.div<{
  $hasMeta?: boolean
  $hasInlineLabel?: boolean
  $hasCopyButton?: boolean
}>`
  display: grid;
  grid-template-columns: ${({ $hasMeta, $hasInlineLabel, $hasCopyButton = true }) => {
    const leftCol = $hasInlineLabel ? 'minmax(125px, 0.7fr)' : '16px'
    const rightCol = '32px' // Fixed space for copy button/meta
    return $hasMeta || !$hasCopyButton
      ? `${leftCol} minmax(0, 1fr) auto`
      : `${leftCol} minmax(0, 1fr) ${rightCol}`
  }};
  align-items: start;
  gap: 8px;
  min-height: 32px;
  ${compactFieldRowStyles}

  &:hover .copy-button {
    opacity: 1;
  }
`

const CopyButton = styled(Button)`
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
  &.hasIcon {
    padding: 4px;
  }
  width: 32px;
  height: 32px;
`

const FieldIcon = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 32px;
  flex-shrink: 0;
  color: var(--md-sys-color-on-surface-variant);
  cursor: default;
  .icon {
    font-size: 16px;
  }
`

// Wraps icon + inline label
const FieldLeft = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  height: 32px;
`

const FieldLabelText = styled.span`
  color: var(--md-sys-color-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  ${labelSmall}
`

const FieldBody = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;

  &.align-start {
    align-items: flex-start;
  }
`

const FieldMeta = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
`

const RequiredIndicator = styled.span`
  ${labelMedium}
  position: absolute;
  top: 0;
  right: -4px;
`

export interface FieldRowProps {
  icon: string
  label: string
  children: ReactNode
  /** If provided, a copy-to-clipboard button is shown on hover. */
  copyValue?: string | null
  /** Called after copyValue was written to the clipboard, e.g. to show a toast */
  onCopy?: (value: string) => void
  error?: string
  showMixed?: boolean
  alignStart?: boolean
  /** Reserve the copy button column even when there is nothing to copy. Defaults to true. */
  hasCopyButton?: boolean
  isRequired?: boolean
  /**
   * Controls how the field label is rendered:
   * "placeholder": label only shown as icon tooltip
   * "inline" (default): label shown between the icon and the input as a fixed-width left column
   */
  labelMode?: 'placeholder' | 'inline'
  className?: string
}

/**
 * A form row with an icon, optional inline label, and content area.
 * Optionally shows a copy-to-clipboard button on hover.
 */
export const FieldRow = ({
  icon,
  label,
  children,
  copyValue,
  onCopy,
  error,
  showMixed = false,
  alignStart = false,
  hasCopyButton = true,
  isRequired = false,
  labelMode = 'inline',
  className,
}: FieldRowProps) => {
  const isInline = labelMode === 'inline'

  const handleCopyValue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (copyValue === undefined || copyValue === null) return
    try {
      await navigator.clipboard.writeText(copyValue)
      onCopy?.(copyValue)
    } catch (error) {
      console.error('Failed to copy to clipboard', error)
    }
  }

  return (
    <Field className={className}>
      <Row $hasMeta={showMixed} $hasInlineLabel={isInline} $hasCopyButton={hasCopyButton}>
        {isInline ? (
          <FieldLeft data-tooltip={label}>
            <FieldIcon>
              <Icon icon={icon} />
            </FieldIcon>
            <FieldLabelText title={label}>
              {label}
              {isRequired ? ' *' : ''}
            </FieldLabelText>
          </FieldLeft>
        ) : (
          <FieldIcon data-tooltip={label}>
            {isRequired && <RequiredIndicator>*</RequiredIndicator>}
            <Icon icon={icon} />
          </FieldIcon>
        )}

        <FieldBody className={clsx({ 'align-start': alignStart })}>{children}</FieldBody>

        {showMixed ? (
          <FieldMeta>
            <FieldMixedIndicator show={showMixed} />
          </FieldMeta>
        ) : copyValue !== undefined ? (
          <CopyButton
            variant="text"
            icon="content_copy"
            title={`Copy ${label}`}
            className="copy-button"
            onClick={handleCopyValue}
          />
        ) : hasCopyButton ? (
          // Empty placeholder keeps the grid column space reserved
          <span />
        ) : null}
      </Row>

      {error ? <FieldErrorBanner>{error}</FieldErrorBanner> : null}
    </Field>
  )
}
