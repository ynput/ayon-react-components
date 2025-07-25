import styled from 'styled-components'
import { HTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react'
import hexToFloat from '../../helpers/hexToFloat'
import int8ToHex from '../../helpers/int8ToHex'
import floatToInt8 from '../../helpers/floatToInt8'
import toHexColor from '../../helpers/toHexColor'
import validateHexColor from '../../helpers/validateHexColor'

import floatToInt16 from '../../helpers/floatToInt16'
import { Button } from '../../Buttons/Button/Button'
import { InputNumber } from '../InputNumber'
import { InputText } from '../InputText'
import ColorPickerPreview from './ColorPickerPreview'
import { Dialog } from '../../Overlay/Dialog'

const ColorInputs = styled.div`
  display: flex;
  align-items: center;

  input[type='number'],
  input[type='text'] {
    margin: 5px;
  }

  input[type='number'] {
    width: 70px;
    margin: 5px;
  }
`

const Confirmations = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--base-gap-large);
  margin-top: 12px;
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
    step: 1,
    max: 65535,
  },
}

export interface InputColorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string | number[]
  onChange: (event: { target: { value: string | number[] } }) => void
  alpha?: boolean
  format?: 'hex' | 'float' | 'uint8' | 'uint16'
  pt?: {
    preview?: HTMLAttributes<HTMLDivElement>
  }
}

