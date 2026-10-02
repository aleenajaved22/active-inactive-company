import type { PropertyAffiliation } from '../components/switchCompanyTypes'
import type { PropertyCompanyListStatus } from './propertyCompanies'
import type { SpaceType } from './propertySpaces'

/** One company on one space of a property. Each space has at most one Active and one Pending company. */
export type SpaceAssociation = {
  id: string
  spaceType: SpaceType
  spaceNumber: string
  /** Floor the suite/unit sits on; shown before it in the label (e.g. "Floor 2, Suite 210"). */
  floor?: string
  companyId: string
  status: PropertyCompanyListStatus
  effectiveDate: string
  endDate: string
  affiliations: PropertyAffiliation[]
}

const currentSpaceAssociations: SpaceAssociation[] = [
  {
    id: 'floor-5-7-eleven',
    spaceType: 'Floor',
    spaceNumber: '5',
    companyId: 'automation-edge',
    status: 'Active',
    effectiveDate: '01/01/2024',
    endDate: '12/31/2026',
    affiliations: ['Headquarters', 'Managed', 'Tenant'],
  },
  {
    id: 'suite-210-target',
    spaceType: 'Suite',
    spaceNumber: '210',
    floor: '2',
    companyId: 'target',
    status: 'Active',
    effectiveDate: '06/01/2025',
    endDate: '',
    affiliations: ['Managed'],
  },
  {
    id: 'unit-12-walmart',
    spaceType: 'Unit',
    spaceNumber: '12',
    floor: '1',
    companyId: 'walmart',
    status: 'Active',
    effectiveDate: '03/15/2024',
    endDate: '03/14/2027',
    affiliations: ['Tenant'],
  },
  {
    // A unit with no floor, e.g. a standalone building.
    id: 'unit-8-kroger',
    spaceType: 'Unit',
    spaceNumber: '8',
    companyId: 'kroger',
    status: 'Active',
    effectiveDate: '02/01/2025',
    endDate: '',
    affiliations: ['Tenant'],
  },
  {
    // A suite with no floor, e.g. a single-storey building.
    id: 'suite-305-cvs',
    spaceType: 'Suite',
    spaceNumber: '305',
    companyId: 'cvs',
    status: 'Active',
    effectiveDate: '09/01/2025',
    endDate: '',
    affiliations: ['Tenant'],
  },
  {
    // Starbucks has signed for the vacant Suite 104 and moves in on the effective date.
    id: 'suite-104-starbucks',
    spaceType: 'Suite',
    spaceNumber: '104',
    floor: '1',
    companyId: 'starbucks',
    status: 'Pending',
    effectiveDate: '11/01/2026',
    endDate: '10/31/2029',
    affiliations: ['Tenant', 'Regional Office'],
  },
  {
    id: 'floor-5-costco',
    spaceType: 'Floor',
    spaceNumber: '5',
    companyId: 'costco',
    status: 'Inactive',
    effectiveDate: '01/01/2021',
    endDate: '12/31/2023',
    affiliations: ['Owned', 'Shared', 'Regional Office'],
  },
  {
    id: 'floor-3-home-depot',
    spaceType: 'Floor',
    spaceNumber: '3',
    companyId: 'home-depot',
    status: 'Inactive',
    effectiveDate: '01/01/2020',
    endDate: '12/31/2022',
    affiliations: ['Owned'],
  },
]

const pastCompanyIds = ['cvs', 'walgreens', 'amazon', 'mcdonalds', 'starbucks', 'kroger', 'target', 'walmart']
const pastSpaces: Pick<SpaceAssociation, 'spaceType' | 'spaceNumber' | 'floor'>[] = [
  { spaceType: 'Floor', spaceNumber: '5' },
  { spaceType: 'Suite', spaceNumber: '210', floor: '2' },
  { spaceType: 'Unit', spaceNumber: '12', floor: '1' },
  { spaceType: 'Floor', spaceNumber: '3' },
  { spaceType: 'Suite', spaceNumber: '104', floor: '1' },
]

/** Prototype history: enough past companies to exercise the inactive list's pagination. */
const pastSpaceAssociations: SpaceAssociation[] = Array.from({ length: 22 }, (_, index) => {
  const endYear = 2022 - Math.floor(index / 5)
  const month = String(((index * 5) % 12) + 1).padStart(2, '0')
  return {
    id: `past-${index}`,
    ...pastSpaces[index % pastSpaces.length],
    companyId: pastCompanyIds[index % pastCompanyIds.length],
    status: 'Inactive',
    effectiveDate: `${month}/01/${endYear - 3}`,
    endDate: `${month}/28/${endYear}`,
    affiliations: ['Tenant'],
  }
})

export const initialSpaceAssociations: SpaceAssociation[] = [...currentSpaceAssociations, ...pastSpaceAssociations]

export const spaceKeyOf = (association: Pick<SpaceAssociation, 'spaceType' | 'spaceNumber'>) =>
  `${association.spaceType}|${association.spaceNumber}`

export const spaceLabelOf = (association: Pick<SpaceAssociation, 'spaceType' | 'spaceNumber' | 'floor'>) =>
  association.floor && association.spaceType !== 'Floor'
    ? `Floor ${association.floor}, ${association.spaceType} ${association.spaceNumber}`
    : `${association.spaceType} ${association.spaceNumber}`

export function parseMMDDYYYY(value: string): Date | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim())
  if (!match) return null
  const [month, day, year] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return date
}
