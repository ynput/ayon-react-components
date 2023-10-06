import { FC, useMemo, forwardRef, Ref } from 'react'
import { Dropdown, DropdownProps, DropdownRef } from '../Dropdown'
import * as Styled from './VersionSelect.styled'

export interface VersionSelectProps extends Omit<DropdownProps, 'options' | 'value' | 'onChange'> {
  value: string[]
  versions: string[][]
  version?: string[]
  onChange: (value: string[]) => void
}

export const VersionSelect = forwardRef<DropdownRef, VersionSelectProps>(
  ({ value, versions, version, onChange, ...props }, ref) => {
    // we need to find the intersection of all versions
    const intersection = useMemo(
      () =>
        versions.reduce((acc, vs) => {
          return acc.filter((v: string) => vs.includes(v))
        }),
      [versions],
    )

    const allVersions = useMemo(() => {
      const flatVersions = versions.flat()
      const uniqueVersions = [...new Set(flatVersions)]
      return uniqueVersions
    }, [versions])

    // disabled versions (inverse of intersection)
    const disabledVersions = useMemo(
      () => allVersions.filter((v) => !intersection.includes(v)),
      [intersection],
    )

    const options = useMemo(() => {
      if (version) {
        return version.map((v) => ({
          value: v,
          label: v,
        }))
      } else {
        return allVersions.map((v) => ({
          value: v,
          label: v,
        }))
      }
    }, [version, allVersions])

    return (
      <Dropdown
        ref={ref}
        value={value}
        options={options}
        align={'right'}
        itemTemplate={({ value }, isActive, isSelected) => (
          <Styled.Item
            $disabled={!intersection.includes(value)}
            $isSelected={versions.length < 2 && isSelected}
          >{`${value}`}</Styled.Item>
        )}
        onChange={(v) => onChange(v.map((v) => v.toString()))}
        valueStyle={{ minWidth: 100, ...props.valueStyle }}
        listStyle={{ ...props.listStyle }}
        itemStyle={{ ...props.itemStyle }}
        widthExpand
        disableReorder
        disabledValues={disabledVersions}
        {...props}
      />
    )
  },
)
