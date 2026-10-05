/**
 * Agreed user-facing copy for the Active / Inactive Company at Property flow.
 *
 * Every label, description, placeholder, tooltip and error message below is the
 * wording signed off with the client, so the web modals, the mobile screens and
 * the email template all read from here rather than restating it. One rule runs
 * through all of it: the word "association" never appears in a user-facing
 * label — the field is "Company at Property - Till Date".
 */

export const COMPANY_AT_PROPERTY = {
  effectiveDateLabel: 'Company at Property - Effective Date',
  tillDateLabel: 'Company at Property - Till Date',
} as const

/** On the modals the effective date explains what happens when it arrives. */
export const EFFECTIVE_DATE_DESCRIPTION =
  'On the Company at Property - Effective Date, this property is associated with the selected company and becomes active.'

/** Create Property shows the till-date rule in a tooltip rather than inline. */
export const TILL_DATE_TOOLTIP =
  'On the Company at Property - Till Date, the selected company is dissociated from this property'

/** Add / Switch / Make active state the same rule inline, under the label. */
export const TILL_DATE_DESCRIPTION =
  'On the Company at Property - Till Date, the selected company is dissociated from this property. A company with active contracts cannot be dissociated; close or complete them first'

/** Edit Company sits the rule under the field as helper text. */
export const TILL_DATE_HELPER =
  'On this date, the company is dissociated from this property. Leave empty for no till date.'

export const OCCUPANCY_LABEL = 'Property Occupancy'

/** Two sentences: what the fields are for, then the one-company-per-space rule. */
export const OCCUPANCY_DESCRIPTION =
  'The floor, suite, unit or apartment for this company. Cannot occupy the same space as another company.'

export const OCCUPANCY_PLACEHOLDERS = {
  floor: '5 or 1,3-5',
  suiteUnit: '210B or 210B,212B',
} as const

/** The accepted formats differ between the two fields, so each has its own wording. */
export const OCCUPANCY_TOOLTIPS = {
  floor:
    'Enter a single floor, a list separated by commas, or a range using a dash. For example 5, 1,2,5 or 1,3-5.',
  suiteUnit: 'Enter a single value or a list separated by commas. For example 210B or 210A,210B.',
} as const

export const SUITE_UNIT_LABEL = 'Suite / Unit / Apartment'

export const HUBSPOT_STAGE_LABEL = 'Choose a Hubspot Stage to map'

/** Right panel banner while a company is pending — it can be prepared, not published. */
export const PENDING_BANNER =
  'This company becomes active on the effective date. Contracts cannot be published until then.'

/** Right panel banner once a company has left the property. */
export const INACTIVE_BANNER = 'This company has left the property, so its data is read-only'

/** Discarding a scheduled switch: nothing has taken effect, so it is cancelled rather than reverted. */
export const DISCARD_SWITCH = {
  action: 'Discard Switch',
  heading: 'Discard Switch?',
  body: 'This will cancel the pending switch. The company will be made inactive on this property, and any data added will be retained.',
  confirm: 'Discard',
  cancel: 'Cancel',
} as const

/**
 * Contract proposal page notice. Informational only — it is shown before the
 * dates are set so the user does not reach the create-time error unaware.
 */
export function contractProposalNotice(tillDate: string): string {
  return `This company’s association with this property ends on ${tillDate}. Contracts cannot extend beyond this date, and any contract still active will be terminated.`
}

/**
 * The agreed validation messages. Validation runs on save rather than as the
 * user types, and each message is shown inline against its field.
 */
export const ERRORS = {
  activeContractConflict:
    'This conflicts with one or more active contracts. Select a later date, or close or complete the contracts first.',
  severalCompaniesOccupied:
    'Some of the spaces entered are already occupied. Remove or change them to continue.',
  clearedOccupancyWhileShared:
    'Each active company on this property needs its own occupancy. Add a floor, suite, unit or apartment to continue.',
  invalidFormat: 'Enter a valid format. See the tooltip for accepted formats.',
  duplicateValues: 'Remove duplicate values to continue.',
  tillDateBeforeEffective: 'Select a Till Date after the Effective Date.',
  contractBeyondTillDate: 'Contract dates cannot go beyond the Company at Property - Till Date.',
  renewalWithinAYear:
    'Renewal is not available. This company leaves the property in less than a year.',
  affiliationRequired: 'Property Affiliation is required.',
} as const

/** "4 and 6", or "4, 6 and 9" — the way a person would read the list aloud. */
export function naturalList(values: string[]): string {
  if (values.length === 0) return ''
  if (values.length === 1) return values[0]
  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`
}

/** Occupancy field names pluralise with the count: "Floor 5", but "Floors 4 and 6". */
export function occupancyFieldName(field: string, count: number): string {
  return count > 1 ? `${field}s` : field
}

/** "Floor 5 is already occupied by: Costco." / "Floors 4 and 6 are already occupied by: Costco." */
export function occupancyTakenError(field: string, values: string[], companyName: string): string {
  const name = occupancyFieldName(field, values.length)
  const verb = values.length > 1 ? 'are' : 'is'
  return `${name} ${naturalList(values)} ${verb} already occupied by: ${companyName}.`
}

/** The existing company has no occupancy, so a second company cannot be told apart from it. */
export function addOccupancyFirstError(companyName: string): string {
  return `Edit ${companyName} to add its occupancy before adding another company to this property.`
}
