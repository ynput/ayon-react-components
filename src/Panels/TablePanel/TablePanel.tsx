import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'
import { PanelStyled } from '../Panel'
import { LoaderShade } from '../../Overlay/LoaderShade'

const ScrollPanelStyled = styled(PanelStyled)`
  padding: 0;
  padding: 12px;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  gap: var(--base-gap-medium);
`

export interface ScrollPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  scrollStyle?: React.CSSProperties
  loading?: boolean
}

export const TablePanel = forwardRef<HTMLDivElement, ScrollPanelProps>(
  ({ loading, ...props }, ref) => (
    <PanelStyled
      {...props}
      style={{
        padding: 0,
        minHeight: 150,
        flexGrow: 1,
        ...(props.style || {}),
      }}
    >
      <div style={{ flexGrow: 1, position: 'relative' }}>
        {loading ? <LoaderShade /> : null}
        <div
          style={{
            position: 'absolute',
            top: 3, // prevent header covering rounded corners of the parent panel
            left: 0,
            right: 0,
            bottom: 0,
            padding: 0,
          }}
        >
          {props.children}
        </div>
      </div>
    </PanelStyled>
  ),
)
