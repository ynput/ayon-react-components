import styled from 'styled-components'
import { InputNumber } from '.'

// convert a hex value to float between 0-1
const hexToFloat = (hex) => {
  // round to 2 decimals\
  var r = Math.round((parseInt(hex.slice(1, 3), 16) / 255) * 100) / 100,
    g = Math.round((parseInt(hex.slice(3, 5), 16) / 255) * 100) / 100,
    b = Math.round((parseInt(hex.slice(5, 7), 16) / 255) * 100) / 100

  return [r, g, b]
}

const floatToHex = (float) => {
  return (
    '#' +
    (
      (1 << 24) |
      (Math.round(float[0] * 255) << 16) |
      (Math.round(float[1] * 255) << 8) |
      Math.round(float[2] * 255)
    )
      .toString(16)
      .slice(1)
  )
}

// values = array of floats [0.5, 0.25, 0.6, 1]
const colorPicker = ({ style, className, values, onChange }) => {
  const channels = ['r', 'g', 'b', 'a']

  const handleOnChange = (e) => {
    e.preventDefault()
    const { id, value } = e.target
    // fist check value is a number and convert to float
    if (isNaN(value)) {
      return console.error('Value is not a number')
    }
    // create copy of current values
    let newValues = [...values]
    // delete updating value
    newValues.splice(channels.indexOf(id), 1, parseFloat(value))

    onChange && onChange(newValues)
  }

  const handlePickerOnChange = (e) => {
    e.preventDefault()
    // convert hex to rgb
    const newValues = hexToFloat(e.target.value)
    // insert alpha
    newValues.push(values[3])

    // update values state
    onChange && onChange(newValues)
  }

  return (
    <div style={style} className={className}>
      <input type="color" onChange={handlePickerOnChange} value={floatToHex(values)} />
      {values &&
        values.map((value, i) => {
          const c = channels[i]

          return (
            <div key={c}>
              <label htmlFor={c}>{c.toUpperCase()}</label>
              <InputNumber
                id={c}
                min={0}
                max={1}
                value={value}
                step={'any'}
                onChange={handleOnChange}
              />
            </div>
          )
        })}
    </div>
  )
}

const InputColorAlpha = styled(colorPicker)`
  color: var(--color-text);
  border: 1px solid var(--color-grey-03);
  background-color: var(--color-grey-00);
  border-radius: var(--base-input-border-radius);
  /* min-height: var(--base-input-size); */
  /* max-height: var(--base-input-size); */
  display: flex;
  align-items: center;

  /* padding: 5px; */

  width: fit-content;

  /* reset color input */
  input[type='color'] {
    border: none;
    background-color: unset;
    padding: 0;
    /* offset to padding and border */
    width: 38px;
    margin: 5px;
  }

  input[type='number'] {
    width: 50px;
    margin: 5px;
  }

  &:focus {
    outline: 1px solid var(--color-hl-00);
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

// colorPicker.propTypes = {}

export { InputColorAlpha }
