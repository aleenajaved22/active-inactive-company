import type { SwitchSpaceOption } from '../components/switchCompanyTypes'
import { formatShortDate } from './dateFormat'
import { getPropertyCompany } from './propertyCompanies'
import { parseMMDDYYYY, spaceKeyOf, spaceLabelOf, type SpaceAssociation } from './propertySpaceAssociations'

/**
 * Rules shared by the web Switch Company modal and the mobile Switch Company
 * screen. Both read their option lists and error copy from here so the two
 * cannot drift apart.
 */

/** Builds one switch target per space, with its current and pending company. */
export function buildSpaceOptions(associations: SpaceAssociation[]): SwitchSpaceOption[] {
  const options = new Map<string, SwitchSpaceOption>()
  for (const association of associations) {
    const key = spaceKeyOf(association)
    const option = options.get(key) ?? {
      key,
      label: spaceLabelOf(association),
      floor: association.floor,
    }
    const companyName = getPropertyCompany(association.companyId).name
    if (association.status === 'Active') {
      option.currentCompanyId = association.companyId
      option.currentCompanyName = companyName
      option.currentContractEndDate = association.endDate || undefined
    } else if (association.status === 'Pending') {
      option.pendingAssociationId = association.id
      option.pendingCompanyName = companyName
    }
    options.set(key, option)
  }
  return [...options.values()].sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { numeric: true }),
  )
}

export type SpaceInput = {
  floor: string
  suiteUnitType: string
  suiteUnitNumber: string
}

/** When adding, the space comes from free-form fields; build a key from whatever is filled. */
export function deriveSpaceKey(value: SpaceInput): string {
  if (value.suiteUnitType && value.suiteUnitNumber.trim()) {
    return `${value.suiteUnitType}|${value.suiteUnitNumber.trim()}`
  }
  if (value.floor.trim()) return `Floor|${value.floor.trim()}`
  return ''
}

/** Human label for a free-form space, used in the confirmation copy. */
export function describeSpaceInput(value: SpaceInput): string {
  return (
    [
      value.floor.trim() && `Floor ${value.floor.trim()}`,
      value.suiteUnitType &&
        value.suiteUnitNumber.trim() &&
        `${value.suiteUnitType} ${value.suiteUnitNumber.trim()}`,
    ]
      .filter(Boolean)
      .join(', ') || 'the selected property occupancy'
  )
}

export type AssociationValidationInput = {
  spaces: SwitchSpaceOption[]
  /** The space the form is pinned to, when it is locked. */
  spaceKey: string
  /** The space the submission will actually use. */
  effectiveSpaceKey: string
  spaceLocked: boolean
  isEditMode: boolean
  isMakeActive: boolean
  companyId: string
  companyName?: string
  effectiveDate: string
  cutOffDate: string
}

export type AssociationErrors = {
  spaceError: string | null
  companyError: string | null
  effectiveDateError: string | null
  endDateError: string | null
  /** Set when the chosen space is already taken, so the field can be marked. */
  occupied: boolean
  hasErrors: boolean
}

export function validateAssociationForm({
  spaces,
  spaceKey,
  effectiveSpaceKey,
  spaceLocked,
  isEditMode,
  isMakeActive,
  companyId,
  companyName,
  effectiveDate,
  cutOffDate,
}: AssociationValidationInput): AssociationErrors {
  const selectedSpace = spaces.find((space) => space.key === spaceKey)

  // Making a company active on a space someone already holds is an error; name that company.
  const occupiedSpace = isMakeActive
    ? spaces.find(
        (space) =>
          space.key === effectiveSpaceKey && (space.currentCompanyName || space.pendingCompanyName),
      )
    : undefined
  const occupiedError = occupiedSpace
    ? occupiedSpace.currentCompanyName
      ? `${occupiedSpace.label} already has an active company: ${occupiedSpace.currentCompanyName}.`
      : `${occupiedSpace.label} already has a pending switch to ${occupiedSpace.pendingCompanyName}.`
    : null

  const effective = parseMMDDYYYY(effectiveDate)
  const end = cutOffDate.trim() ? parseMMDDYYYY(cutOffDate) : null
  const contractEnd = selectedSpace?.currentContractEndDate
    ? parseMMDDYYYY(selectedSpace.currentContractEndDate)
    : null

  // Space is optional. Only the locked switch flow warns about an existing pending switch.
  const spaceError =
    occupiedError ??
    (spaceLocked && selectedSpace && !isEditMode && selectedSpace.pendingCompanyName
      ? `${selectedSpace.label} already has a pending switch to ${selectedSpace.pendingCompanyName}. Edit that switch instead.`
      : null)

  const companyError = !companyId
    ? 'Choose a company.'
    : selectedSpace && companyId === selectedSpace.currentCompanyId
      ? `${companyName} is already the active company for ${selectedSpace.label}.`
      : null

  const effectiveDateError = !effectiveDate.trim()
    ? 'Enter the effective date.'
    : !effective
      ? 'Enter a valid date (MM/DD/YYYY).'
      : contractEnd && effective <= contractEnd
        ? `Effective Date must be after ${selectedSpace?.currentCompanyName}'s contract ends on ${formatShortDate(selectedSpace?.currentContractEndDate ?? '')}.`
        : null

  const endDateError =
    cutOffDate.trim() && !end
      ? 'Enter a valid date (MM/DD/YYYY).'
      : end && effective && end <= effective
        ? 'End Date must be after the Effective Date.'
        : null

  return {
    spaceError,
    companyError,
    effectiveDateError,
    endDateError,
    occupied: Boolean(occupiedSpace),
    hasErrors: Boolean(spaceError || companyError || effectiveDateError || endDateError),
  }
}

/** End-date rule for editing an active company's association. */
export function validateCompanyEndDate({
  endDate,
  effectiveDate,
  nextCompany,
}: {
  endDate: string
  effectiveDate: string
  /** The pending company queued on the same space, when there is one. */
  nextCompany?: { name: string; effectiveDate: string }
}): string | null {
  const end = endDate.trim() ? parseMMDDYYYY(endDate) : null
  const start = parseMMDDYYYY(effectiveDate)
  const nextStart = nextCompany ? parseMMDDYYYY(nextCompany.effectiveDate) : null
  if (endDate.trim() && !end) return 'Enter a valid date (MM/DD/YYYY).'
  if (end && start && end <= start) {
    return `End Date must be after the Effective Date (${formatShortDate(effectiveDate)}).`
  }
  if (nextCompany && nextStart && (!end || end >= nextStart)) {
    return `End Date must be before ${nextCompany.name} starts on ${formatShortDate(nextCompany.effectiveDate)}.`
  }
  return null
}

export const marketVerticalOptions = [
  'Retail',
  'Food & Beverage',
  'Healthcare',
  'Technology',
  'Real Estate',
  'Other',
] as const

export const partnershipStatusOptions = ['Active', 'Prospective', 'Inactive', 'None'] as const
