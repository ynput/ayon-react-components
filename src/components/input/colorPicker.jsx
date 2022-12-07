import styled from 'styled-components'
import { InputNumber, InputText } from '.'
import Dialog from '../overlay/dialog'
import { useState } from 'react'
import Proptypes from 'prop-types'

const ColorInputs = styled.div`
  display: flex;
  align-items: center;

  input {
    margin: 5px;
  }

  input[type='number'] {
    width: 70px;
    margin: 5px;
  }
`

const ColorPreviewButton = styled.button`
  min-height: var(--base-input-size);
  max-height: var(--base-input-size);
  max-width: var(--base-input-size);
  min-width: var(--base-input-size);
  cursor: pointer;

  color: var(--color-text);
  border: 1px solid var(--color-grey-03);
  background-color: var(--color-grey-00);
  border-radius: var(--base-input-border-radius);
  padding: 0 5px;

  &.error,
  &:invalid {
    border-color: var(--color-hl-error);
  }

  &:disabled {
    color: var(--color-text-dim);
    background-color: var(--input-disabled-background-color);
    border-color: var(--input-disabled-border-color);
    font-style: italic;
    cursor: not-allowed;
  }
`

// REACT FUNCTIONAL COMPONENT
const InputColor = ({ style, className, value, onChange, alpha, format = 'hex' }) => {
  const isHex = format === 'hex'
  let initValue = value

  if (isHex) {
    const defaultAlpha = 'FF'
    // check value is a string
    if (!(typeof value === 'string')) initValue = '#FFFFFF'
    // check value has/hasn't got an alpha value
    if (alpha && initValue.length !== 9) initValue = initValue.slice(0, 7) + defaultAlpha
    if (!alpha && initValue.length > 7) initValue = initValue.slice(0, 7)
  } else {
    const defaultAlpha = 1
    // validate value is in correct format
    if (!Array.isArray(initValue)) initValue = [0, 0, 0]
    // check value has/hasn't got an alpha value
    if (alpha && initValue.length !== 4) initValue = [...initValue, defaultAlpha]
    if (!alpha && initValue.length === 4) initValue.pop()
  }

  // use local state and then update global state once dialog closes
  const [localValue, setLocalValue] = useState(initValue)
  const [dialogOpen, setDialogOpen] = useState(false)

  // set channel inputs
  const channels = ['r', 'g', 'b']
  // add alpha input
  if (alpha) channels.push('a')

  const handleOnChange = (e) => {
    e.preventDefault()
    const { id, value: targetValue } = e.target

    let newValue
    if (isHex) {
      newValue = targetValue
    } else {
      // fist check value is a number and convert to float
      if (isNaN(targetValue)) {
        return console.error('Value is not a number')
      }
      // create copy of current value
      newValue = [...localValue]
      // replace new colour value in array
      newValue.splice(channels.indexOf(id), 1, parseFloat(targetValue))
    }
    // update state
    setLocalValue(newValue)
  }

  const handleCloseDialog = () => {
    // close dialog
    setDialogOpen(false)
    // update global state
    onChange(localValue)
  }

  return (
    <div style={style} className={className}>
      <ColorPreviewButton onClick={() => setDialogOpen(true)} />
      {dialogOpen && (
        <Dialog header={'Color Picker'} onHide={handleCloseDialog}>
          <ColorInputs>
            {isHex ? (
              <div>
                <label htmlFor={'hex'}>HEX</label>
                <InputText
                  id="hex"
                  value={localValue}
                  onChange={handleOnChange}
                  name="hex"
                  maxLength={alpha ? 9 : 7}
                />
              </div>
            ) : (
              channels.map((c, i) => {
                const v = localValue[i]
                return (
                  <div key={c}>
                    <label htmlFor={c}>{c.toUpperCase()}</label>
                    <InputNumber
                      id={c}
                      min={0}
                      max={1}
                      value={v}
                      step={'any'}
                      onChange={handleOnChange}
                    />
                  </div>
                )
              })
            )}
          </ColorInputs>
        </Dialog>
      )}
    </div>
  )
}

InputColor.propTypes = {
  alpha: Proptypes.bool,
  format: Proptypes.oneOf(['hex', 'float', 'uint8', 'int16']),
}

export { InputColor }
