import type { CompanyAffiliationBadge } from '../data/propertyDetailSidePanel'

export const propertyAffiliationOptions = [
  'Managed',
  'Owned',
  'Regional Office',
  'Shared',
  'Tenant',
  'Headquarters',
] as const

export type PropertyAffiliation = (typeof propertyAffiliationOptions)[number]

const affiliationBadgeStyles: Record<PropertyAffiliation, { bg: string; text: string }> = {
  Headquarters: { bg: '#fff4d8', text: '#b54708' },
  Managed: { bg: '#e5f6ff', text: '#146dff' },
  Owned: { bg: '#f4edfd', text: '#9747ff' },
  Shared: { bg: '#fbeeed', text: '#d9534f' },
  'Regional Office': { bg: '#eff8ef', text: '#2e964b' },
  Tenant: { bg: '#ffeed4', text: '#ef5c07' },
}

export function affiliationsToBadges(affiliations: PropertyAffiliation[]): CompanyAffiliationBadge[] {
  return affiliations.map((label) => ({ label, ...affiliationBadgeStyles[label] }))
}

export type SwitchCompanyFormValues = {
  spaceKey: string
  companyId: string
  effectiveDate: string
  cutOffDate: string
  affiliations: PropertyAffiliation[]
}

export type SwitchCompanySubmitPayload = SwitchCompanyFormValues & {
  mode: 'switch' | 'edit'
  associationId?: string
}

/** A space on the property that a company switch can target. */
export type SwitchSpaceOption = {
  key: string
  label: string
  /** Floor the suite/unit sits on, when known. */
  floor?: string
  currentCompanyId?: string
  currentCompanyName?: string
  /** Current company's association end date; a new company can only start after it. */
  currentContractEndDate?: string
  pendingAssociationId?: string
  pendingCompanyName?: string
}
