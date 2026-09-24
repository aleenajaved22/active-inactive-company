export type AffiliationVariant =
  | 'corporate'
  | 'owned-remote'
  | 'tenant'
  | 'occupied-primary'
  | 'managed'

export type PropertyRow = {
  id: string
  name: string
  sync?: boolean
  starred?: boolean
  affiliation: AffiliationVariant
  company: string
  parentCompany: string
  dealsCount: number
  country: string
  state: string
  address: string
  metaLine: string
}

export function formatPropertyTitle(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const affiliationStyles: Record<
  AffiliationVariant,
  { bg: string; text: string; label: string }
> = {
  corporate: { bg: 'bg-[#eff8ef]', text: 'text-[#2e964b]', label: 'Coprorate' },
  'owned-remote': { bg: 'bg-[#fff4d8]', text: 'text-[#f6a300]', label: 'Owned-Remote' },
  tenant: { bg: 'bg-[#fef0c7]', text: 'text-[#f4780b]', label: 'Tenant' },
  'occupied-primary': { bg: 'bg-[#f4edfd]', text: 'text-[#9747ff]', label: 'Occupied-Primary' },
  managed: { bg: 'bg-[#e5f6ff]', text: 'text-[#146dff]', label: 'Managed' },
}

export const propertyRows: PropertyRow[] = [
  {
    id: '#2300',
    name: 'Costco wholesale - Boys Town',
    sync: true,
    starred: true,
    affiliation: 'corporate',
    company: 'Costco wholesale',
    parentCompany: 'Costco',
    dealsCount: 1,
    country: 'United States',
    state: 'Nebraska',
    address: '456 Elm Ave, Omaha, Nebraska, 68010',
    metaLine: '9830 • Strategic • Existing',
  },
  {
    id: '#4500',
    name: 'Mcdonalds - Y Block',
    affiliation: 'owned-remote',
    company: 'Mcdonalds',
    parentCompany: 'Mcdonalds',
    dealsCount: 4,
    country: 'United States',
    state: 'California',
    address: '1200 Market St, San Francisco, California, 94102',
    metaLine: '4412 • Growth • New',
  },
  {
    id: '#0239',
    name: 'H&M Store - X Sector',
    sync: true,
    affiliation: 'tenant',
    company: 'H&M Store',
    parentCompany: 'H&M',
    dealsCount: 3,
    country: 'United States',
    state: 'Texas',
    address: '800 Commerce St, Dallas, Texas, 75202',
    metaLine: '7721 • Retail • Tenant',
  },
  {
    id: '#2300',
    name: 'Charleston - Maple 987',
    affiliation: 'occupied-primary',
    company: "Charleston's Restaurant",
    parentCompany: 'Charleston',
    dealsCount: 2,
    country: 'United States',
    state: 'Florida',
    address: '210 Ocean Dr, Miami, Florida, 33139',
    metaLine: '5590 • Hospitality • Existing',
  },
  {
    id: '#2941',
    name: 'Milwaukee Tools - 432 Aspen',
    affiliation: 'occupied-primary',
    company: 'Milwaukee Tools',
    parentCompany: 'Milwaukee Tools',
    dealsCount: 2,
    country: 'United States',
    state: 'Wisconsin',
    address: '432 Aspen Rd, Milwaukee, Wisconsin, 53202',
    metaLine: '2941 • Industrial • Existing',
  },
  {
    id: '#2300',
    name: 'Brian Mart - DHA',
    sync: true,
    affiliation: 'corporate',
    company: 'Brian Mart',
    parentCompany: 'Brian Mart',
    dealsCount: 3,
    country: 'United States',
    state: 'Virginia',
    address: '15 Main St, Arlington, Virginia, 22201',
    metaLine: '8834 • Local • Existing',
  },
  {
    id: '#4500',
    name: 'Park - Downtown',
    affiliation: 'managed',
    company: 'Park',
    parentCompany: 'Central Park',
    dealsCount: 2,
    country: 'United States',
    state: 'New York',
    address: '1 Central Park W, New York, New York, 10023',
    metaLine: '1020 • Public • Managed',
  },
  {
    id: '#0239',
    name: 'Zorinski Lake - Garden Down',
    affiliation: 'corporate',
    company: 'Zorinski Lake',
    parentCompany: 'Zorinski',
    dealsCount: 3,
    country: 'United States',
    state: 'Minnesota',
    address: '88 Lake Shore Dr, Minneapolis, Minnesota, 55401',
    metaLine: '6612 • Recreation • Existing',
  },
]
