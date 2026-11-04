import { EnumField, EnumFieldProps } from './EnumField'

export type SelectFieldType = 'string' | 'integer' | 'float' | 'boolean' | 'datetime'

export type SelectFieldValueMap = {
  string: string
  integer: number
  float: number
  boolean: boolean
  datetime: string
}

// Converts the dropdown's string value to the field type. Unparseable numbers become null.
const coerceSelectValue = <T extends SelectFieldType>(
  value: string,
  type: T,
): SelectFieldValueMap[T] | null => {
  switch (type) {
    case 'integer': {
      const parsed = parseInt(value, 10)
      return (Number.isNaN(parsed) ? null : parsed) as SelectFieldValueMap[T] | null
    }
    case 'float': {
      const parsed = parseFloat(value)
      return (Number.isNaN(parsed) ? null : parsed) as SelectFieldValueMap[T] | null
    }
    case 'boolean':
      return (value.toLowerCase() === 'true') as SelectFieldValueMap[T]
    default:
      return value as SelectFieldValueMap[T]
  }
}

export interface SelectFieldProps<T extends SelectFieldType>
  extends Omit<EnumFieldProps, 'value' | 'onChange' | 'multiSelect'> {
  /** Type of the value; the selected option's value is converted to it */
  type: T
  value: SelectFieldValueMap[T] | null | undefined
  /** Receives null when the selection is cleared */
  onChange: (value: SelectFieldValueMap[T] | null) => void
  /** Selections are immediate, so this is called on every change */
  onCommit?: (value: SelectFieldValueMap[T] | null) => void
}

export const SelectField = <T extends SelectFieldType>({
  value,
  onChange,
  onCommit,
  type,
  ...props
}: SelectFieldProps<T>) => {
  const handleChange = (newValue: string[]) => {
    const rawValue = newValue[0]
    // an empty selection is a clear
    const nextValue =
      rawValue === undefined || rawValue === '' ? null : coerceSelectValue(rawValue, type)
    onChange(nextValue)
    onCommit?.(nextValue)
  }

  return (
    <EnumField
      {...props}
      value={value !== undefined && value !== null ? [String(value)] : []}
      onChange={handleChange}
    />
  )
}
