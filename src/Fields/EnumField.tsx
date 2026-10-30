import { forwardRef, useMemo, useRef } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { Button, ButtonProps } from '../Buttons/Button'
import {
  DefaultItemTemplate,
  DefaultValueTemplate,
  Dropdown,
  DropdownProps,
  DropdownRef,
} from '../Dropdowns/Dropdown'
import { Icon, IconImage, IconPropType, IconType, isIconImage } from '../Icon'
import { dropdownVariantStyles, fieldLoadingStyles, fieldSubmittingStyles } from './fieldStyles'
import { EMPTY_VALUE, ReadOnlyValue } from './common.styled'

/** An icon given as an object, as AYON enum items store it */
export type EnumFieldIconObject = {
  type?: 'material-symbols' | 'url'
  /** Material symbol name */
  name?: string
  /** Image URL */
  url?: string
  color?: string
}

/** An option of an enum field. Matches the shape of AYON enum items. */
export type EnumFieldOption = {
  value: string | number | boolean
  label: string
  /** Material symbol name, an image URL/path, or an icon object */
  icon?: IconPropType | EnumFieldIconObject
  color?: string
}

/** The option icon as a material symbol name or image URL */
export const resolveEnumFieldIcon = (icon?: EnumFieldOption['icon']): IconPropType | undefined => {
  if (!icon || typeof icon === 'string') return icon
  return icon.type === 'url' || (!icon.name && icon.url) ? icon.url : icon.name
}

type ResolvedEnumFieldOption = Omit<EnumFieldOption, 'icon'> & { icon?: IconPropType }

const ADD_VALUE = '__add__'
const DIVIDER_VALUE = '__divider__'

const isImageIcon = (icon?: IconPropType): icon is string => !!icon && isIconImage(icon)

const StyledDropdown = styled(Dropdown)`
  width: 100%;
  ${dropdownVariantStyles}
  ${fieldSubmittingStyles}
  ${fieldLoadingStyles}
`

const OptionIcon = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  img {
    width: 20px;
    height: 20px;
    object-fit: cover;
    border-radius: 50%;
  }
`

const ValueContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--base-gap-small);
  overflow: hidden;
`

const ValueContentWrapper = styled(ValueContent)`
  width: 100%;
  .actions {
    visibility: hidden;
  }

  &:hover {
    .actions {
      visibility: visible;
    }
  }
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
`

const ValueLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledItemTemplate = styled(DefaultItemTemplate)`
  /* edit button hidden by default and displayed on hover */
  .edit-item {
    visibility: hidden;
  }
  &:hover {
    .edit-item {
      visibility: visible;
    }
  }
`

const ActionButton = styled(Button)`
  width: 24px;
  padding: 4px;
  height: 24px;
  border-radius: var(--border-radius-m);
  cursor: pointer;

  .icon {
    font-size: 16px;
  }

  &.hasIcon {
    padding: 4px;
  }

  &:hover {
    background-color: var(--md-sys-color-surface-container-hover) !important;
  }
`

const EditButton = styled(Icon)`
  width: 24px;
  padding: 4px;
  height: 24px;
  margin-left: auto;
  font-size: 16px;
  border-radius: var(--border-radius-m);
  cursor: pointer;

  &:hover {
    background-color: var(--md-sys-color-surface-container-hover);
  }

  &.selected {
    &:hover {
      background-color: var(--md-sys-color-secondary-container-hover);
      color: var(--md-sys-color-on-secondary-container);
    }
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  margin: 0 0;
`

// Renders icon/image for an option
const EnumIcon = ({ icon, color }: { icon?: IconPropType; color?: string }) => {
  if (!icon) return null

  return (
    <OptionIcon>
      {isImageIcon(icon) ? <IconImage icon={icon} /> : <Icon icon={icon} style={{ color }} />}
    </OptionIcon>
  )
}

