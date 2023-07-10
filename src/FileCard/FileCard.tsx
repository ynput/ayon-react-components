import { FC } from 'react'
import styled, { css } from 'styled-components'
import { Icon, IconType } from '../Icon'
import { Button } from '../Button'
import { Spacer } from '../Layout/Spacer'
import getShimmerStyles from '../helpers/getShimmerStyles'

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

const StyledFileCard = styled.div<{ $isFetching: boolean }>`
  background-color: var(--color-grey-01);
  display: flex;
  border-radius: 4px;
  padding: 2px;
  align-items: center;
  cursor: pointer;
  gap: 4px;
  position: relative;

  :hover {
    background-color: var(--color-grey-02);
  }

  .title {
    margin-left: 4px;
  }

  .length {
    opacity: 0.5;
    white-space: nowrap;
  }

  .size {
    opacity: 0.5;
    margin: 0 4px;
    white-space: nowrap;
  }

  .icon {
    font-size: 24px;
  }

  ${({ $isFetching }) =>
    $isFetching &&
    css`
      user-select: none;
      pointer-events: none;

      & > * {
        opacity: 0.5;
      }

      ${getShimmerStyles(undefined, undefined, {
        // random number between 0.2 and 1.5
        delay: Math.random() * (1.5 - 0.2) + 0.2,
        speed: 1,
      })}
    `}
`

const StyledButton = styled(Button)`
  background-color: unset;
  padding: 2px;
  min-height: unset;
`

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
  ...props
}) => {
  const typeIcon =
    (Object.entries(fileIcons).find(([key]) => type.includes(key))?.[1] as IconType) ??
    'insert_drive_file'

  return (
    <StyledFileCard $isFetching={isFetching} {...props}>
      <Icon icon={typeIcon} />
      <span className="title">{title}</span>
      {length > 1 && <span className="length">{`(${length} files)`}</span>}
      <Spacer />
      <span className="size">{getFileSizeString(size)}</span>
      <StyledButton
        icon="vertical_split"
        onClick={onSplit}
        style={{
          visibility: splitDisabled ? 'hidden' : 'visible',
          userSelect: splitDisabled ? 'none' : 'auto',
          pointerEvents: splitDisabled ? 'none' : 'auto',
        }}
        disabled={splitDisabled || isFetching}
      />

      <StyledButton icon="close" onClick={onRemove} disabled={isFetching} />
    </StyledFileCard>
  )
}
