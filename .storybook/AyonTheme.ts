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
  appBg: '#2c313a',
  appContentBg: '#2c313a',
  //   appBorderColor: '#585C6D',
  //   appBorderRadius: 4,

  //   colorPrimary: '#3A10E5',
  //   colorSecondary: '#585C6D',

  // Text colors
  //   textColor: '#10162F',
  //   textInverseColor: '#ffffff',

  // Toolbar default and active colors
  //   barTextColor: '#9E9E9E',
  //   barSelectedColor: '#ff0000',
  barBg: '#21252b',

  // Form colors
  inputBg: '#21252b',
  buttonBg: '#434a56',
  booleanBg: '#434a56',
  booleanSelectedBg: '#21252b',
  //   inputBorder: '#10162F',
  //   inputTextColor: '#10162F',
  //   inputBorderRadius: 2,
})