const OptionValue = ({
  option,
  iconOnlyColor,
  suffix,
}: {
  option: ResolvedEnumFieldOption
  iconOnlyColor?: boolean
  suffix?: string
}) => (
  <ValueContent>
    <EnumIcon icon={option.icon} color={option.color} />
    <ValueLabel style={{ color: !iconOnlyColor && !option.icon ? option.color : undefined }}>
      {option.label}
      {suffix}
    </ValueLabel>
  </ValueContent>
)

export interface EnumFieldProps
  extends Omit<DropdownProps, 'value' | 'onChange' | 'options' | 'onClear'> {
  options: EnumFieldOption[]
  value: (string | number | boolean)[]
  onChange: (value: string[]) => void
  /** Called by the clear button. Without it, clearing calls onChange([]). */
  onClear?: () => void
  /** Adds an "add" option at the top. Resolve with the new item's value to select it. */
  onAddItem?: () => Promise<string>
  /** Shows an edit button on each option */
  onEditItem?: (value: string) => Promise<void>
  addItemLabel?: string
  isLoading?: boolean
  isSubmitting?: boolean
  isReadOnly?: boolean
  /** Hides the clear button */
  isRequired?: boolean
  multiSelect?: boolean
  placeholder?: string
  /** Extra buttons shown on hover next to the clear button */
  actions?: ButtonProps[]
  /** When true, only the icon is colored — the label stays default */
  iconOnlyColor?: boolean
}

/**
 * Dropdown for enum values with icon, color and image support, read-only mode, a clear button
 * and optional add/edit item actions. SelectField and MultiSelectField build on it.
 */
