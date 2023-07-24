import type { Preview } from '@storybook/react'
// import global styles
import '../src/index.scss'
import 'material-symbols/outlined.css'
import AyonTheme from './AyonTheme'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        // color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: AyonTheme,
    },
    backgrounds: {
      default: 'AYON',
      values: [{ name: 'AYON', value: '#2c313a' }],
    },
  },
}

export default preview
