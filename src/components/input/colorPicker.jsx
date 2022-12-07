import styled from 'styled-components'
import { InputNumber, InputText } from '.'
import Dialog from '../overlay/dialog'
import { useState } from 'react'
import Proptypes from 'prop-types'
import hexToFloat from '../../helpers/hexToFloat'
import int8ToHex from '../../helpers/int8ToHex'
import floatToInt8 from '../../helpers/floatToInt8'

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
  let initValue
  let initAlpha = 1

  if (isHex) {
    initValue = value
    // check value is a string
    if (!(typeof initValue === 'string')) initValue = '#FFFFFF'
    // remove alpha from value and add to localAlpha
    initAlpha = hexToFloat(initValue.slice(7, 9)) || 1
    initValue = initValue.slice(0, 7)
  } else {
    initValue = [...value]
    // validate value is in correct format
    if (!Array.isArray(value)) initValue = [0, 0, 0]

    // remove alpha from  value and add to localAlpha
    initAlpha = initValue[3] || 1
    initValue = initValue.slice(0, 3)
  }

  // use local state and then update global state once dialog closes
  const [localValue, setLocalValue] = useState(initValue)
  const [localAlpha, setLocalAlpha] = useState(initAlpha)
  const [dialogOpen, setDialogOpen] = useState(false)

  // set channel inputs
  const channels = ['r', 'g', 'b']

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

    let newState
    // add alphas back to value
    if (alpha) {
      if (isHex) {
        // convert local alpha to text
        newState = localValue + int8ToHex(floatToInt8(localAlpha))
      } else {
        // add in alpha value
        newState = [...localValue, localAlpha]
      }
    } else {
      newState = localValue
    }
    // TODO: validate value matches chosen format

    console.log({ newState })
    // create an event object to return
    const event = { target: { value: newState } }
    // update global state
    onChange(event)
  }

  const DialogTitle = `Colour Picker (${format.charAt(0).toUpperCase() + format.slice(1)})`

  return (
    <div style={style} className={className}>
      <ColorPreviewButton onClick={() => setDialogOpen(true)} hex={value} alpha={localAlpha} />
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
                  maxLength={7}
                  placeholder={formatsConfig.hex.placeholder}
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
            {alpha && (
              <div key={'a'}>
                <label htmlFor={'a'}>{'A'}</label>
                <InputNumber
                  id={'a'}
                  min={0}
                  max={1}
                  value={localAlpha}
                  step={0.01}
                  onChange={(e) => setLocalAlpha(parseFloat(e.target.value))}
                  placeholder={0.5}
                />
              </div>
            )}
          </ColorInputs>
        </Dialog>
      )}
    </div>
  )
}

InputColor.propTypes = {
  alpha: Proptypes.bool,
  format: Proptypes.oneOf(['hex', 'float', 'uint8', 'uint16']),
}

export { InputColor }
