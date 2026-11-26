import styled from 'styled-components'
import clsx from 'clsx'
import { labelMedium } from '../theme'
import { TextField } from './TextField'
import { NumberField } from './NumberField'
import { BooleanField } from './BooleanField'
import { DateTimeField } from './DateTimeField'
import { JsonField } from './JsonField'
import { TextAreaField } from './TextAreaField'
import { SelectField, SelectFieldType } from './SelectField'
import { MultiSelectField } from './MultiSelectField'
import { EnumFieldOption } from './EnumField'
import { FieldRow, FieldRowProps } from './FieldRow'

export type AttributeDataType =
  | 'string'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'datetime'
  | 'list_of_strings'
  | 'list_of_integers'
  | 'list_of_any'
  | 'list_of_submodels'
  | 'dict'

export interface AttributeFieldConfig {
  name: string
  /** Shown label; falls back to name */
  label?: string
  dataType: AttributeDataType
  /** Allowed values; renders a select (or multi-select for lists) */
  enum?: EnumFieldOption[]
  /** Material symbol for the row, e.g. from getAttributeIcon in AYON apps */
  icon?: string
  isReadOnly?: boolean
  isRequired?: boolean
  /** Not rendered; its value is kept */
  hidden?: boolean
  /** Regular expression the text must match (string attributes without an enum) */
  pattern?: string
  /** Lowest allowed number (integer and float attributes) */
  min?: number
  /** Highest allowed number (integer and float attributes) */
  max?: number
  /** Value for a new item; see getAttributeDefaultValues */
  defaultValue?: unknown
  placeholder?: string
  /** Small text under the input */
  helperText?: string
}

/** Default values by attribute name, to seed the values of a new item */
export const getAttributeDefaultValues = (
  attributes: AttributeFieldConfig[],
): Record<string, unknown> =>
  Object.fromEntries(
    attributes
      .filter((attribute) => attribute.defaultValue !== undefined)
      .map((attribute) => [attribute.name, attribute.defaultValue]),
  )

const LIST_TYPES: AttributeDataType[] = [
  'list_of_strings',
  'list_of_integers',
  'list_of_any',
  'list_of_submodels',
]

// Attributes whose inputs are taller than one line
const isExpandedAttribute = (attribute: AttributeFieldConfig) =>
  attribute.dataType === 'dict' ||
  (LIST_TYPES.includes(attribute.dataType) && !attribute.enum?.length)

const DEFAULT_ICONS: Record<AttributeDataType, string> = {
  string: 'text_fields',
  integer: 'pin',
  float: 'speed',
  boolean: 'check_box',
  datetime: 'calendar_month',
  list_of_strings: 'format_list_bulleted',
  list_of_integers: 'format_list_numbered',
  list_of_any: 'format_list_bulleted',
  list_of_submodels: 'data_array',
  dict: 'data_object',
}

export const getAttributeFieldIcon = (attribute: AttributeFieldConfig) =>
  attribute.icon || (attribute.enum?.length ? 'checklist' : DEFAULT_ICONS[attribute.dataType])

/** The value as text for the copy button, or undefined when there is nothing to copy */
export const getAttributeCopyValue = (
  attribute: AttributeFieldConfig,
  value: unknown,
): string | undefined => {
  if (value === undefined || value === null) return undefined
  switch (attribute.dataType) {
    case 'string':
    case 'datetime':
    case 'integer':
    case 'float':
      return String(value)
    case 'boolean':
      return value ? 'true' : 'false'
    case 'dict':
    case 'list_of_submodels':
      return JSON.stringify(value, null, 2)
    case 'list_of_strings':
    case 'list_of_integers':
    case 'list_of_any':
      return Array.isArray(value)
        ? value
            .map((item) =>
              ['string', 'number', 'boolean'].includes(typeof item)
                ? String(item)
                : JSON.stringify(item),
            )
            .join(', ')
        : undefined
    default:
      return undefined
  }
}

const HelperText = styled.span`
  font-size: 12px;
  color: var(--md-sys-color-on-surface-variant);
`

const RowControl = styled.div`
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;

  &.stack {
    flex-direction: column;
    align-items: stretch;
  }
`

export interface AttributeFieldProps {
  attribute: AttributeFieldConfig
  value: unknown
  onChange: (value: unknown) => void
  /** Enables auto-save: called when the input commits */
  onCommit?: (value: unknown) => void
  disabled?: boolean
  isReadOnly?: boolean
  isSubmitting?: boolean
  ghost?: boolean
  className?: string
}

