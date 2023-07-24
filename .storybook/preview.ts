import type { Preview } from '@storybook/react'
// import icons
import 'material-symbols/outlined.css'
// import fonts
import '../src/fonts/NunitoSans_10pt-Regular.ttf'
import '../src/fonts/NunitoSans_10pt-Italic.ttf'
import '../src/fonts/NunitoSans_10pt-Bold.ttf'
// import global styles
import '../src/index.scss'

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
