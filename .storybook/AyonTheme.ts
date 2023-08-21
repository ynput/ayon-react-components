import { create } from '@storybook/theming/create'
import logo from './public/logo.svg'

export default create({
  base: 'dark',
  // Typography
  //   fontBase: '"Open Sans", sans-serif',
  //   fontCode: 'monospace',

  brandTitle: 'AYON Storybook',
  brandUrl: 'https://ynput.io/ayon',
  brandImage: logo,
  brandTarget: '_self',

  // UI
  appBg: '#252A31',
  appContentBg: '#252A31',
  //   appBorderColor: '#585C6D',
  //   appBorderRadius: 4,

  //   colorPrimary: '#3A10E5',
  //   colorSecondary: '#585C6D',

  // Text colors
  textColor: '#F4F5F5',
  //   textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#F4F5F5',
  //   barSelectedColor: '#ff0000',
  barBg: '#16191D',

  // Form colors
  inputBg: '#1C2026',
  buttonBg: '#424A57',
  booleanBg: '#424A57',
  // booleanSelectedBg: '#004B70',
  inputBorder: '#41474D',
  inputTextColor: '#F4F5F5',
  inputBorderRadius: 4,
})
