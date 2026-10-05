/**
 * The only values an Industry Vertical can take. A company's vertical is picked
 * from this list wherever it is entered, and the property header shows one of
 * these — never free text — so the list is defined once and shared.
 */
export const industryVerticalOptions = [
  'Commercial',
  'Distribution',
  'Industrial',
  'Manufacturing',
  'Residential',
] as const

export type IndustryVertical = (typeof industryVerticalOptions)[number]
