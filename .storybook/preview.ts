import type { Preview } from '@storybook/react'
// import global styles
import '../src/primereact/theme.sass'
import '../src/primereact/index.scss'
import '../src/index.scss'

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
