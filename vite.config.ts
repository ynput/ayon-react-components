import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

import { resolve } from 'node:path'
import EsLint from 'vite-plugin-linter'
const { EsLinter, linterPlugin } = EsLint

export default defineConfig((configEnv) => ({
  plugins: [
    react(),
    linterPlugin({
      include: ['./src}/**/*.{ts,tsx}'],
      linters: [new EsLinter({ configEnv })],
    }),
    dts(),
  ],

  build: {
    lib: {
      entry: resolve('src', 'index.tsx'),
      name: 'AyonReactComponents',
      formats: ['es', 'umd'],
      fileName: (format) => `ayon-react-components.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'styled-components'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
        },
      },
    },
  },
}))
