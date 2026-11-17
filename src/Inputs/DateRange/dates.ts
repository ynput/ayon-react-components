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
