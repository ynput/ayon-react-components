import clsx from 'clsx'
import { forwardRef } from 'react'
import styled from 'styled-components'
import { Dropdown, DropdownProps, DropdownRef, DefaultValueTemplate } from '../Dropdown'
import { Icon, IconPropType } from '../../Icon'

const StyledDropdown = styled(Dropdown)`
  &.settings-dropdown {
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

  .dropdown-title {
    flex: 1;
    text-align: left;
  }
`

const ValueChip = styled.span`
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  display: flex;
  padding: 0px 8px;
  justify-content: center;
  align-items: center;
  min-height: unset;
  overflow: hidden;
  border-radius: 9px;
  user-select: none;
`

export interface SettingsDropdownProps extends Omit<DropdownProps, 'label'> {
  settings?: boolean
  title: string
  icon?: IconPropType
}

export const SettingsDropdown = forwardRef<DropdownRef, SettingsDropdownProps>(
  ({ settings = true, title, icon, ...props }, ref) => {
    return (
      <StyledDropdown
        {...props}
        ref={ref}
        valueClassName="value"
        className={clsx('settings-dropdown', { settings })}
        valueTemplate={(value, selected, isOpen) => (
          <DefaultValueTemplate
            {...{ value, isOpen, selected }}
            className="test"
            childrenCustom={
              <StyledInner>
                {icon && <Icon icon={icon} className="dropdown-icon" />}
                <span className="dropdown-title">{title}</span>
                <ValueChip>
                  {props.options.find((option) => option.value === value[0])?.label}
                </ValueChip>
              </StyledInner>
            }
          ></DefaultValueTemplate>
        )}
      />
    )
  },
)
