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
} from '/src/components'

import PrimeReactForm from '/src/primereact'

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
        <Panel>
          <h1>Panel</h1>
          <Divider />
          <PrimeReactForm />
        </Panel>
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
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec</p>
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
