export const spaceTypes = ['Suite', 'Unit', 'Floor', 'Flat', 'Apartment'] as const

export type SpaceType = (typeof spaceTypes)[number]

/** Types offered by the joined Suite / Unit field (Floor and Apartment are now standalone fields). */
export const suiteUnitTypes = ['Suite', 'Unit'] as const

type ExistingSpace = {
  address: string
  spaceType: SpaceType
  spaceNumber: string
  company: string
}

/** Prototype stand-in for spaces already created, until a backend check exists. */
const existingSpaces: ExistingSpace[] = [
  { address: '1200 Market St, San Francisco, CA', spaceType: 'Floor', spaceNumber: '5', company: 'Costco Wholesale' },
  { address: '1200 Market St, San Francisco, CA', spaceType: 'Suite', spaceNumber: '210', company: '7 Eleven' },
  { address: '45 Park Ave, New York, NY', spaceType: 'Unit', spaceNumber: '12', company: 'Costco Wholesale' },
]

export const companyParents: Record<string, string> = {
  'Costco Wholesale': 'Costco Group',
  '7 Eleven': 'Seven & i Holdings',
}

const normalizeText = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase()

// Addresses are compared without punctuation so "1200 Market St." matches "1200 Market St".
const normalizeAddress = (value: string) => normalizeText(value.replace(/[.,#]/g, ' '))

function normalizeSpaceNumber(spaceType: SpaceType, value: string) {
  const normalized = normalizeText(value)
  // Floors are ordinal, so "05" and "5" are the same floor.
  if (spaceType === 'Floor' && /^\d+$/.test(normalized)) return String(Number(normalized))
  return normalized
}

/** Returns the company already holding this space at the address, if any. */
export function findSpaceConflict(address: string, spaceType: SpaceType | '', spaceNumber: string) {
  if (!address.trim() || !spaceType || !spaceNumber.trim()) return null
  const target = normalizeAddress(address)
  const number = normalizeSpaceNumber(spaceType, spaceNumber)
  const match = existingSpaces.find(
    (space) =>
      normalizeAddress(space.address) === target &&
      space.spaceType === spaceType &&
      normalizeSpaceNumber(space.spaceType, space.spaceNumber) === number,
  )
  return match?.company ?? null
}
