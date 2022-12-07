import styled from 'styled-components'
import { InputNumber } from '.'
import Dialog from '../overlay/dialog'
import { useState } from 'react'

const ColorInputs = styled.div`
  display: flex;
  align-items: center;

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
`

// REACT FUNCTIONAL COMPONENT
const InputColor = ({ style, className, value, onChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const channels = ['r', 'g', 'b', 'a']

  const handleOnChange = (e) => {
    e.preventDefault()
    const { id, value: targetValue } = e.target
    // fist check value is a number and convert to float
    if (isNaN(targetValue)) {
      return console.error('Value is not a number')
    }
    // create copy of current value
    let newValue = [...value]
    // replace new colour value in array
    newValue.splice(channels.indexOf(id), 1, parseFloat(targetValue))
    // update value state
    onChange && onChange(newValue)
  }

  return (
    <div style={style} className={className}>
      <ColorPreviewButton onClick={() => setDialogOpen(true)} />
      {dialogOpen && (
        <Dialog header={'Color Picker'} onHide={() => setDialogOpen(false)}>
          <ColorInputs>
            {value &&
              value.map((v, i) => {
                const c = channels[i]
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
              })}
          </ColorInputs>
        </Dialog>
      )}
    </div>
  )
}

export { InputColor }
