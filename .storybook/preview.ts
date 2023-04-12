import type { Preview } from '@storybook/react'
// import global styles
import '../src/styles/theme.sass'
import '../src/styles/prime.scss'
import '../src/styles/index.scss'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
