import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

import {
  Button,
  Toolbar,
  LinkButton,
  Section,
  Panel,
  InputText,
  InputTextarea,
  InputSwitch,
  FormLayout,
  FormRow,
  Divider,
  Spacer,
  TablePanel,
  ScrollPanel,
} from '/src/components'

import PrimeReactForm from '/src/primereact'
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

const DemoForm = () => (
  <FormLayout>
    <FormRow label="Label">
      <InputText placeholder="Some text..." />
    </FormRow>
    <FormRow label="Error input">
      <InputText placeholder="Error input" className="error" />
    </FormRow>
    <FormRow label="Disabled input">
      <InputText placeholder="Disabled input" disabled={true} />
    </FormRow>
    <FormRow label="Text area">
      <InputTextarea placeholder="Some text..." rows={8} />
    </FormRow>
    <FormRow label="Switch">
      <InputSwitch />
    </FormRow>
  </FormLayout>
)

const App = () => {
  return (
    <main
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        gap: 'var(--base-gap-large)',
        padding: 'var(--base-gap-large)',
      }}
    >
      <Section>
        <Toolbar>
          <Button label="Button with an icon" icon="folder" tooltip="And a tooltip" />
          <Button icon="save" tooltip="Toolbutton (icon only)" />
          <LinkButton label="Link button" tooltip="Button which looks like a link" />
        </Toolbar>
        <Panel style={{ flexGrow: 0 }}>
          <h1>Primereact components</h1>
          <Divider />
          <PrimeReactForm />
        </Panel>
        <TablePanel>
          <DataTable value={customers}>
            <Column field="name" header="Name" sortable />
            <Column field="country" header="Country" sortable />
            <Column field="representative" header="Representative" sortable />
          </DataTable>
        </TablePanel>
        <ScrollPanel style={{ minHeight: 300 }} className="transparent">
          <h1>Scroll panel</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec tincidunt
            lacinia, nunc est aliquam nunc, eget lacinia nisl lorem nec nunc. Nulla facilisi. Donec
            auctor, nisl eget aliquam tincidunt, nunc elit aliquam massa, eget aliquam nisl nisl sit
            amet nunc. Sed euismod, nisl nec tincidunt lacinia, nunc est
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec tincidunt
            lacinia, nunc est aliquam nunc, eget lacinia nisl lorem nec nunc. Nulla facilisi. Donec
            auctor, nisl eget aliquam tincidunt, nunc elit aliquam massa, eget aliquam nisl nisl sit
            amet nunc. Sed euismod, nisl nec tincidunt lacinia, nunc est
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec tincidunt
            lacinia, nunc est aliquam nunc, eget lacinia nisl lorem nec nunc. Nulla facilisi. Donec
            auctor, nisl eget aliquam tincidunt, nunc elit aliquam massa, eget aliquam nisl nisl sit
            amet nunc. Sed euismod, nisl nec tincidunt lacinia, nunc est
          </p>
        </ScrollPanel>
      </Section>

      <Section>
        <Toolbar>
          <Button label="Disabled button" icon="folder" disabled={true} />
          <Button label="Button without an icon" />
          <Button icon="add" className="circle" tooltip="circle button" />
          <Spacer />
          <Button icon="person" className="transparent" tooltip="transparent button" />
        </Toolbar>
        <Panel>
          <h1>Panel</h1>
          <Divider>Form layout</Divider>
          <DemoForm />
        </Panel>
        <Panel className="transparent">
          <h1>Transparent panel</h1>
          <Divider>And its form</Divider>
          <DemoForm />
        </Panel>
      </Section>
    </main>
  )
}

export default App
