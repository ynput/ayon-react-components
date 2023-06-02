import { FC, useMemo, forwardRef, Ref } from 'react'
import { Dropdown, DropdownProps } from '../Dropdown'
import styled, { css } from 'styled-components'

const StyledItem = styled.div<{ $disabled: boolean }>`
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  white-space: nowrap;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
    `}
`

export interface VersionSelectProps extends Omit<DropdownProps, 'options' | 'value' | 'onChange'> {
  value: string[]
  versions: string[][]
  onChange: (value: string[]) => void
}

const VersionSelect: FC<VersionSelectProps> = forwardRef(
  ({ value, versions, onChange, ...props }, ref: Ref<HTMLDivElement>) => {
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
      return uniqueVersions.sort((a, b) => {
        const aNum = parseInt(a.slice(1), 10)
        const bNum = parseInt(b.slice(1), 10)
        return aNum - bNum
      })
    }, [versions])

    // disabled versions (inverse of intersection)
    const disabledVersions = useMemo(
      () => allVersions.filter((v) => !intersection.includes(v)),
      [intersection],
    )

    return (
      <Dropdown
        ref={ref}
        value={value}
        align={'right'}
        options={allVersions.map((version) => ({
          value: version,
          label: version,
        }))}
        itemTemplate={({ value }) => (
          <StyledItem $disabled={!intersection.includes(value)}>{`${value}`}</StyledItem>
        )}
        onChange={(v) => onChange(v.map((v) => v.toString()))}
        valueStyle={{ minWidth: 100, ...props.valueStyle }}
        listStyle={{ ...props.listStyle }}
        itemStyle={{ translate: '0 30px', ...props.itemStyle }}
        widthExpand
        disableReorder
        disabledValues={disabledVersions}
        {...props}
      />
    )
  },
)

export default VersionSelect
