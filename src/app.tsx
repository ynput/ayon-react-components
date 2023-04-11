import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

import { Button, Toolbar } from '/src/components'

import PrimeReactDemo from '/src/primereact'
import InputDemo from '/src/input'
import UploadDemo from '/src/upload'
import { useState, useMemo } from 'react'

const App = () => {
  const [page, setPage] = useState('form')

  const Page = useMemo(() => {
    if (page === 'form') {
      return InputDemo
    } else if (page === 'primereact') {
      return PrimeReactDemo
    } else if (page === 'upload') {
      return UploadDemo
    }
  }, [page])

  return (
    <main
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--base-gap-large)',
        padding: 'var(--base-gap-large)',
      }}
    >
      <Toolbar>
        <Button
          label="Form"
          icon="folder"
          tooltip="And a tooltip"
          onClick={() => setPage('form')}
        />
        <Button
          label="Primereact"
          icon="folder"
          tooltip="And a tooltip"
          onClick={() => setPage('primereact')}
        />
        <Button
          label="Upload"
          icon="folder"
          tooltip="And a tooltip"
          onClick={() => setPage('upload')}
        />
      </Toolbar>

      <Page />
    </main>
  )
}

export default App
