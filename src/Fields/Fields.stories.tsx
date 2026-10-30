import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import styled from 'styled-components'
import { fieldVariables } from './fieldStyles'
import {
  AttributeFieldConfig,
  AttributeFields,
  BooleanField,
  ColorField,
  DateField,
  DateTimeField,
  DateTimeRangeField,
  DateTimeRangeFieldValue,
  EnumFieldOption,
  FieldRow,
  IconField,
  JsonField,
  LabelWithNameField,
  MultiSelectField,
  NumberField,
  SelectField,
  StatusSelectField,
  TextAreaField,
  TextField,
  TimeField,
} from '.'

const meta: Meta = {
  title: 'Fields/Fields',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj

const Form = styled.div`
  ${fieldVariables}
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 460px;
`

const Log = styled.pre`
  margin-top: 16px;
  font-size: 11px;
  color: var(--md-sys-color-on-surface-variant);
`

// Shows the committed values, as an auto-saving form would send them
const useCommitLog = () => {
  const [log, setLog] = useState<string[]>([])
  const commit = (name: string) => (value: unknown) =>
    setLog((prev) => [`${name}: ${JSON.stringify(value)}`, ...prev].slice(0, 8))
  return { log, commit }
}

const options: EnumFieldOption[] = [
  { value: 'animation', label: 'Animation', icon: 'directions_run', color: '#e6524b' },
  {
    value: 'lighting',
    label: 'Lighting',
    icon: { type: 'material-symbols', name: 'lightbulb' },
    color: '#f4c95d',
  },
  { value: 'compositing', label: 'Compositing', icon: 'layers', color: '#5bb5f0' },
]

const statuses: EnumFieldOption[] = [
  { value: 'Not ready', label: 'Not ready', icon: 'fiber_new', color: '#434a56' },
  { value: 'In progress', label: 'In progress', icon: 'play_arrow', color: '#3498db' },
  { value: 'Approved', label: 'Approved', icon: 'task_alt', color: '#00f0b4' },
]

const AllFieldsTemplate = ({ isReadOnly = false }: { isReadOnly?: boolean }) => {
  const { log, commit } = useCommitLog()
  const [text, setText] = useState('Hello')
  const [number, setNumber] = useState<number | undefined>(0)
  const [bool, setBool] = useState(true)
  const [date, setDate] = useState('2026-10-27')
  const [time, setTime] = useState('09:30')
  const [dateTime, setDateTime] = useState('2026-10-27T14:00:00.000Z')
  const [select, setSelect] = useState<string | null>('animation')
  const [multi, setMulti] = useState<string[]>(['lighting'])
  const [status, setStatus] = useState('In progress')
  const [color, setColor] = useState('#5bb5f0')
  const [icon, setIcon] = useState('movie')
  const [list, setList] = useState<string[] | number[]>(['one', 'two'])
  const [json, setJson] = useState<unknown>({ fps: 25 })

  const row = { isReadOnly, className: 'ghost' }

  return (
    <Form>
      <FieldRow icon="text_fields" label="Text" copyValue={text}>
        <TextField {...row} value={text} onChange={setText} onCommit={commit('text')} />
      </FieldRow>
      <FieldRow icon="pin" label="Number" copyValue={String(number)}>
        <NumberField
          {...row}
          type="float"
          value={number}
          onChange={setNumber}
          onCommit={commit('number')}
          placeholder="Enter a number"
        />
      </FieldRow>
      <FieldRow icon="check_box" label="Boolean" copyValue={String(bool)}>
        <BooleanField {...row} value={bool} onChange={setBool} onCommit={commit('boolean')} />
      </FieldRow>
      <FieldRow icon="calendar_month" label="Date" copyValue={date}>
        <DateField {...row} value={date} onChange={setDate} onCommit={commit('date')} />
      </FieldRow>
      <FieldRow icon="schedule" label="Time" copyValue={time}>
        <TimeField {...row} value={time} onChange={setTime} onCommit={commit('time')} />
      </FieldRow>
      <FieldRow icon="event" label="Date time (UTC)" copyValue={dateTime}>
        <DateTimeField
          {...row}
          value={dateTime}
          onChange={(v) => setDateTime(v ?? '')}
          onCommit={commit('dateTime')}
        />
      </FieldRow>
      <FieldRow icon="checklist" label="Select" copyValue={select}>
        <SelectField
          {...row}
          type="string"
          value={select}
          options={options}
          onChange={setSelect}
          onCommit={commit('select')}
          placeholder="Select an option"
        />
      </FieldRow>
      <FieldRow icon="checklist" label="Multi select" copyValue={multi.join(', ')}>
        <MultiSelectField
          {...row}
          type="list_of_strings"
          value={multi}
          options={options}
          onChange={setMulti}
          onCommit={commit('multiSelect')}
          placeholder="Select options"
        />
      </FieldRow>
      <FieldRow icon="radio_button_checked" label="Status" copyValue={status}>
        <StatusSelectField
          isReadOnly={isReadOnly}
          value={status}
          options={statuses}
          onChange={setStatus}
          onCommit={commit('status')}
        />
      </FieldRow>
      <FieldRow icon="palette" label="Color" copyValue={color}>
        <ColorField {...row} value={color} onChange={setColor} onCommit={commit('color')} />
      </FieldRow>
      <FieldRow icon="interests" label="Icon" copyValue={icon}>
        <IconField {...row} value={icon} onChange={setIcon} onCommit={commit('icon')} />
      </FieldRow>
      <FieldRow icon="format_list_bulleted" label="List" alignStart copyValue={list.join(', ')}>
        <TextAreaField
          {...row}
          type="list_of_strings"
          value={list}
          onChange={setList}
          onCommit={commit('list')}
        />
      </FieldRow>
      <FieldRow icon="data_object" label="JSON" alignStart copyValue={JSON.stringify(json)}>
        <JsonField {...row} value={json} onChange={setJson} onCommit={commit('json')} />
      </FieldRow>
      <Log>{log.join('\n') || 'Commits appear here'}</Log>
    </Form>
  )
}

export const AllFields: Story = {
  render: () => <AllFieldsTemplate />,
}

export const ReadOnly: Story = {
  render: () => <AllFieldsTemplate isReadOnly />,
}

const DateTimeRangeTemplate = () => {
  const [range, setRange] = useState<DateTimeRangeFieldValue>({
    startValue: '2026-10-27',
    endValue: '2026-10-29',
    withTime: false,
  })
  const [committed, setCommitted] = useState<DateTimeRangeFieldValue | null>(null)
  return (
    <Form>
      <FieldRow icon="schedule" label="When" hasCopyButton={false}>
        <DateTimeRangeField
          startValue={range.startValue}
          endValue={range.endValue}
          onChange={setRange}
          onCommit={setCommitted}
          ghost
          timezoneLabel={range.withTime ? 'UTC+1' : undefined}
          timezoneTooltip="Europe/Prague"
        />
      </FieldRow>
      <Log>{JSON.stringify({ value: range, committed }, null, 2)}</Log>
    </Form>
  )
}

export const DateTimeRange: Story = {
  render: () => <DateTimeRangeTemplate />,
}

const LabelWithNameTemplate = ({ nameFormat }: { nameFormat: 'snake_case' | 'camelCase' }) => {
  const [label, setLabel] = useState('Lighting Pass 2')
  const [name, setName] = useState('')
  return (
    <Form>
      <LabelWithNameField
        labelValue={label}
        nameValue={name}
        nameFormat={nameFormat}
        onLabelChange={setLabel}
        onNameChange={setName}
        autoFocus={false}
      />
      <Log>{`name: ${name}`}</Log>
    </Form>
  )
}

export const LabelWithName: Story = {
  render: () => <LabelWithNameTemplate nameFormat="snake_case" />,
}

export const LabelWithNameCamelCase: Story = {
  render: () => <LabelWithNameTemplate nameFormat="camelCase" />,
}

const attributes: AttributeFieldConfig[] = [
  { name: 'department', label: 'Department', dataType: 'string', enum: options },
  { name: 'taskTypes', label: 'Task Types', dataType: 'list_of_strings', enum: options },
  { name: 'effort', label: 'Effort', dataType: 'float', icon: 'timer' },
  { name: 'billable', label: 'Billable', dataType: 'boolean', icon: 'paid' },
  { name: 'note', label: 'Note', dataType: 'string' },
  { name: 'locked', label: 'Locked', dataType: 'integer', isReadOnly: true },
]

const AttributeFieldsTemplate = () => {
  const { log, commit } = useCommitLog()
  const [values, setValues] = useState<Record<string, unknown>>({
    department: 'animation',
    billable: false,
    locked: 0,
  })
  return (
    <Form>
      <AttributeFields
        attributes={attributes}
        values={values}
        onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
        onCommit={(name, value) => commit(name)(value)}
        errors={{ effort: values.effort === 0 ? 'Effort must be more than 0' : undefined }}
        mixed={['note']}
      />
      <Log>{log.join('\n') || 'Commits appear here'}</Log>
    </Form>
  )
}

export const Attributes: Story = {
  render: () => <AttributeFieldsTemplate />,
}
