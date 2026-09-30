/** Formats a stored MM-DD-YYYY or MM/DD/YYYY date as MM/DD/YY for display, e.g. 02/22/26. */
export function formatShortDate(value: string): string {
  const match = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(value.trim())
  if (!match) return value
  const [, month, day, year] = match
  return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year.slice(2)}`
}
