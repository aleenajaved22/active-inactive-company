/**
 * Franchise Owner email: sent when a company is due to leave a property but
 * still has active contracts running past that date.
 *
 * Signal and Filtergo each carry their own branding; everything else is shared,
 * so the copy lives here once and the template reads from it.
 */

export type EmailTenant = 'Signal' | 'Filtergo'

export const emailTenants: EmailTenant[] = ['Signal', 'Filtergo']

/**
 * What differs between the two tenants. The structure of the email is shared;
 * only the logo, the colours and the contact address change.
 *
 * Both are taken from each tenant's own email design. Signal's button is the
 * app's primary blue and its footer the deeper Basic Blue.
 */
export const tenantBranding: Record<
  EmailTenant,
  {
    name: string
    /** The tint behind the whole email. */
    pageBg: string
    /** The button. */
    accent: string
    /** The footer band, which is a different shade from the button for Signal. */
    footer: string
    contact: string
  }
> = {
  Signal: { name: 'Signal', pageBg: '#f3f5f8', accent: '#146dff', footer: '#004fe3', contact: 'ask@signal.com' },
  Filtergo: { name: 'Filtergo', pageBg: '#ecf4ef', accent: '#2da652', footer: '#2da652', contact: 'ask@filtergo.com' },
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

/** A run of body text; `bold` marks the values a design may emphasise. */
export type BodySegment = string | { bold: string }

/** The body, one paragraph per entry, with the system values filled in. */
export function foEmailBodyRich({ foName, companyName, tillDate }: FoEmailData): BodySegment[][] {
  return [
    [`Hi ${foName},`],
    [
      { bold: companyName },
      ' is scheduled to be dissociated from this property on ',
      { bold: tillDate },
      '. There are active contracts at this property that run past that date.',
    ],
    ['Close or complete these contracts, or use an addendum to adjust their dates, before ', { bold: tillDate }, '.'],
    ['On ', { bold: tillDate }, ', any contract still active will be terminated and the company will be made inactive on this property.'],
  ]
}

/** The same body as plain strings. */
export function foEmailBody(data: FoEmailData): string[] {
  return foEmailBodyRich(data).map((paragraph) =>
    paragraph.map((segment) => (typeof segment === 'string' ? segment : segment.bold)).join(''),
  )
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
