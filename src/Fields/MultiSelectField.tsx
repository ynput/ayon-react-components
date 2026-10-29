import { EnumField, EnumFieldProps } from './EnumField'

export type MultiSelectFieldType = 'list_of_strings' | 'list_of_integers' | 'list_of_any'

export type MultiSelectFieldValueMap = {
  list_of_strings: string[]
  list_of_integers: number[]
  list_of_any: (string | number | boolean)[]
}

// Converts the dropdown's string values to the field type. Unparseable integers are dropped.
const coerceMultiSelectValue = <T extends MultiSelectFieldType>(
  values: string[],
  type: T,
  options: EnumFieldProps['options'],
): MultiSelectFieldValueMap[T] => {
  switch (type) {
    case 'list_of_integers':
      return values
        .map((v) => parseInt(v, 10))
        .filter((v) => !Number.isNaN(v)) as MultiSelectFieldValueMap[T]
    case 'list_of_any':
      // keep the original option values (numbers, booleans)
      return values.map(
        (v) => options.find((opt) => String(opt.value) === v)?.value ?? v,
      ) as MultiSelectFieldValueMap[T]
    default:
      return values as MultiSelectFieldValueMap[T]
  }
}

export interface MultiSelectFieldProps<T extends MultiSelectFieldType>
  extends Omit<EnumFieldProps, 'value' | 'onChange' | 'multiSelect'> {
  /** Type of the list; the selected options' values are converted to it */
  type: T
  value: MultiSelectFieldValueMap[T]
  onChange: (value: MultiSelectFieldValueMap[T]) => void
  /** Selections are immediate, so this is called on every change */
  onCommit?: (value: MultiSelectFieldValueMap[T]) => void
}

export const MultiSelectField = <T extends MultiSelectFieldType>({
  value,
  onChange,
  onCommit,
  type,
  ...props
}: MultiSelectFieldProps<T>) => {
  const handleChange = (newValue: string[]) => {
    const nextValue = coerceMultiSelectValue(newValue, type, props.options)
    onChange(nextValue)
    onCommit?.(nextValue)
  }

  return (
    <EnumField
      {...props}
      value={Array.isArray(value) ? value : []}
      multiSelect
      onChange={handleChange}
    />
  )
}
