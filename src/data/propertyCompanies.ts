import type { TaskItem } from './leadActivities'
import type { CompanyAffiliationBadge } from './propertyDetailSidePanel'

export type CompanyDealCard = {
  id: string
  name: string
  amount: string
  date: string
  stage: string
}

export type PropertyCompanyListStatus = 'Active' | 'Inactive' | 'Pending'

export type PropertyCompanySelection = {
  companyId: string
  listStatus: PropertyCompanyListStatus
  /** When set (e.g. pending association), shown in the company header instead of company defaults. */
  affiliationBadges?: CompanyAffiliationBadge[]
  pendingEffectiveDate?: string
  pendingTooltipId?: string
}

export type PropertyCompany = {
  id: string
  name: string
  /** Shown beside the name in the company picker. */
  listStatus?: 'Active' | 'Inactive'
  companyOwner: string
  phone: string
  spStatus: string
  score: string
  affiliations: CompanyAffiliationBadge[]
  questionnaireCompanyName: string
  deals: CompanyDealCard[]
  tasks: TaskItem[]
  billingAddress: {
    contact: string
    address: string
    country: string
    state: string
    city: string
    zipcode: string
  }
}

const defaultAffiliations: CompanyAffiliationBadge[] = [
  { label: 'Headquarters', bg: '#fff4d8', text: '#f6a300' },
  { label: 'Managed', bg: '#e5f6ff', text: '#146dff' },
  { label: 'Owned', bg: '#f4edfd', text: '#9747ff' },
  { label: 'Shared', bg: '#fbeeed', text: '#d9534f' },
  { label: 'Regional Office', bg: '#eff8ef', text: '#2e964b' },
  { label: 'Tenant', bg: '#ffeed4', text: '#ef5c07' },
]

const sevenElevenAffiliations: CompanyAffiliationBadge[] = [
  defaultAffiliations[0],
  defaultAffiliations[1],
  defaultAffiliations[5],
]

const costcoAffiliations: CompanyAffiliationBadge[] = [
  defaultAffiliations[2],
  defaultAffiliations[3],
  defaultAffiliations[4],
]

const defaultCompanyTasks: TaskItem[] = [
  {
    id: 'default-1',
    done: false,
    title: 'Site walkthrough',
    description: 'Review perimeter...',
    dueDate: '01/20/2024',
    createdBy: 'Signal Sales Rep',
    priority: 'Medium',
    type: 'To do',
  },
]

const defaultUsDeal: CompanyDealCard = {
  id: 'default-1',
  name: 'Regional Security Services',
  amount: '$125,000',
  date: '10-01-2023',
  stage: 'Discovery',
}

function usCompany(
  id: string,
  name: string,
  overrides: Partial<Omit<PropertyCompany, 'id' | 'name'>> = {},
): PropertyCompany {
  return {
    id,
    name,
    companyOwner: 'John Doe',
    phone: '719-345-9821',
    spStatus: 'SP - Active',
    score: '75%',
    affiliations: defaultAffiliations,
    questionnaireCompanyName: name,
    deals: [{ ...defaultUsDeal, id: `${id}-deal-1` }],
    tasks: defaultCompanyTasks,
    billingAddress: {
      contact: 'Account Manager',
      address: '100 Main St, Dallas, Texas, 75201',
      country: 'USA',
      state: 'Texas',
      city: 'Dallas',
      zipcode: '75201',
    },
    ...overrides,
  }
}

