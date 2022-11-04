import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { resolve } from 'node:path'
import EsLint from 'vite-plugin-linter'
const { EsLinter, linterPlugin } = EsLint

export default defineConfig((configEnv) => ({
  plugins: [
    react(),
    linterPlugin({
      include: ['./src}/**/*.{js,jsx}'],
      linters: [new EsLinter({ configEnv })],
    }),
  ],

  build: {
    lib: {
      entry: resolve('src', 'components/index.js'),
      name: 'AyonReact',
      formats: ['es', 'umd'],
      fileName: (format) => `ayon-react.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'styled-components'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
        }
      }
    },
  },


}))
