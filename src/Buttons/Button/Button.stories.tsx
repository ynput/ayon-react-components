import type { Meta, StoryObj } from '@storybook/react'
import { Button, ButtonProps } from '.'
import { useState } from 'react'
import { Panel } from '../Panels/Panel'

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

const variants: ButtonProps['variant'][] = [
  'surface',
  'tonal',
  'filled',
  'tertiary',
  'text',
  'nav',
  'danger',
]

const AllButtons = (args: Story['args']) => {
  const [selected, setSelected] = useState(variants)
  return (
    <Panel>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {variants.map((variant) => (
          <Button {...args} variant={variant} label={variant + ' button'} />
        ))}
      </div>
      <h2>Icon</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {variants.map((variant) => (
          <Button {...args} variant={variant} label={variant + ' button'} icon="add" />
        ))}
      </div>
      <h2>Selected (click to toggle selection)</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {variants.map((variant) => (
          <Button
            {...args}
            variant={variant}
            label={variant + ' button'}
            selected={selected.includes(variant)}
            icon="star"
            onClick={() =>
              setSelected((selected) =>
                selected.includes(variant)
                  ? selected.filter((v) => v !== variant)
                  : [...selected, variant],
              )
            }
          />
        ))}
      </div>
      <h2>Disabled</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {variants.map((variant) => (
          <Button {...args} variant={variant} label={variant + ' button'} disabled />
        ))}
      </div>
    </Panel>
  )
}

export const Buttons: Story = {
  render: AllButtons,
}

const AllIcons = (args: Story['args']) => {
  const [selected, setSelected] = useState(variants)
  return (
    <Panel>
      <h2>Icon</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {variants.map((variant) => (
          <Button {...args} variant={variant} icon="add" />
        ))}
      </div>
      <h2>Selected (click to toggle selection)</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {variants.map((variant) => (
          <Button
            {...args}
            variant={variant}
            selected={selected.includes(variant)}
            icon="star"
            onClick={() =>
              setSelected((selected) =>
                selected.includes(variant)
                  ? selected.filter((v) => v !== variant)
                  : [...selected, variant],
              )
            }
          />
        ))}
      </div>
      <h2>Disabled</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {variants.map((variant) => (
          <Button {...args} variant={variant} disabled icon="space_dashboard" />
        ))}
      </div>
    </Panel>
  )
}

export const Icons: Story = {
  render: AllIcons,
}

const AllShortcuts = (args: Story['args']) => {
  const [selected, setSelected] = useState(variants)
  return (
    <Panel>
      <h2>Shortcut</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {variants.map((variant) => (
          <Button
            {...args}
            variant={variant}
            icon={'check_box'}
            shortcut={{ children: 'Ctrl + S' }}
            label="Save"
          />
        ))}
      </div>
      <h2>Selected (click to toggle selection)</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {variants.map((variant) => (
          <Button
            {...args}
            variant={variant}
            selected={selected.includes(variant)}
            icon={'check_box'}
            shortcut={{ children: 'Ctrl + S' }}
            label="Save"
            onClick={() =>
              setSelected((selected) =>
                selected.includes(variant)
                  ? selected.filter((v) => v !== variant)
                  : [...selected, variant],
              )
            }
          />
        ))}
      </div>
      <h2>Disabled</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {variants.map((variant) => (
          <Button
            {...args}
            variant={variant}
            disabled
            icon={'check_box'}
            shortcut={{ children: 'Ctrl + S' }}
            label="Save"
          />
        ))}
      </div>
    </Panel>
  )
}

export const Shortcuts: Story = {
  render: AllShortcuts,
}
