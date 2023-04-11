import { useState, useEffect } from 'react'
import { FormLayout, FormRow, Section, Panel, Divider, TablePanel } from '/src/components'

import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import { InputNumber } from 'primereact/inputnumber'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

const customers = [
  { name: 'Customer 1', country: 'Country 1', representative: 'Representative 1' },
  { name: 'Customer 2', country: 'Country 2', representative: 'Representative 2' },
  { name: 'Customer 3', country: 'Country 3', representative: 'Representative 3' },
  { name: 'Customer 4', country: 'Country 4', representative: 'Representative 4' },
  { name: 'Customer 5', country: 'Country 5', representative: 'Representative 5' },
  { name: 'Customer 6', country: 'Country 6', representative: 'Representative 6' },
  { name: 'Customer 7', country: 'Country 7', representative: 'Representative 7' },
]

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

const PrimeReactDemo = () => {
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    setTimeout(() => {
      setTableData(customers)
    }, 1000)
  })

  return (
    <Section style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Panel style={{ maxWidth: 600 }}>
        <h1>Primereact components</h1>
        <Divider />
        <PrimeReactForm />
      </Panel>
      <TablePanel loading={!tableData?.length} style={{ maxWidth: 600 }}>
        <DataTable value={tableData}>
          <Column field="name" header="Name" sortable />
          <Column field="country" header="Country" sortable />
          <Column field="representative" header="Representative" sortable />
        </DataTable>
      </TablePanel>
    </Section>
  )
}

export default PrimeReactDemo
