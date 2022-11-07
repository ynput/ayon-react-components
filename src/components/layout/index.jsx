import styled from 'styled-components'

const Section = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: var(--base-gap-large);

  // column is implicit

  flex-direction: column;
  & > * {
    width: 100%;
  }

  &.row {
    flex-direction: row;
    & > * {
      width: 100%;
    }
  }

  &.wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`

const Panel = styled.div`
  position: relative;
  padding: 12px;
  background-color: var(--panel-background);
  border-radius: var(--panel-border-radius);
  flex-grow: 1;

  &.transparent {
    background-color: transparent;
  }

  &.nopad {
    padding: 0;
  }
`

const ScrollArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  gap: 12px;
`

const Toolbar = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
`

const Spacer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
`

// Form layout

const FormLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--base-gap-medium);
`

const BaseFormRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;

  .label {
    min-width: 120px;
  }

  .field {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: left;
`

const FormRow = ({ label, children, className, style }) => {
  return (
    <BaseFormRow className={className} style={style}>
      <div className="label">{label}</div>
      <div className="field">{children}</div>
    </BaseFormRow>
  )
}

export { Section, Panel, ScrollArea, Toolbar, Spacer, FormLayout, FormRow }
