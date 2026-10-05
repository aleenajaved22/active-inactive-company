import { propertyCompanies } from './propertyCompanies'
import { companyParents } from './propertySpaces'

/**
 * Option lists and copy shared by the web Create Property drawer and the mobile
 * Create Property screen, so the two cannot drift apart.
 */

export const affiliationOptions = [
  'Headquarters',
  'Regional Office',
  'Managed',
  'Owned',
  'Shared',
  'Tenant',
] as const

export type Affiliation = (typeof affiliationOptions)[number]

/** Affiliations pre-selected on a new property. */
export const defaultAffiliations: Affiliation[] = ['Headquarters', 'Managed']

export const propertySourceOptions = ['Referred', 'Inbound', 'Outbound']

export const associatedFranchiseOptions = ['402 - Central Valencia', '420 - Automation']

export const hubspotStageOptions = ['Discovery', 'Qualified', 'Needs Assessment']

export const assigneeOptions = ['Jeff Zolos', 'Henry Micheal']

export const supervisorOptions = ['Jeff Zolos', 'Henry Micheal', 'Jerome Bell']

export const companyOptions = Object.keys(companyParents)

export const parentCompanyOptions = [
  ...new Set([
    ...Object.values(companyParents),
    ...propertyCompanies.map((item) => item.parentCompany ?? '').filter(Boolean),
  ]),
].sort((a, b) => a.localeCompare(b))

export const CUT_OFF_DATE_HELP =
  'The date until which the current company is at this property, after which it is dissociated'

/** Contact labels a property can be associated against. */
export const contactRoles = [
  { label: 'Decision Maker', bg: '#f4edfd', text: '#9747ff' },
  { label: 'End User', bg: '#e5f6ff', text: '#146dff' },
  { label: 'Billing', bg: '#eff8ef', text: '#2e964b' },
  { label: 'Blocker', bg: '#fef3f2', text: '#d9534f' },
  { label: 'Influencer', bg: '#ffeed4', text: '#ef5c07' },
] as const

export const contactOptions = ['Henry Micheal', 'Jerome Bell']
