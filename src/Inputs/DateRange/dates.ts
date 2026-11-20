// Days as `YYYY-MM-DD` strings, read and written in local time: a day picked is that day wherever
// the user is (Date's own ISO string is UTC and can move it to the day before or after).

const pad = (n: number) => String(n).padStart(2, '0')

/** a Date → its local day, `YYYY-MM-DD` */
export const toDateString = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** `YYYY-MM-DD` → midnight of that day, local time; null when empty or not a day */
export const fromDateString = (value?: string | null) => {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return isNaN(date.getTime()) ? null : date
}

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

/** `YYYY-MM-DD` → "17 Nov 2026"; empty when it is not a day */
export const formatDay = (value?: string | null) => {
  const date = fromDateString(value)
  if (!date) return ''
  const month = MONTHS[date.getMonth()]
  return `${date.getDate()} ${month[0].toUpperCase()}${month.slice(1, 3)} ${date.getFullYear()}`
}

/** the day of a year, month (1–12) and date, `YYYY-MM-DD`; null when there is no such day */
const toDay = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day)
    return null
  return toDateString(date)
}

/** a typed year: two digits are this century's, a missing one is this year */
const toYear = (text: string | undefined, today: Date) => {
  if (!text) return today.getFullYear()
  const year = Number(text)
  return text.length === 2 ? 2000 + year : year
}

/**
 * A date typed day first, as `YYYY-MM-DD`; null when it is not one. Reads `17 Nov 2026`,
 * `17 November 26`, `17/11/2026`, `17-11-26`, `17.11.2026`, `2026-11-17`, and without a year
 * (`17 Nov`, `17/11`) this year's day.
 */
export const parseTypedDate = (text: string, today = new Date()): string | null => {
  const typed = text.trim().replace(/\s+/g, ' ').toLowerCase()
  const iso = typed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (iso) return toDay(Number(iso[1]), Number(iso[2]), Number(iso[3]))
  const numeric = typed.match(/^(\d{1,2})([/.-])(\d{1,2})(?:\2(\d{2}|\d{4}))?$/)
  if (numeric) return toDay(toYear(numeric[4], today), Number(numeric[3]), Number(numeric[1]))
  const named = typed.match(/^(\d{1,2}) ([a-z]{3,})\.?(?: (\d{2}|\d{4}))?$/)
  if (named) {
    const month = MONTHS.findIndex((name) => name.startsWith(named[2]))
    if (month < 0) return null
    return toDay(toYear(named[3], today), month + 1, Number(named[1]))
  }
  return null
}
