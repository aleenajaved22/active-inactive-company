export type DealBadgeVariant =
  | 'proposalCreation'
  | 'terminated'
  | 'closedLost'
  | 'closedWon'
  | 'negotiation'
  | 'apartments'
  | 'dealNew'
  | 'dealExisting'
  | 'dealOld'
  | 'dealLost'

export const dealBadgeStyles: Record<
  DealBadgeVariant,
  { bg: string; text: string; label?: string }
> = {
  proposalCreation: { bg: 'bg-[#e5f6ff]', text: 'text-[#146dff]' },
  terminated: { bg: 'bg-[#fef0c7]', text: 'text-[#f4780b]' },
  closedLost: { bg: 'bg-[#fbeeed]', text: 'text-[#b32318]' },
  closedWon: { bg: 'bg-[#eff8ef]', text: 'text-[#2e964b]' },
  negotiation: { bg: 'bg-[#f4edfd]', text: 'text-[#9747ff]' },
  apartments: { bg: 'bg-[#f4edfd]', text: 'text-[#9747ff]' },
  dealNew: { bg: 'bg-[#fef0c7]', text: 'text-[#dc6803]' },
  dealExisting: { bg: 'bg-[#f4edfd]', text: 'text-[#9747ff]' },
  dealOld: { bg: 'bg-[#e5f6ff]', text: 'text-[#146dff]' },
  dealLost: { bg: 'bg-[#fbeeed]', text: 'text-[#b32318]' },
}

export type DealListingRow = {
  id: string
  name: string
  sync?: boolean
  alert?: 'error' | 'warn'
  amount: string
  owner: string
  ownerAvatar?: 'photo' | 'initials'
  ownerInitials?: string
  stage: { variant: DealBadgeVariant; label: string }
  marketVertical: { variant: DealBadgeVariant; label: string }
  dealType: { variant: DealBadgeVariant; label: string }
  franchise: string
}

export const dealsListingRows: DealListingRow[] = [
  {
    id: '#2300',
    name: 'Costco - Patrol Routing',
    amount: '$414,786',
    owner: 'Trachise Withrow',
    ownerAvatar: 'photo',
    stage: { variant: 'proposalCreation', label: 'Proposal Creation' },
    marketVertical: { variant: 'apartments', label: 'Apartments' },
    dealType: { variant: 'dealNew', label: 'New' },
    franchise: 'Franchise name',
  },
  {
    id: '#4500',
    name: 'Mcdonalds Patrols',
    sync: true,
    amount: '$236,745',
    owner: 'Matt Quinn',
    ownerAvatar: 'photo',
    stage: { variant: 'terminated', label: 'Terminated' },
    marketVertical: { variant: 'apartments', label: 'Apartments' },
    dealType: { variant: 'dealExisting', label: 'Existing' },
    franchise: 'Franchise name',
  },
  {
    id: '#0239',
    name: 'H&M Store - dedicated',
    alert: 'error',
    amount: '$326,574',
    owner: 'Jodi Wimer',
    ownerAvatar: 'photo',
    stage: { variant: 'closedLost', label: 'Closed lost' },
    marketVertical: { variant: 'apartments', label: 'Apartments' },
    dealType: { variant: 'dealOld', label: 'Old' },
    franchise: 'Franchise name',
  },
  {
    id: '#2300',
    name: 'Charleston Rover Patrols',
    alert: 'warn',
    amount: '$348,756',
    owner: 'Darin Smith',
    ownerAvatar: 'photo',
    stage: { variant: 'closedWon', label: 'Closed won' },
    marketVertical: { variant: 'apartments', label: 'Apartments' },
    dealType: { variant: 'dealOld', label: 'Old' },
    franchise: 'Franchise name',
  },
  {
    id: '#2300',
    name: 'Milwaukee Tools Dedicated',
    amount: '$837,642',
    owner: 'Don Crowell',
    ownerAvatar: 'photo',
    stage: { variant: 'negotiation', label: 'Negotiation' },
    marketVertical: { variant: 'apartments', label: 'Apartments' },
    dealType: { variant: 'dealExisting', label: 'Existing' },
    franchise: 'Franchise name',
  },
  {
    id: '#1378',
    name: 'Walmart Dedicated x2',
    amount: '$465,786',
    owner: 'Derrick Dancy',
    ownerAvatar: 'photo',
    stage: { variant: 'proposalCreation', label: 'Proposal Creation' },
    marketVertical: { variant: 'apartments', label: 'Apartments' },
    dealType: { variant: 'dealNew', label: 'New' },
    franchise: 'Franchise name',
  },
  {
    id: '#4520',
    name: 'Park Lane Dedicated',
    amount: '$483,765',
    owner: 'Zach Alsterberg',
    ownerAvatar: 'photo',
    stage: { variant: 'negotiation', label: 'Negotiation' },
    marketVertical: { variant: 'apartments', label: 'Apartments' },
    dealType: { variant: 'dealLost', label: 'Lost' },
    franchise: 'Franchise name',
  },
  {
    id: '#2941',
    name: 'Zorinski Lake Armed Officer',
    amount: '$987,643',
    owner: 'Jeff Chovan',
    ownerAvatar: 'initials',
    ownerInitials: 'OR',
    stage: { variant: 'closedWon', label: 'Closed won' },
    marketVertical: { variant: 'apartments', label: 'Apartments' },
    dealType: { variant: 'dealOld', label: 'Old' },
    franchise: 'Franchise name',
  },
]
