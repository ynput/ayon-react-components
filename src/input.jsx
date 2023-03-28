import { useState } from 'react'
import {
  Dropdown,
  InputColor,
  InputText,
  InputNumber,
  InputTextarea,
  InputSwitch,
  FormLayout,
  FormRow,
  Panel,
  Section,
} from '/src/components'

const dropdownOptions = [
  { label: 'Option 1', value: 1, icon: 'visibility' },
  { label: 'Option 2', value: 2, icon: 'visibility' },
  { label: 'Option 3', value: 3, icon: 'visibility' },
  { label: 'Option 4', value: 4, icon: 'visibility' },
  { label: 'Option 5', value: 5, icon: 'visibility' },
  { label: 'Option 6', value: 6, icon: 'visibility' },
]

const InputDemo = () => {
  // demo for color picker
  const colors = {
    hex: '#c600ff',
    hexAlpha: '#c600ff99',
    float: [0.5, 0.3, 0.9],
    floatAlpha: [0.5, 0.3, 0.9, 0.7],
    uint8: [255, 145, 56],
    uint8Alpha: [255, 145, 56, 0.8],
    uint16: [255, 145, 56],
    uint16Alpha: [255, 145, 56, 0.8],
  }
  const format = 'hex'
  const alpha = true
  const useFormatAlpha = true
  const colorKey = `${format}${useFormatAlpha ? 'Alpha' : ''}`
  const [color, setColor] = useState(colors[colorKey])

  const [dropdownValue, setDropdownValue] = useState([dropdownOptions[0].value])
  const [multiSelectValue, setMultiselectValue] = useState([])

  return (
    <Section style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Panel style={{ maxWidth: 600 }}>
        <FormLayout>
          <FormRow label="Label">
            <InputText placeholder="Some text..." pattern="[a-zA-Z1-9_]{2,16}" />
          </FormRow>
          <FormRow label="Error input">
            <InputText placeholder="Error input" className="error" />
          </FormRow>
          <FormRow label="Disabled input">
            <InputText placeholder="Disabled input" disabled={true} />
          </FormRow>
          <FormRow label="Number input">
            <InputNumber placeholder="Number input" min={0} max={10} />
          </FormRow>

          <FormRow label="Dropdown">
            <Dropdown
              options={dropdownOptions}
              value={dropdownValue}
              onChange={setDropdownValue}
              widthExpand={true}
            />
          </FormRow>
          <FormRow>{JSON.stringify(dropdownValue)}</FormRow>

          <FormRow label="Multiselect">
            <Dropdown
              options={dropdownOptions}
              value={multiSelectValue}
              onChange={setMultiselectValue}
              multiSelect={true}
              widthExpand={true}
            />
          </FormRow>
          <FormRow>{JSON.stringify(multiSelectValue)}</FormRow>

          <FormRow label="Color input">
            <InputColor
              placeholder="Color Alpha input"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              format={format}
              alpha={alpha}
            />
          </FormRow>
          <FormRow label="Text area">
            <InputTextarea placeholder="Some text..." rows={8} />
          </FormRow>
          <FormRow label="Switch">
            <InputSwitch />
          </FormRow>
        </FormLayout>
      </Panel>
    </Section>
  )
}

export default InputDemo