export const propertyCompanies: PropertyCompany[] = [
  {
    id: 'automation-edge',
    name: '7 Eleven',
    listStatus: 'Active',
    companyOwner: 'John Doe',
    phone: 'N/A',
    spStatus: 'N/A',
    score: 'N/A',
    affiliations: sevenElevenAffiliations,
    questionnaireCompanyName: '7 Eleven',
    tasks: [
      {
        id: '711-1',
        done: false,
        title: '7 Eleven onboarding',
        description: 'Complete store security checklist',
        dueDate: '01/18/2024',
        overdue: true,
        createdBy: 'Signal Sales Rep',
        priority: 'High',
        type: 'To do',
      },
      {
        id: '711-2',
        done: true,
        title: 'Contract review',
        description: 'Armed service agreement',
        dueDate: '01/12/2024',
        createdBy: 'Aleena Javed',
        priority: 'Medium',
        type: 'Email',
      },
    ],
    deals: [
      {
        id: 'ae-1',
        name: 'Dedicated Armed Service',
        amount: '$6,065.03',
        date: '12-02-2023',
        stage: 'Proposal Creation',
      },
      {
        id: 'ae-2',
        name: 'Weekend Patrol Hits',
        amount: '$6,065.03',
        date: '12-02-2023',
        stage: 'Closed Won',
      },
    ],
    billingAddress: {
      contact: 'Aleena Javed',
      address: '456 Elm Ave, Westport Idencia, Kansas City, Kansas, 64030',
      country: 'USA',
      state: 'Nebraska',
      city: 'Bloomfield',
      zipcode: '5400',
    },
  },
  {
    id: 'costco',
    name: 'Costco',
    listStatus: 'Inactive',
    companyOwner: 'Mike Smith',
    phone: '719-345-9821',
    spStatus: 'SP - Active',
    score: '80%',
    affiliations: costcoAffiliations,
    questionnaireCompanyName: 'Costco',
    tasks: [
      {
        id: 'co-task-1',
        done: false,
        title: 'Costco patrol routing',
        description: 'Validate shift coverage map',
        dueDate: '01/19/2024',
        createdBy: 'Mike Smith',
        priority: 'High',
        type: 'Call',
      },
      {
        id: 'co-task-2',
        done: false,
        title: 'Quarterly business review',
        description: 'Prepare Q1 metrics deck',
        dueDate: '01/22/2024',
        createdBy: 'Hubspot',
        priority: 'Low',
        type: 'To do',
      },
      {
        id: 'co-task-3',
        done: true,
        title: 'Renewal follow-up',
        description: 'Patrol contract extension',
        dueDate: '01/10/2024',
        createdBy: 'Jane Cooper',
        priority: 'Medium',
        type: 'Email',
      },
    ],
    deals: [
      {
        id: 'co-1',
        name: 'Costco - Patrol Routing',
        amount: '$414,786',
        date: '08-15-2023',
        stage: 'Proposal Creation',
      },
      {
        id: 'co-2',
        name: 'Mcdonalds Patrols',
        amount: '$236,745',
        date: '09-01-2023',
        stage: 'Terminated',
      },
    ],
    billingAddress: {
      contact: 'Mike Smith',
      address: '344, Orchard Apts, 3808 S. Kansas City, KS, 64030',
      country: 'USA',
      state: 'Kansas',
      city: 'Kansas City',
      zipcode: '64030',
    },
  },
  usCompany('target', 'Target'),
  usCompany('walmart', 'Walmart', {
    companyOwner: 'Trachise Withrow',
    billingAddress: {
      contact: 'Trachise Withrow',
      address: '1324 Leavenworth St, Omaha, Nebraska, 68102',
      country: 'USA',
      state: 'Nebraska',
      city: 'Omaha',
      zipcode: '68102',
    },
  }),
  usCompany('home-depot', 'Home Depot', {
    billingAddress: {
      contact: 'Store Operations',
      address: '2455 Paces Ferry Rd, Atlanta, Georgia, 30339',
      country: 'USA',
      state: 'Georgia',
      city: 'Atlanta',
      zipcode: '30339',
    },
  }),
  usCompany('kroger', 'Kroger', {
    billingAddress: {
      contact: 'Facilities Team',
      address: '1014 Vine St, Cincinnati, Ohio, 45202',
      country: 'USA',
      state: 'Ohio',
      city: 'Cincinnati',
      zipcode: '45202',
    },
  }),
  usCompany('cvs', 'CVS Health', {
    billingAddress: {
      contact: 'Regional Director',
      address: '1 CVS Dr, Woonsocket, Rhode Island, 02895',
      country: 'USA',
      state: 'Rhode Island',
      city: 'Woonsocket',
      zipcode: '02895',
    },
  }),
  usCompany('walgreens', 'Walgreens', {
    billingAddress: {
      contact: 'Property Manager',
      address: '108 Wilmot Rd, Deerfield, Illinois, 60015',
      country: 'USA',
      state: 'Illinois',
      city: 'Deerfield',
      zipcode: '60015',
    },
  }),
  usCompany('amazon', 'Amazon', {
    billingAddress: {
      contact: 'Site Lead',
      address: '410 Terry Ave N, Seattle, Washington, 98109',
      country: 'USA',
      state: 'Washington',
      city: 'Seattle',
      zipcode: '98109',
    },
  }),
  usCompany('mcdonalds', "McDonald's", {
    billingAddress: {
      contact: 'Franchise Owner',
      address: '110 N Carpenter St, Chicago, Illinois, 60607',
      country: 'USA',
      state: 'Illinois',
      city: 'Chicago',
      zipcode: '60607',
    },
  }),
  usCompany('starbucks', 'Starbucks', {
    billingAddress: {
      contact: 'District Manager',
      address: '2401 Utah Ave S, Seattle, Washington, 98134',
      country: 'USA',
      state: 'Washington',
      city: 'Seattle',
      zipcode: '98134',
    },
  }),
]

export const defaultPropertyCompanyId = propertyCompanies[0].id

export function getPropertyCompany(id: string): PropertyCompany {
  return propertyCompanies.find((c) => c.id === id) ?? propertyCompanies[0]
}
