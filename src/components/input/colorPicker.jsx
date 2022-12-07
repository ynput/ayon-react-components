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
const InputColor = ({ style, className, value, onChange, alpha }) => {
  let initValue = value
  // validate value is in correct format
  if (!Array.isArray(initValue)) initValue = [0, 0, 0]
  // check value has/hasn't got an alpha value
  if (alpha && initValue.length !== 4) initValue = [...initValue, 1]
  if (!alpha && initValue.length === 4) initValue.pop()

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
    // fist check value is a number and convert to float
    if (isNaN(targetValue)) {
      return console.error('Value is not a number')
    }
    // create copy of current value
    let newValue = [...localValue]
    // replace new colour value in array
    newValue.splice(channels.indexOf(id), 1, parseFloat(targetValue))
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
            {channels.map((c, i) => {
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
            })}
          </ColorInputs>
        </Dialog>
      )}
    </div>
  )
}

export { InputColor }
