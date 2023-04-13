// .storybook/manager.js

import { addons } from '@storybook/manager-api'
import { themes } from '@storybook/theming'
import AyonTheme from './AyonTheme'

addons.setConfig({
  theme: AyonTheme,
})
