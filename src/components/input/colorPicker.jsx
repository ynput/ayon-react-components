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
  position: relative;

  color: var(--color-text);
  border: 1px solid var(--color-grey-03);
  background-color: var(--color-grey-00);
  border-radius: var(--base-input-border-radius);
  padding: 0 5px;

  &::after,
  &::before {
    content: '';
    position: absolute;
    inset: 0;
  }

  &::before {
    /* DOES NOT SUPPORT IE or pre-Chromium Edge */
    background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 15px 15px;
  }

  &:after {
    background-color: ${(props) => (props.hex ? props.hex : 'var(--color-grey-00)')};
    opacity: ${(props) => (props.alpha ? props.alpha : 'var(--color-grey-00)')};
  }

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

const formatsConfig = {
  hex: {
    placeholder: '#34C95C',
  },
  float: {
    placeholder: 0.5,
    step: 0.01,
    max: 1,
  },

  uint8: {
    placeholder: 255,
    step: 1,
    max: 255,
  },
  uint16: {
    placeholder: 65535,
    step: 10,
    max: 65535,
  },
}

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
      // create copy of current value
      newValue = [...localValue]
      // replace new colour value in array
      newValue.splice(channels.indexOf(id), 1, targetValue)
    }
    // update state
    setLocalValue(newValue)
  }

  const handleCloseDialog = () => {
    // close dialog
    setDialogOpen(false)

    // TODO: validate value matches chosen format

    // create an event object to return
    const event = { target: { value: localValue } }
    // update global state
    onChange(event)
  }

  const DialogTitle = `Colour Picker (${format.charAt(0).toUpperCase() + format.slice(1)})`
  //TODO: format the alpha as a number between 0-1 and set CSS opacity
  const normalisedAlpha = alpha ? 0.6 : 1

  return (
    <div style={style} className={className}>
      <ColorPreviewButton onClick={() => setDialogOpen(true)} hex={value} alpha={normalisedAlpha} />
      {dialogOpen && (
        <Dialog header={DialogTitle} onHide={handleCloseDialog}>
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
                  placeholder={
                    alpha ? formatsConfig.hex.placeholder + 'FF' : formatsConfig.hex.placeholder
                  }
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
                      max={formatsConfig[format].max}
                      value={v}
                      step={formatsConfig[format].step}
                      onChange={handleOnChange}
                      placeholder={formatsConfig[format].placeholder}
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
