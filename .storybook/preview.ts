import type { Preview } from '@storybook/react'
// import global styles
import 'primereact/resources/primereact.min.css'
import '../src/index.sass'
import AyonTheme from './AyonTheme'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: AyonTheme,
    },
  },
}

export default preview
