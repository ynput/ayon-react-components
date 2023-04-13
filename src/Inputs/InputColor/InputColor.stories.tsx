import type { Meta, StoryObj } from '@storybook/react'
import { InputColor } from './InputColor'

const meta: Meta<typeof InputColor> = {
  component: InputColor,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof InputColor>

// HEX
export const HEX: Story = {
  args: {
    value: '#14d25d',
    format: 'hex',
  },
}

// HEX with ALpha
export const HEXA: Story = {
  args: {
    value: '#14d25dBB',
    alpha: true,
    format: 'hex',
  },
}

// unit8
export const Uint8: Story = {
  args: {
    value: [255, 145, 56],
    format: 'uint8',
  },
}

// unit8 with alpha
export const Uint8A: Story = {
  args: {
    value: [255, 145, 56, 0.8],
    alpha: true,
    format: 'uint8',
  },
}

// Float
export const Float: Story = {
  args: {
    value: [0.5, 0.3, 0.9],
    format: 'float',
  },
}

// unit16
export const Uint16: Story = {
  args: {
    value: [65535, 24580, 14456],
    format: 'uint16',
  },
}
