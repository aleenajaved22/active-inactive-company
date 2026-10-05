export const spaceTypes = ['Suite', 'Unit', 'Floor', 'Flat', 'Apartment'] as const

export type SpaceType = (typeof spaceTypes)[number]

/** Types offered by the joined Suite / Unit / Apartment field (Floor is a standalone field). */
export const suiteUnitTypes = ['Suite', 'Unit', 'Apartment'] as const

export const companyParents: Record<string, string> = {
  'Costco Wholesale': 'Costco Group',
  '7 Eleven': 'Seven & i Holdings',
}
