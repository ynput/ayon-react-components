// .storybook/manager.js

import { addons } from '@storybook/manager-api'
import AyonTheme from './AyonTheme'

addons.setConfig({
  theme: AyonTheme,
})
