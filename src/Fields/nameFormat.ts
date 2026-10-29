export type NameFormatPreset = 'snake_case' | 'kebab-case' | 'camelCase'

/** How a label becomes a name: a preset or a function */
export type NameFormat = NameFormatPreset | ((label: string) => string)

// Lowercase ascii words of a label, accents removed: "Café Scene 2" → ["cafe", "scene", "2"]
const toWords = (label: string) =>
  label
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

export const nameFormatPresets: Record<NameFormatPreset, (label: string) => string> = {
  snake_case: (label) => toWords(label).join('_'),
  'kebab-case': (label) => toWords(label).join('-'),
  camelCase: (label) =>
    toWords(label)
      .map((word, index) => (index ? word.charAt(0).toUpperCase() + word.slice(1) : word))
      .join(''),
}

export const formatName = (label: string, format: NameFormat = 'snake_case') =>
  typeof format === 'function' ? format(label) : nameFormatPresets[format](label)
