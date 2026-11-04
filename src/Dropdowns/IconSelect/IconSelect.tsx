import { forwardRef, useMemo, useState } from 'react'
import * as Styled from './IconSelect.styled'
import { DefaultValueTemplate, Dropdown, DropdownProps, DropdownRef } from '../Dropdown'
import { Icon, IconType, iconSet } from '../../Icon'

// what each icon looks like and is used for, so searching "trash" finds delete
// the file is large, so it is only loaded the first time a dropdown opens (then cached)
type KeywordsByIcon = Record<string, string[]>
let keywordsPromise: Promise<KeywordsByIcon> | undefined
const loadKeywords = () => {
  keywordsPromise ??= import('../../Icon/icon-keywords.json').then((m) => m.default)
  // if the import fails, forget it so the next open retries; name search still works meanwhile
  return keywordsPromise.catch((): KeywordsByIcon => {
    keywordsPromise = undefined
    return {}
  })
}
// search the icon name and its keywords
const SEARCH_FIELDS = ['value', 'label', 'keywords']

export interface IconTemplateProps {
  value: IconSelectProps['value']
  isActive?: boolean
  isSelected?: boolean
}

const IconTemplate = ({ value, isSelected }: IconTemplateProps) => {
  return (
    <Styled.Icon $isActive={isSelected}>
      {value?.map((icon) => (
        <Icon key={icon} icon={icon as IconType} />
      ))}
      {value && value.length < 2 && <span>{value}</span>}
    </Styled.Icon>
  )
}

export interface IconSelectProps
  extends Omit<DropdownProps, 'options' | 'valueTemplate' | 'itemTemplate' | 'search' | 'ref'> {
  value: DropdownProps['value']
  onChange?: DropdownProps['onChange']
  featured?: IconType[]
  featuredOnly?: boolean
  multiSelect?: DropdownProps['multiSelect']
}

export const IconSelect = forwardRef<DropdownRef, IconSelectProps>(
  (
    {
      value,
      onChange,
      featured = [],
      multiSelect,
      featuredOnly,
      widthExpand = false,
      sortBySelected = true,
      onOpen,
      ...props
    },
    ref,
  ) => {
    const [keywordsByIcon, setKeywordsByIcon] = useState<KeywordsByIcon>({})

    // Dropdown calls this on every open; keywords load once, then the caller's onOpen still runs
    const handleOpen = () => {
      loadKeywords().then(setKeywordsByIcon)
      onOpen?.()
    }

    const dropdownOptions = useMemo(() => {
      const dropdownOptions = []

      // either uses user set icons or all icons from iconSet
      const iconKeys = featuredOnly ? featured : Object.keys(iconSet)
      // map icon keys to dropdown options (label and value)
      for (const key of iconKeys) {
        dropdownOptions.push({
          label: key,
          value: key as string,
          keywords: keywordsByIcon[key] ?? [],
        })
      }
      return dropdownOptions
    }, [keywordsByIcon])

    const featuredStrings = featured.map((icon) => icon as string)

    // show featured icons first
    dropdownOptions.sort((a, b) => {
      if (featuredStrings.includes(a.value) && !featuredStrings.includes(b.value)) return -1
      if (!featuredStrings.includes(a.value) && featuredStrings.includes(b.value)) return 1
      return 0
    })

    return (
      <Dropdown
        value={value}
        multiSelect={multiSelect}
        valueTemplate={(v, s, o) => (
          <DefaultValueTemplate value={(o ? s : v) || []} isOpen={o}>
            <IconTemplate value={(o ? s : v) || []} />
          </DefaultValueTemplate>
        )}
        options={dropdownOptions}
        itemTemplate={({ value }, isActive, isSelected) => (
          <IconTemplate value={[value]} isActive={isActive} isSelected={isSelected} />
        )}
        onChange={onChange}
        search
        searchFields={SEARCH_FIELDS}
        valueStyle={{ width: 150, ...props.valueStyle }}
        style={{ maxWidth: 150, ...props.style }}
        ref={ref}
        onOpen={handleOpen}
        {...props}
        maxOptionsShown={Math.max(props.maxOptionsShown || 25, featured.length)}
        minSelected={1}
        widthExpand={widthExpand}
        sortBySelected={sortBySelected}
      />
    )
  },
)