export const EnumField = forwardRef<DropdownRef, EnumFieldProps>(
  (
    {
      options: optionsProp,
      value,
      onChange,
      onClear,
      onAddItem,
      onEditItem,
      addItemLabel = 'Add',
      isLoading = false,
      isSubmitting = false,
      isReadOnly = false,
      isRequired = false,
      multiSelect = false,
      placeholder,
      actions,
      iconOnlyColor = false,
      className,
      ...props
    },
    refProp,
  ) => {
    const internalRef = useRef<DropdownRef>(null)
    const ref = refProp || internalRef
    const options = useMemo<ResolvedEnumFieldOption[]>(
      () =>
        optionsProp.map((option) => ({
          ...option,
          value: String(option.value),
          icon: resolveEnumFieldIcon(option.icon),
        })),
      [optionsProp],
    )
    const valueAsStrings = useMemo(
      () => value.filter((v) => v !== undefined && v !== null && v !== '').map((v) => String(v)),
      [value],
    )

    const selectedOptions = useMemo(
      () => options.filter((opt) => valueAsStrings.includes(String(opt.value))),
      [options, valueAsStrings],
    )

    // fires callback and waits for the new item value back
    const handleAddItem = async () => {
      if (!onAddItem) return
      try {
        const newValue = await onAddItem()
        if (!newValue) return
        const newValueStr = String(newValue)
        if (multiSelect) {
          onChange(
            valueAsStrings.includes(newValueStr)
              ? valueAsStrings
              : [...valueAsStrings, newValueStr],
          )
        } else {
          onChange([newValueStr])
        }
      } catch (error) {
        console.error('Error adding new item:', error)
      }
    }

    const handleChange = (newValue: string[]) => {
      if (onAddItem && newValue.includes(ADD_VALUE)) return handleAddItem()
      onChange(multiSelect ? newValue : newValue.slice(-1))
    }

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      // prevent opening the dropdown when clicking clear button
      event.preventDefault()
      event.stopPropagation()
      if (onClear) onClear()
      else onChange([])
    }

    const handleEdit = async (e: React.MouseEvent<HTMLSpanElement>, value: string) => {
      e.stopPropagation()
      if (!onEditItem) return
      if (typeof ref !== 'function') ref.current?.close()
      try {
        await onEditItem(value)
      } catch (error) {
        console.error('Error editing item:', error)
      }
    }

    const allOptions: ResolvedEnumFieldOption[] = useMemo(
      () =>
        onAddItem
          ? [
              { value: ADD_VALUE, label: addItemLabel, icon: 'add' },
              { value: DIVIDER_VALUE, label: '' },
              ...options,
            ]
          : options,
      [options, onAddItem, addItemLabel],
    )

    if (isReadOnly) {
      return (
        <ReadOnlyValue className={clsx(className, 'read-only')}>
          {selectedOptions.length ? (
            <ValueContent>
              {selectedOptions.map((option, index) => (
                <OptionValue
                  key={String(option.value)}
                  option={option}
                  iconOnlyColor={iconOnlyColor}
                  suffix={multiSelect && index < selectedOptions.length - 1 ? ',' : ''}
                />
              ))}
            </ValueContent>
          ) : (
            EMPTY_VALUE
          )}
        </ReadOnlyValue>
      )
    }

    const showClear = !isRequired || !!onClear

    return (
      <StyledDropdown
        options={allOptions}
        value={valueAsStrings}
        ref={ref}
        multiSelect={multiSelect}
        placeholder={placeholder}
        widthExpand
        searchOnNumber={10}
        maxOptionsShown={100}
        sortBySelected={options.length > 10}
        className={clsx(
          className,
          { submitting: isSubmitting, loading: isLoading },
          'shimmer-lightest',
        )}
        valueTemplate={(_value, _selected, isOpen) => {
          const showIconsOnly =
            multiSelect && selectedOptions.length > 1 && selectedOptions.some((opt) => opt.icon)

          return (
            <DefaultValueTemplate
              value={valueAsStrings}
              isOpen={isOpen}
              placeholder={placeholder}
              isMultiple={multiSelect && selectedOptions.length > 1}
              childrenCustom={
                selectedOptions.length > 0 ? (
                  <ValueContentWrapper>
                    {selectedOptions.map((opt, i, a) =>
                      showIconsOnly ? (
                        <EnumIcon key={String(opt.value)} icon={opt.icon} color={opt.color} />
                      ) : (
                        <OptionValue
                          key={String(opt.value)}
                          option={opt}
                          iconOnlyColor={iconOnlyColor}
                          suffix={multiSelect && a.length > 1 && i < a.length - 1 ? ',' : ''}
                        />
                      ),
                    )}
                    {(showClear || !!actions?.length) && (
                      <Actions className="actions">
                        {actions?.map((action, index) => (
                          <ActionButton key={index} variant="text" {...action} />
                        ))}
                        {showClear && (
                          <ActionButton
                            variant="text"
                            icon="close"
                            className="clear"
                            onClick={handleClear}
                          />
                        )}
                      </Actions>
                    )}
                  </ValueContentWrapper>
                ) : undefined
              }
            />
          )
        }}
        itemTemplate={(option: ResolvedEnumFieldOption, _isActive, isSelected) => {
          if (option.value === DIVIDER_VALUE) return <Divider />

          // Image icons go into startContent; DefaultItemTemplate only renders material icons
          const imageIcon = isImageIcon(option.icon) ? option.icon : undefined
          const displayOption = imageIcon ? { ...option, icon: undefined } : option

          return (
            <StyledItemTemplate
              option={displayOption}
              dataKey="value"
              labelKey="label"
              selected={isSelected ? [String(option.value)] : []}
              value={valueAsStrings}
              multiSelect={multiSelect}
              startContent={
                imageIcon && (
                  <OptionIcon>
                    <IconImage icon={imageIcon} />
                  </OptionIcon>
                )
              }
              endContent={
                onEditItem &&
                option.value !== ADD_VALUE && (
                  <EditButton
                    icon={'edit' as IconType}
                    className={clsx('edit-item', { selected: isSelected })}
                    onClick={(e) => handleEdit(e, String(option.value))}
                  />
                )
              }
            />
          )
        }}
        {...props}
        onChange={handleChange}
      />
    )
  },
)
EnumField.displayName = 'EnumField'
