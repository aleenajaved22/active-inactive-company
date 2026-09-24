export const propertyAffiliationOptions = [
  'Managed',
  'Owned',
  'Regional Office',
  'Shared',
  'Tenant',
  'Headquarters',
] as const

export type PropertyAffiliation = (typeof propertyAffiliationOptions)[number]

export type SwitchCompanyFormValues = {
  companyId: string
  effectiveDate: string
  cutOffDate: string
  affiliations: PropertyAffiliation[]
}

export type SwitchCompanySubmitPayload = SwitchCompanyFormValues & {
  mode: 'switch' | 'edit'
  associationId?: string
}

export type CompanyAssociation = SwitchCompanyFormValues & {
  id: string
}
