import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import EsLint from 'vite-plugin-linter'
const { EsLinter, linterPlugin } = EsLint

const pkg = JSON.parse(readFileSync(resolve('package.json'), 'utf-8'))
// Dependencies are left for the app to bundle, so it shares one copy with its own imports.
// Their CSS (e.g. react-datepicker.css) is still bundled into style.css. ESM only packages
// (lodash-es) stay in devDependencies and are bundled, so the UMD build still works with require().
const externalPackages = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })
const isExternal = (id: string) =>
  !id.endsWith('.css') && externalPackages.some((name) => id === name || id.startsWith(`${name}/`))

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
      external: isExternal,
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'styled-components': 'styled',
          clsx: 'clsx',
          'match-sorter': 'matchSorter',
          overlayscrollbars: 'OverlayScrollbarsGlobal',
          'overlayscrollbars-react': 'OverlayScrollbarsReact',
          'react-datepicker': 'DatePicker',
        },
      },
    },
  },
}))
