import { FormLayout, FormRow } from '/src/components'

import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import { InputNumber } from 'primereact/inputnumber'

const PrimeReactForm = () => {
  return (
    <FormLayout>
      <FormRow label="Dropdown">
        <Dropdown />
      </FormRow>
      <FormRow label="MultiSelect">
        <MultiSelect />
      </FormRow>
      <FormRow label="InputNumber">
        <InputNumber showButtons={true} />
      </FormRow>
    </FormLayout>
  )
}

export default PrimeReactForm
