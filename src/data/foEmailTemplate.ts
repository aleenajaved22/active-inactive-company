/**
 * Franchise Owner email: sent when a company is due to leave a property but
 * still has active contracts running past that date.
 *
 * Signal and Filtergo each carry their own branding; everything else is shared,
 * so the copy lives here once and the template reads from it.
 */

export type EmailTenant = 'Signal' | 'Filtergo'

export const emailTenants: EmailTenant[] = ['Signal', 'Filtergo']

export const tenantBranding: Record<
  EmailTenant,
  { name: string; accent: string; accentSoft: string; address: string; social: string[] }
> = {
  Signal: {
    name: 'Signal',
    accent: '#146dff',
    accentSoft: '#e5f6ff',
    address: '1200 Market St, San Francisco, CA 94102',
    social: ['LinkedIn', 'X', 'Facebook'],
  },
  Filtergo: {
    name: 'Filtergo',
    accent: '#2e964b',
    accentSoft: '#eff8ef',
    address: '45 Park Ave, New York, NY 10016',
    social: ['LinkedIn', 'X', 'Instagram'],
  },
}

export type FoEmailContract = {
  dealName: string
  /** Whether the contract was set up with an End Date or a Renewal Date. */
  type: 'End Date' | 'Renewal Date'
  date: string
}

export type FoEmailData = {
  foName: string
  companyName: string
  propertyAddress: string
  tillDate: string
  contracts: FoEmailContract[]
}

export function foEmailSubject({ companyName, propertyAddress, tillDate }: FoEmailData): string {
  return `${companyName} leaves ${propertyAddress} on ${tillDate} — active contracts need attention`
}

export function foEmailHeadline({ companyName, tillDate }: FoEmailData): string {
  return `${companyName} leaves this property on ${tillDate}`
}

/** The body, one paragraph per line, with the system values already filled in. */
export function foEmailBody({ foName, companyName, tillDate }: FoEmailData): string[] {
  return [
    `Hi ${foName},`,
    `${companyName} is scheduled to be dissociated from this property on ${tillDate}. There are active contracts at this property that run past that date.`,
    `Close or complete these contracts, or use an addendum to adjust their dates, before ${tillDate}.`,
    `On ${tillDate}, any contract still active will be terminated and the company will be made inactive on this property.`,
  ]
}

/**
 * Sending rules, shown alongside the template so the behaviour is reviewable
 * next to the design rather than only in the user story.
 */
export const foEmailSendingRules = [
  'Goes to the Franchise Owner only.',
  'Sent daily, starting two months before the Company at Property - Till Date.',
  'Only sent where at least one active contract runs past the Till Date.',
  'Stops if the Till Date is cleared, or if no active contracts remain.',
  'If the Till Date changes, the schedule recalculates against the new date.',
  'One email per property + company, listing all the active contracts on it.',
]

/** Prototype sample, matching the property and company used elsewhere. */
export const sampleFoEmail: FoEmailData = {
  foName: 'Jeff Zolos',
  companyName: '7 Eleven',
  propertyAddress: '1200 Market St, San Francisco, CA',
  tillDate: '12/31/2026',
  contracts: [
    { dealName: 'Dedicated Armed Service', type: 'End Date', date: '03/14/2027' },
    { dealName: 'Store Perimeter Patrols', type: 'Renewal Date', date: '06/01/2027' },
    { dealName: 'Weekend Patrol Hits', type: 'End Date', date: '01/20/2027' },
  ],
}
