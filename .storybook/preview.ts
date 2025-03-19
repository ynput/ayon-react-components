import type { Preview } from '@storybook/react'
// import icons
import 'material-symbols/outlined.css'
// import fonts
// import global styles
import '../src/index.scss'
// import theme
import '../src/theme/theme.scss'
// loading shimmer
import './loadingShimmer.scss'

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
      // values: [{ name: 'AYON', value: '#252A31' }],
    },
  },
}

export default preview
