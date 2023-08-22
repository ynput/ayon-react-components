import { FC } from 'react'
import { Icon, IconType } from '../Icon'
import { Spacer } from '../Layout/Spacer'
import * as Styled from './FileCard.styled'

const getFileSizeString = (size: number) => {
  // get file size in kb, mb, gb
  const kb = size / 1024
  const mb = kb / 1024
  const gb = mb / 1024

  if (gb > 1) {
    return `${gb.toFixed(1)} GB`
  }

  if (mb > 1) {
    return `${mb.toFixed(1)} MB`
  }

  if (kb > 1) {
    return `${kb.toFixed(0)} KB`
  }

  return `${size} B`
}

const fileIcons: {
  [key: string]: IconType
} = {
  // special cases
  doc: 'description',
  zip: 'folder_zip',
  json: 'code_blocks',
  javascript: 'code_blocks',
  html: 'code_blocks',
  css: 'code_blocks',
  pdf: 'picture_as_pdf',
  // default
  image: 'image',
  video: 'videocam',
  application: 'business_center',
  audio: 'audio_file',
  text: 'text_snippet',
  sequence: 'filter_none',
  font: 'font_download',
  model: '3d_rotation',
}

export interface FileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  type: string
  onRemove: () => void
  onSplit: () => void
  size: number
  length: number
  splitDisabled: boolean
  isFetching?: boolean
  readOnly?: boolean
  disabled?: boolean
  message?: string
  preview?: string | null
  index?: number
}

export const FileCard: FC<FileCardProps> = ({
  title,
  type,
  onRemove,
  onSplit,
  size,
  length,
  splitDisabled,
  isFetching = false,
  readOnly,
  disabled,
  message,
  preview,
  index,
  ...props
}) => {
  const typeIcon =
    (Object.entries(fileIcons).find(([key]) => type.includes(key))?.[1] as IconType) ??
    'insert_drive_file'

  return (
    <Styled.FileCard $isFetching={isFetching} {...props} $message={message} $first={index === 0}>
      {preview ? <img src={preview} /> : <Icon icon={typeIcon} />}
      <span className="title">{title}</span>
      {length > 1 && <span className="length">{`(${length} files)`}</span>}
      <Spacer />
      <span className="size">{getFileSizeString(size)}</span>
      <Styled.Icon
        icon="vertical_split"
        onClick={onSplit}
        style={{
          visibility: splitDisabled ? 'hidden' : 'visible',
          userSelect: splitDisabled ? 'none' : 'auto',
          pointerEvents: splitDisabled ? 'none' : 'auto',
        }}
        $error={!!message}
        disabled={splitDisabled || isFetching || disabled}
        variant="text"
      />
      {!readOnly && (
        <Styled.Icon
          icon="close"
          variant="text"
          onClick={onRemove}
          disabled={isFetching || disabled}
        />
      )}
      {readOnly && (
        <Icon
          icon={!message ? 'check_circle' : 'error'}
          style={{
            color: !message ? 'white' : 'var(--md-custom-color-warning)',
          }}
        />
      )}
    </Styled.FileCard>
  )
}
