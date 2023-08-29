import { HTMLAttributes, forwardRef } from 'react'
import { PanelStyled } from '../Panel'

export interface ScrollPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  scrollStyle?: React.CSSProperties
  loading?: boolean
  direction?: 'column' | 'row'
}

export const TablePanel = forwardRef<HTMLDivElement, ScrollPanelProps>(
  ({ loading, direction = 'column', ...props }, ref) => (
    <PanelStyled
      {...props}
      $direction={direction}
      style={{
        padding: 0,
        minHeight: 150,
        flexGrow: 1,
        ...(props.style || {}),
      }}
    >
      <div style={{ flexGrow: 1, position: 'relative' }}>
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
