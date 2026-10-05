/** Formats a stored MM-DD-YYYY or MM/DD/YYYY date as MM/DD/YY for display, e.g. 02/22/26. */
export function formatShortDate(value: string): string {
  const match = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(value.trim())
  if (!match) return value
  const [, month, day, year] = match
  return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year.slice(2)}`
}

/** Today in the MM/DD/YYYY form the date inputs use, for fields that pre-fill. */
export function todayMMDDYYYY(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${month}/${day}/${now.getFullYear()}`
}