// REACT FUNCTIONAL COMPONENT
export const InputColor = forwardRef<HTMLDivElement, InputColorProps>(
  ({ value, onChange, alpha, format = 'hex', pt = { preview: {} }, ...props }, ref) => {
    const isHex = format === 'hex'

    let initValue: string | number[]
    let initAlpha: number = 1

    const previewRef = useRef(null)

    if (isHex) {
      initValue = value
      // check value is a string
      if (!(typeof initValue === 'string')) initValue = '#FFFFFF'
      // remove alpha from value and add to localAlpha
      initAlpha = alpha ? hexToFloat(initValue.slice(7, 9)) : 1

      // no hex alpha should default to 1
      if (value.length < 8) initAlpha = 1
      initValue = initValue.slice(0, 7)
    } else {
      initValue = [...(value as number[])]
      // validate value is in correct format
      if (!Array.isArray(value)) initValue = [0, 0, 0]

      // remove alpha from  value and add to localAlpha
      if (alpha) {
        if (initValue[3] || initValue[3] == 0) {
          initAlpha = initValue[3]
        } else initAlpha = 1
      }
      initValue = initValue.slice(0, 3)
    }

    // use local state and then update global state once dialog closes
    const [localValue, setLocalValue] = useState<string | number[]>(initValue)
    const [localAlpha, setLocalAlpha] = useState<number>(initAlpha)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
      // update state when value changes
      setLocalAlpha(initAlpha)
      setLocalValue(initValue)
    }, [value, setLocalAlpha, setLocalValue])

    // set channel inputs
    const channels = ['r', 'g', 'b']

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const { id, value: targetValue } = e.target

      let newValue
      if (isHex) {
        newValue = targetValue
      } else {
        // create copy of current value
        newValue = [...(localValue as number[])]
        // replace new colour value in array
        newValue.splice(channels.indexOf(id), 1, parseFloat(targetValue))
      }
      // update state
      setLocalValue(newValue)
    }

    const handleColorInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      // handles the native color input on change (always a hex string)
      const value = e.target?.value

      // if format is hex no conversion required
      if (isHex) return setLocalValue(value)

      let floats: number[] = []
      if (value) {
        // convert to floats
        const matches = value.slice(1, 7).match(/.{1,2}/g)

        if (matches) {
          floats = matches.map((v) => hexToFloat(v))
        }
      }

      if (format === 'float') return setLocalValue(floats)

      if (format === 'uint8') return setLocalValue(floats.map((v) => floatToInt8(v)))

      if (format === 'uint16') return setLocalValue(floats.map((v) => floatToInt16(v)))
    }

    const handleOpenDialog = () => {
      setDialogOpen(true)
    }

    const handleConfirmDialog = () => {
      // close dialog
      setDialogOpen(false)
      let newState

      // VALIDATE VALUES
      if (isHex) {
        newState = localValue
        // validate hex string
        newState = validateHexColor(newState, initValue)
      } else if (Array.isArray(localValue)) {
        newState = [...localValue]
        // validate all numbers
        newState = newState.map((v, i) => (isNaN(v) ? initValue[i] : parseFloat(v.toString())))
      }
      console.log(localValue)

      // update local state
      setLocalValue(newState)

      // add alphas back to value
      if (alpha) {
        // validate alpha is number
        let newAlpha = localAlpha && isNaN(localAlpha) ? initAlpha : localAlpha
        // clamp alpha
        newAlpha = Math.min(Math.max(newAlpha || 1, 0), 1)

        // update local state
        setLocalAlpha(newAlpha)
        if (isHex) {
          // convert local alpha to text
          newState = newState + (newAlpha > 0 ? int8ToHex(floatToInt8(newAlpha)) : '00')
        } else {
          // add in alpha value
          newState = [...newState, newAlpha]
        }
      }

      // create an event object to return
      const event = { target: { value: newState as string | number[] } }
      // update global state
      onChange(event)
    }

    const handleCancelDialog = () => {
      console.log('cancelling')
      // reset local variables
      setLocalValue(initValue)
      setLocalAlpha(initAlpha)
      // close dialog
      setDialogOpen(false)
    }

    const DialogTitle = `Colour Picker (${format.charAt(0).toUpperCase() + format.slice(1)})`

    const hex: string = isHex
      ? (localValue as string)
      : (toHexColor(localValue as number[], format) as string)
    // add alpha is required
    let previewBG = hex
    if (alpha) previewBG = hex + (localAlpha || 0 > 0 ? int8ToHex(floatToInt8(localAlpha)) : '00')

    // check if dialog is actually required
    const useDialog = alpha || ['uint16', 'float'].includes(format)


    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement
      // if enter key is pressed, confirm dialog
      if (e.key === 'Enter' && useDialog) {
        e.preventDefault()
        handleConfirmDialog()
        return
      }

      //if escape key is pressed, cancel dialog
      if (e.key === 'Escape' && useDialog) {
        e.preventDefault()
        handleCancelDialog()
        return
      }

      // Handle decimal point being typed
      if (e.key === '.' || e.key === ',') {

        const value = input.value
        
        // This does not work as expected: input type="number" does not allow us
        // to check the selection. TODO: Replace this with text input eventually
        const allSelected = input.selectionStart !== null && input.selectionEnd !== null && input.selectionStart === 0 && input.selectionEnd === value.length

        if (value === '' || allSelected) {
          const newValue = 0
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
          )?.set
          nativeInputValueSetter?.call(input, newValue)

          const event = new Event('input', { bubbles: true })
          input.dispatchEvent(event)

        }
      }

    }


    return (
      <div ref={ref} {...props}>
        <ColorPickerPreview
          {...pt.preview}
          onClick={useDialog ? handleOpenDialog : undefined}
          backgroundColor={previewBG}
          value={hex}
          onChange={!useDialog ? handleColorInputOnChange : undefined}
          onBlur={() => !useDialog && handleConfirmDialog()}
          ref={previewRef}
        />
        <Dialog
          header={DialogTitle}
          onClose={() => setDialogOpen(false)}
          isOpen={dialogOpen}
          size="md"
          style={{ width: 'unset' }}
          footer={
            <>
              <Button label={'Cancel'} onClick={handleCancelDialog} />
              <Button label={'Apply'} onClick={handleConfirmDialog} />
            </>
          }
        >
          <ColorInputs>
            <ColorPickerPreview
              onChange={handleColorInputOnChange}
              backgroundColor={previewBG}
              value={hex}
            />
            {isHex ? (
              <div>
                <label htmlFor={'hex'}>HEX</label>
                <InputText
                  id="hex"
                  value={localValue as string}
                  onChange={handleOnChange}
                  name="hex"
                  maxLength={7}
                  placeholder={formatsConfig.hex.placeholder}
                  required
                  onKeyDown={onInputKeyDown}
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
                      placeholder={formatsConfig[format].placeholder?.toString()}
                      required
                      onKeyDown={onInputKeyDown}
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
                  placeholder={'0.5'}
                  required
                  onKeyDown={onInputKeyDown}
                />
              </div>
            )}
          </ColorInputs>
        </Dialog>
      </div>
    )
  },
)
