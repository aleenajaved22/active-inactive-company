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
  companies: string[]
  parentCompany: string
  dealsCount: number
  country: string
  state: string
  address: string
  industryVertical: string
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
  'owned-remote': { bg: 'bg-[#fff4d8]', text: 'text-[#b54708]', label: 'Owned-Remote' },
  tenant: { bg: 'bg-[#fef0c7]', text: 'text-[#f4780b]', label: 'Tenant' },
  'occupied-primary': { bg: 'bg-[#f4edfd]', text: 'text-[#9747ff]', label: 'Occupied-Primary' },
  managed: { bg: 'bg-[#e5f6ff]', text: 'text-[#146dff]', label: 'Managed' },
}

export const propertyRows: PropertyRow[] = [
  {
    id: '#2300',
    name: 'Elm Avenue Plaza',
    sync: true,
    starred: true,
    affiliation: 'corporate',
    company: 'Costco wholesale',
    companies: ['Costco wholesale', 'Kirkland Signature', 'Costco Travel'],
    parentCompany: 'Costco',
    dealsCount: 1,
    country: 'United States',
    state: 'Nebraska',
    address: '456 Elm Ave, Omaha, Nebraska, 68010',
    industryVertical: 'Warehouse',
  },
  {
    id: '#4500',
    name: '1200 Market Tower',
    affiliation: 'owned-remote',
    company: 'Mcdonalds',
    companies: ['Mcdonalds', 'McCafe'],
    parentCompany: 'Mcdonalds',
    dealsCount: 4,
    country: 'United States',
    state: 'California',
    address: '1200 Market St, San Francisco, California, 94102',
    industryVertical: 'Restaurants',
  },
  {
    id: '#0239',
    name: 'Commerce Street Center',
    sync: true,
    affiliation: 'tenant',
    company: 'H&M Store',
    companies: ['H&M Store', 'COS', 'Weekday', 'Monki', 'Arket'],
    parentCompany: 'H&M',
    dealsCount: 3,
    country: 'United States',
    state: 'Texas',
    address: '800 Commerce St, Dallas, Texas, 75202',
    industryVertical: 'Retail',
  },
  {
    id: '#2300',
    name: 'Ocean Plaza',
    affiliation: 'occupied-primary',
    company: "Charleston's Restaurant",
    companies: ["Charleston's Restaurant", 'Charleston Catering'],
    parentCompany: 'Charleston',
    dealsCount: 2,
    country: 'United States',
    state: 'Florida',
    address: '210 Ocean Dr, Miami, Florida, 33139',
    industryVertical: 'Hospitality',
  },
  {
    id: '#2941',
    name: 'Aspen Road Commons',
    affiliation: 'occupied-primary',
    company: 'Milwaukee Tools',
    companies: ['Milwaukee Tools', 'Empire Level', 'Ridgid'],
    parentCompany: 'Milwaukee Tools',
    dealsCount: 2,
    country: 'United States',
    state: 'Wisconsin',
    address: '432 Aspen Rd, Milwaukee, Wisconsin, 53202',
    industryVertical: 'Manufacturing',
  },
  {
    id: '#2300',
    name: 'Main Street Square',
    sync: true,
    affiliation: 'corporate',
    company: 'Brian Mart',
    companies: ['Brian Mart', 'Brian Express', 'Brian Fresh'],
    parentCompany: 'Brian Mart',
    dealsCount: 3,
    country: 'United States',
    state: 'Virginia',
    address: '15 Main St, Arlington, Virginia, 22201',
    industryVertical: 'Retail',
  },
  {
    id: '#4500',
    name: 'Park West Tower',
    affiliation: 'managed',
    company: 'Park',
    companies: ['Park', 'Central Park Conservancy', 'NYC Parks', 'Green Thumb'],
    parentCompany: 'Central Park',
    dealsCount: 2,
    country: 'United States',
    state: 'New York',
    address: '1 Central Park W, New York, New York, 10023',
    industryVertical: 'Parks & Recreation',
  },
  {
    id: '#0239',
    name: 'Lakeshore Center',
    affiliation: 'corporate',
    company: 'Zorinski Lake',
    companies: ['Zorinski Lake', 'Zorinski Marina'],
    parentCompany: 'Zorinski',
    dealsCount: 3,
    country: 'United States',
    state: 'Minnesota',
    address: '88 Lake Shore Dr, Minneapolis, Minnesota, 55401',
    industryVertical: 'Parks & Recreation',
  },
  {
    id: '#3102',
    name: 'Harbor Point Plaza',
    affiliation: 'managed',
    company: 'Sunrise Dental',
    companies: ['Sunrise Dental', 'Pacific Coffee Co', 'Harbor Fitness'],
    parentCompany: 'Harbor Group',
    dealsCount: 3,
    country: 'United States',
    state: 'California',
    address: '77 Harbor Blvd, San Diego, California, 92101',
    industryVertical: 'Retail',
  },
  {
    id: '#3377',
    name: 'Riverside Commons',
    sync: true,
    affiliation: 'tenant',
    company: 'Lone Star Bank',
    companies: ['Lone Star Bank', 'Riverside Cafe'],
    parentCompany: 'Lone Star',
    dealsCount: 2,
    country: 'United States',
    state: 'Texas',
    address: '350 River Rd, Austin, Texas, 78701',
    industryVertical: 'Hospitality',
  },
  {
    id: '#3418',
    name: 'Union Square Building',
    starred: true,
    affiliation: 'corporate',
    company: 'Beacon Legal',
    companies: ['Beacon Legal', 'Union Pharmacy', 'Bay Insurance', 'Copley Tech'],
    parentCompany: 'Beacon',
    dealsCount: 5,
    country: 'United States',
    state: 'Massachusetts',
    address: '29 Union Sq, Boston, Massachusetts, 02108',
    industryVertical: 'Retail',
  },
  {
    id: '#3560',
    name: 'Foothill Center',
    affiliation: 'occupied-primary',
    company: 'Summit Outfitters',
    companies: ['Summit Outfitters', 'Peak Physio'],
    parentCompany: 'Summit',
    dealsCount: 1,
    country: 'United States',
    state: 'Colorado',
    address: '1900 Foothill Dr, Denver, Colorado, 80202',
    industryVertical: 'Retail',
  },
  {
    id: '#3694',
    name: 'Magnolia Court',
    sync: true,
    affiliation: 'owned-remote',
    company: 'Peach State Realty',
    companies: ['Peach State Realty', 'Magnolia Bakery'],
    parentCompany: 'Peach State',
    dealsCount: 2,
    country: 'United States',
    state: 'Georgia',
    address: '640 Magnolia St, Atlanta, Georgia, 30303',
    industryVertical: 'Hospitality',
  },
  {
    id: '#3721',
    name: 'Cascade Tower',
    affiliation: 'corporate',
    company: 'Cascade Credit Union',
    companies: ['Cascade Credit Union', 'Rainier Dental', 'Evergreen Books'],
    parentCompany: 'Cascade',
    dealsCount: 4,
    country: 'United States',
    state: 'Washington',
    address: '1010 Pine St, Seattle, Washington, 98101',
    industryVertical: 'Retail',
  },
  {
    id: '#3855',
    name: 'Prairie Gateway',
    starred: true,
    affiliation: 'managed',
    company: 'Gateway Auto',
    companies: ['Gateway Auto', 'Prairie Foods'],
    parentCompany: 'Gateway',
    dealsCount: 2,
    country: 'United States',
    state: 'Missouri',
    address: '4 Gateway Blvd, Kansas City, Missouri, 64106',
    industryVertical: 'Warehouse',
  },
]
