import { ElementRef, forwardRef } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { SortingDropdown, SortingDropdownProps } from '../SortingDropdown/SortingDropdown'
import { Icon, IconPropType } from '../../Icon'

const StyledDropdown = styled(SortingDropdown)`
  &.settings-sorting-dropdown {
    width: 100%;
    button {
      background-color: unset;
      &:hover {
        background-color: var(--md-sys-color-surface-container-hover);
      }
    }
    .template-value {
      border: none;
      padding: 0 4px;
      /* dropdown icon color */
      .control {
        color: var(--md-sys-color-outline);
      }
    }
  }
`

const StyledInner = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
  overflow: hidden;
  align-items: center;

  .dropdown-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    text-align: left;
  }
`

export interface SettingsSortingDropdownProps
  extends Omit<SortingDropdownProps, 'renderValueContent' | 'sortCardProps' | 'title'> {
  title?: string
  icon?: IconPropType
  hideSort?: boolean
  disableSort?: boolean
}

export const SettingsSortingDropdown = forwardRef<
  ElementRef<typeof SortingDropdown>,
  SettingsSortingDropdownProps
>(({ title = 'Sort by', icon, hideSort, disableSort, className, ...props }, ref) => {
  const renderValueContent: SortingDropdownProps['renderValueContent'] = ({ title, cards }) => (
    <StyledInner>
      {icon && <Icon icon={icon} className="dropdown-icon" />}
      <span className="dropdown-title">{title}</span>
      {cards}
    </StyledInner>
  )

  return (
    <StyledDropdown
      {...props}
      ref={ref}
      title={title}
      className={clsx('settings-sorting-dropdown', className)}
      sortCardProps={{ hideSort, disableSort }}
      renderValueContent={renderValueContent}
    />
  )
})