/** The input for one attribute, picked from its data type and enum */
export const AttributeField = ({
  attribute,
  value,
  onChange,
  onCommit,
  disabled,
  isReadOnly,
  isSubmitting,
  ghost,
  className,
}: AttributeFieldProps) => {
  const common = {
    disabled,
    isReadOnly: isReadOnly || attribute.isReadOnly,
    isSubmitting,
    className: clsx(className, { ghost }),
  }
  const { dataType, placeholder } = attribute

  if (attribute.enum?.length) {
    if (
      dataType === 'list_of_strings' ||
      dataType === 'list_of_integers' ||
      dataType === 'list_of_any'
    ) {
      return (
        <MultiSelectField
          {...common}
          type={dataType}
          value={(Array.isArray(value) ? value : []) as string[]}
          options={attribute.enum}
          onChange={onChange}
          onCommit={onCommit}
          isRequired={attribute.isRequired}
          search
          placeholder={placeholder ?? 'Select options'}
        />
      )
    }

    return (
      <SelectField
        {...common}
        type={
          (['integer', 'float', 'boolean', 'datetime'].includes(dataType)
            ? dataType
            : 'string') as SelectFieldType
        }
        value={value as string | null}
        options={attribute.enum}
        onChange={onChange}
        onCommit={onCommit}
        isRequired={attribute.isRequired}
        search
        placeholder={placeholder ?? 'Select an option'}
      />
    )
  }

  switch (dataType) {
    case 'string':
      return (
        <TextField
          {...common}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          onCommit={onCommit}
          pattern={attribute.pattern}
          placeholder={placeholder ?? 'Enter text'}
        />
      )
    case 'integer':
    case 'float':
      return (
        <NumberField
          {...common}
          type={dataType}
          value={typeof value === 'number' ? value : undefined}
          onChange={onChange}
          onCommit={onCommit}
          min={attribute.min}
          max={attribute.max}
          placeholder={
            placeholder ?? (dataType === 'integer' ? 'Enter a whole number' : 'Enter a number')
          }
        />
      )
    case 'boolean':
      return (
        <BooleanField {...common} value={Boolean(value)} onChange={onChange} onCommit={onCommit} />
      )
    case 'datetime':
      return (
        <DateTimeField
          {...common}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          onCommit={onCommit}
        />
      )
    case 'list_of_strings':
    case 'list_of_integers':
      return (
        <TextAreaField
          {...common}
          type={dataType}
          value={(Array.isArray(value) ? value : []) as string[]}
          onChange={onChange}
          onCommit={onCommit}
          placeholder={placeholder ?? 'One value per line'}
        />
      )
    case 'list_of_any':
    case 'list_of_submodels':
    case 'dict':
      return (
        <JsonField
          {...common}
          value={value}
          onChange={onChange}
          onCommit={onCommit}
          placeholder={
            placeholder ?? (dataType === 'dict' ? 'Enter JSON object' : 'Enter JSON list')
          }
        />
      )
    default:
      return null
  }
}

export interface AttributeFieldRowProps
  extends AttributeFieldProps,
    Pick<
      FieldRowProps,
      'onCopy' | 'labelMode' | 'error' | 'errorPlacement' | 'errorId' | 'showMixed'
    > {}

/** One attribute as a form row: icon, label, input, copy button, error and mixed state */
export const AttributeFieldRow = ({
  onCopy,
  labelMode,
  error,
  errorPlacement,
  errorId,
  showMixed,
  ...props
}: AttributeFieldRowProps) => {
  const { attribute, value } = props
  if (attribute.hidden) return null
  const expanded = isExpandedAttribute(attribute)

  return (
    <FieldRow
      icon={getAttributeFieldIcon(attribute)}
      label={attribute.label || attribute.name}
      isRequired={attribute.isRequired}
      showMixed={showMixed}
      error={error}
      errorPlacement={errorPlacement}
      errorId={errorId}
      alignStart={expanded}
      labelMode={labelMode}
      copyValue={getAttributeCopyValue(attribute, value)}
      onCopy={onCopy}
    >
      <RowControl className={clsx({ stack: expanded })}>
        <AttributeField {...props} />
        {attribute.helperText ? <HelperText>{attribute.helperText}</HelperText> : null}
      </RowControl>
    </FieldRow>
  )
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  /* room between rows for the error text under each input */
  &.overlay-errors {
    gap: 14px;
  }
`

const SectionLabel = styled.label`
  ${labelMedium}
  color: var(--md-sys-color-on-surface-variant);
  padding: 4px 0 0;
`

export interface AttributeFieldsProps {
  attributes: AttributeFieldConfig[]
  /** Values by attribute name */
  values: Record<string, unknown>
  onChange: (name: string, value: unknown) => void
  /** Enables auto-save: called when an input commits */
  onCommit?: (name: string, value: unknown) => void
  /** Errors by attribute name */
  errors?: Record<string, string | undefined>
  errorPlacement?: FieldRowProps['errorPlacement']
  /** Names of attributes whose value differs between the edited items */
  mixed?: string[] | Set<string>
  onCopy?: FieldRowProps['onCopy']
  /** Section heading; hidden when empty */
  sectionLabel?: string
  labelMode?: FieldRowProps['labelMode']
  ghost?: boolean
  disabled?: boolean
  isReadOnly?: boolean
  isSubmitting?: boolean
  className?: string
}

/** A section of attribute rows for a record of values. Not tied to any form library. */
export const AttributeFields = ({
  attributes,
  values,
  onChange,
  onCommit,
  errors = {},
  errorPlacement,
  mixed,
  onCopy,
  sectionLabel = 'Attributes',
  labelMode = 'inline',
  ghost = true,
  disabled,
  isReadOnly,
  isSubmitting,
  className,
}: AttributeFieldsProps) => {
  const visible = attributes.filter((attribute) => !attribute.hidden)
  if (!visible.length) return null
  const mixedSet = mixed instanceof Set ? mixed : new Set(mixed)

  return (
    <Section className={clsx(className, { 'overlay-errors': errorPlacement === 'overlay' })}>
      {sectionLabel ? <SectionLabel>{sectionLabel}</SectionLabel> : null}
      {visible.map((attribute) => (
        <AttributeFieldRow
          key={attribute.name}
          attribute={attribute}
          value={values[attribute.name]}
          onChange={(value) => onChange(attribute.name, value)}
          onCommit={onCommit ? (value) => onCommit(attribute.name, value) : undefined}
          error={errors[attribute.name]}
          errorPlacement={errorPlacement}
          showMixed={mixedSet.has(attribute.name)}
          onCopy={onCopy}
          labelMode={labelMode}
          ghost={ghost}
          disabled={disabled}
          isReadOnly={isReadOnly}
          isSubmitting={isSubmitting}
        />
      ))}
    </Section>
  )
}
