import { formatPropertyTitle, propertyRows } from './properties'

export type MobilePropertyRow = {
  /** Index into `propertyRows` so mobile and web stay on the same records. */
  index: number
  id: string
  title: string
  amount: string
  address: string
  /** A property can carry several companies — the web table's Companies column. */
  companies: string[]
  requiresSignature?: boolean
  followUp?: boolean
}

/** Mobile-only card state layered on top of the shared property records. */
const cardState: { amount: string; requiresSignature?: boolean; followUp?: boolean }[] = [
  { amount: '$10,000', followUp: true },
  { amount: '$10,000', requiresSignature: true, followUp: true },
  { amount: '$24,500', followUp: true },
  { amount: '$8,200' },
  { amount: '$16,750', requiresSignature: true },
  { amount: '$12,300', followUp: true },
  { amount: '$5,900' },
  { amount: '$31,400', followUp: true },
]

export const mobilePropertyRows: MobilePropertyRow[] = propertyRows.map((row, index) => ({
  index,
  id: row.id,
  title: formatPropertyTitle(row.name),
  address: row.address,
  companies: row.companies.map(formatPropertyTitle),
  ...cardState[index % cardState.length],
}))
