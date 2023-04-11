import { useState, useEffect } from 'react'
import { FileUpload, Panel, Section, Divider } from '/src/components'

const UploadDemo = () => {
  const [files, setFiles] = useState([])

  useEffect(() => {
    console.log(files)
  }, [files])

  return (
    <Section style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Panel style={{ maxWidth: 600 }}>
        <h1>File upload</h1>
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileUpload files={files} setFiles={setFiles} mode="multiple" />
        </div>
      </Panel>
    </Section>
  )
}

export default UploadDemo
