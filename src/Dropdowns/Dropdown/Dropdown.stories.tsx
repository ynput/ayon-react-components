import type { Meta, StoryObj } from '@storybook/react'
import { DefaultValueTemplate, Dropdown, DropdownProps, DropdownRef } from '.'
import { useRef, useState } from 'react'
import { Button } from '../../Buttons/Button'
import { Icon, IconType } from '../../Icon'
import { InputText } from '../../Inputs/InputText'
import { Toolbar } from '../../Layout/Toolbar'
import { Panel } from '../../Panels/Panel'

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Dropdown>

const options: { value: IconType; keyword: string }[] = [
  { value: 'favorite', keyword: 'like' },
  { value: 'search', keyword: 'find' },
  { value: 'settings', keyword: 'configuration' },
  { value: 'home', keyword: 'house' },
  { value: 'account_circle', keyword: 'user' },
  { value: 'add', keyword: 'create' },
  { value: 'add_circle', keyword: 'plus' },
  { value: 'add_shopping_cart', keyword: 'cart' },
  { value: 'alarm', keyword: 'clock' },
  { value: 'alarm_add', keyword: 'clock_plus' },
  { value: 'alarm_off', keyword: 'clock_off' },
  { value: 'alarm_on', keyword: 'clock_on' },
]

const Template = (args: DropdownProps) => {
  const [value, setValue] = useState<string[] | null>(
    args.value === undefined ? [options[0].value] : args.value,
  )
  const dropdownRef = useRef<DropdownRef>(null)

  const handleChange = (v: string[], removed: string[]) => {
    console.log(v)
    setValue(v)
    if (args.onChange) args.onChange(v, removed)
  }

  return (
    <Toolbar style={{ margin: 32 }}>
      <Dropdown
        {...args}
        value={value}
        onChange={handleChange}
        options={args.options || options}
        onClear={args.onClear && setValue}
        onClearNull={args.onClearNull && setValue}
        widthExpand
        style={{
          width: 250,
          ...args.style,
        }}
        ref={dropdownRef}
      />
      <InputText />
      <Button label="Open dropdown" onClick={() => dropdownRef.current?.open()} />
    </Toolbar>
  )
}

// icons and multi select
export const Icons: Story = {
  args: {
    options: options.map((option) => ({ ...option, icon: option.value })),
    multiSelect: true,
    minSelected: 1,
    widthExpand: true,
    maxHeight: 180,
    onClear: undefined,
  },
  render: Template,
}

// simple dropdown with three items
export const Basic: Story = {
  render: Template,
}

// simple dropdown with three items
export const Disabled: Story = {
  render: Template,
  args: {
    options: options.map((option, i) => ({ ...option, disabled: i === 0 })),
    disabledValues: ['add', 'add_circle'],
  },
}

// simple dropdown with three items
export const Tags: Story = {
  render: Template,
  args: {
    valueTemplate: 'tags',
    multiSelect: true,
    editable: true,
    disabledValues: ['add'],
  },
}

// simple dropdown with 1000 items and search
export const Search: Story = {
  args: {
    searchFields: ['value', 'keyword'],
    search: true,
    onClear: undefined,
    placeholder: 'Selected an Icon...',
    value: [],
    onSelectAll: () => console.log('selected all'),
  },
  render: Template,
}

export const Multiple: Story = {
  args: {
    value: [options[0].value, options[1].value],
    widthExpand: true,
    multiSelect: true,
    align: 'right',
    onClear: () => console.log('clear'),
    style: {
      width: 'unset',
    },
    isMultiple: true,
  },
  render: Template,
}
export const MultipleNotOverride: Story = {
  args: {
    value: [options[2].value, options[3].value],
    widthExpand: true,
    multiSelect: true,
    align: 'right',
    style: {
      width: 'unset',
    },
    isMultiple: true,
    multipleOverride: false,
    onRemoveItem: (v) => console.log('remove', v),
    onAddItem: (v) => console.log('add', v),
    onChange: (added, removed) => console.log({ added, removed }),
  },
  render: Template,
}

