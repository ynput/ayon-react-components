import type { Meta, StoryObj } from '@storybook/react'
import { SwitchButton, SwitchButtonProps } from './SwitchButton'
import { useState } from 'react'
import { Panel } from '../Panels/Panel'

const meta: Meta<typeof SwitchButton> = {
  component: SwitchButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof SwitchButton>

// Simple example with default props
export const Default: Story = {
  args: {
    label: 'Toggle me',
    value: false,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SwitchButton {...args} value={value} onClick={() => setValue(!value)} />
  },
}

// Variants of SwitchButton
const variants: Exclude<SwitchButtonProps['variant'], undefined>[] = [
  'primary',
  'tertiary',
  'secondary',
]

export const Variants: Story = {
  render: () => {
    const [values, setValues] = useState<Record<string, boolean>>(
      Object.fromEntries(variants.map((v) => [v, false])),
    )

    const handleToggle = (variant: string) => {
      setValues((prev) => ({
        ...prev,
        [variant]: !prev[variant],
      }))
    }

    return (
      <Panel>
        <h2>SwitchButton Variants</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 200 }}>
          {variants.map((variant) => (
            <SwitchButton
              key={variant}
              variant={variant}
              label={`${variant} switch`}
              value={values[variant]}
              onClick={() => handleToggle(variant)}
            />
          ))}
        </div>
      </Panel>
    )
  },
}

// Disabled state
export const Disabled: Story = {
  render: () => {
    return (
      <Panel>
        <h2>Disabled SwitchButtons</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 200 }}>
          <SwitchButton label="Disabled (off)" value={false} disabled onClick={() => {}} />
          <SwitchButton label="Disabled (on)" value={true} disabled onClick={() => {}} />
        </div>
      </Panel>
    )
  },
}