export const MultipleSorted: Story = {
  args: {
    isMultiple: true,
    value: [options[0].value, options[1].value],
    widthExpand: true,
    multiSelect: true,
    minSelected: 2,
    align: 'right',
    onClear: () => console.log('clear'),
    style: {
      width: 'unset',
    },
    sortBySelected: true,
  },
  render: Template,
}

// custom item and option renderers
// TODO: fix this!
export const CustomTemplates: Story = {
  args: {
    value: [options[0].value, options[1].value],
    options: options.map((option) => ({ ...option, icon: option.value })),
    multiSelect: true,
    widthExpand: true,
    listStyle: { backgroundColor: 'black' },
    style: {
      width: 'unset',
    },
    valueTemplate: (value) => (
      <div
        style={{
          background: 'orange',
          borderRadius: 3,
          padding: 10,
          display: 'flex',
          width: '100%',
        }}
      >
        {value?.map((v) => (
          <Button
            label={v.toString()}
            icon={v as IconType}
            style={{
              marginLeft: 4,
              backgroundColor: 'unset',
              color: 'black',
            }}
            iconProps={{ style: { color: 'black' } }}
          />
        ))}
      </div>
    ),
    itemTemplate: (option, isActive, isSelected) => (
      <div
        style={{
          background: isActive && isSelected ? 'orange' : isSelected ? '#029cfd' : '#292c2e',
          borderRadius: 3,
          margin: 4,
          padding: 10,
        }}
      >
        {isSelected ? '✓' : ' '}
        {option?.value}
      </div>
    ),
  },
  render: Template,
}

export const Scrolled: Story = {
  render: (args: DropdownProps) => {
    return (
      <Panel style={{ overflow: 'scroll', position: 'absolute', inset: 0 }}>
        {Array.from(Array(50).keys()).map((i) => (
          <Dropdown
            key={i}
            {...args}
            value={args.value || [options[0].value]}
            options={[...options, ...options]}
            widthExpand
            style={{
              width: 250,
              height: 32,
              flex: 'none',
              ...args.style,
            }}
          />
        ))}
      </Panel>
    )
  },
}

// simple dropdown with 1000 items and search
export const InvalidValue: Story = {
  args: {
    placeholder: 'Select a value...',
    onClearNull: () => console.log('clear null'),
    onClear: undefined,
    value: null,
    multiSelect: true,
    nullPlaceholder: 'No value (custom placeholder)',
  },
  render: Template,
}

// when there are values but no options for those values
export const MissingOptions: Story = {
  args: {
    value: ['pizza', 'burger', 'fries'],
    options: [{ value: 'pizza' }, { value: 'burger' }],
    multiSelect: true,
    onSelectAll: undefined,
    onClear: undefined,
  },
  render: Template,
}

// outside state synced to dropdown state
export const SyncedState: Story = {
  args: {},
  render: (args: DropdownProps) => {
    const [value, setValue] = useState<string[] | null>([])
    const [liveValue, setLiveValue] = useState<string[] | null>([])

    const handleChange = (v: string[] | null) => {
      setValue(v)
      setLiveValue(v)
    }

    return (
      <>
        <Dropdown
          value={value}
          multiSelect
          onSelectionChange={(v) => setLiveValue(v)}
          onChange={handleChange}
          options={args.options || options}
          widthExpand
          style={{
            width: 250,
            ...args.style,
          }}
        />
        <span>{liveValue?.join(', ')}</span>
      </>
    )
  },
}

const optionsWithIcons = options.map((option) => ({ ...option, icon: option.value }))

const initialIconsAtThreeValuesArgs: Story['args'] = {
  options: optionsWithIcons,
  multiSelect: true,
  minSelected: 1,
  widthExpand: true,
}

export const IconsAtThreeValues: Story = {
  args: {
    ...initialIconsAtThreeValuesArgs,
    valueTemplate: (value, selected, isOpen) =>
      selected.length >= 3 ? (
        <DefaultValueTemplate {...{ value, selected, isOpen }} {...initialIconsAtThreeValuesArgs}>
          <div style={{ display: 'flex', gap: 2 }}>
            {optionsWithIcons
              .filter((option) => selected.includes(option.value))
              .map((option) => (
                <Icon icon={option.icon as IconType} />
              ))}
          </div>
        </DefaultValueTemplate>
      ) : null,
  },
  render: Template,
}
