import type { SwitchSpaceOption } from '../components/switchCompanyTypes'
import { ERRORS } from './companyAtPropertyCopy'
import { formatShortDate } from './dateFormat'
import { getPropertyCompany } from './propertyCompanies'
import {
  occupancyRequiredError,
  parseFloorEntry,
  parseSuiteEntry,
  validateOccupancy,
  type OccupancyFieldsValue,
  type OccupancyUnit,
  type OccupantSpaces,
} from './propertyOccupancy'
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

/**
 * The spaces each company holds on the property, used to check a new or edited
 * occupancy against everyone else. Only the space itself is claimed: two
 * companies can sit on the same floor in different suites, so the floor a suite
 * happens to be on is not exclusive.
 */
export function buildOccupants(
  associations: SpaceAssociation[],
  statuses: SpaceAssociation['status'][] = ['Active', 'Pending'],
): OccupantSpaces[] {
  const byCompany = new Map<string, OccupantSpaces>()
  for (const association of associations) {
    if (!statuses.includes(association.status)) continue
    const entry = byCompany.get(association.companyId) ?? {
      companyId: association.companyId,
      companyName: getPropertyCompany(association.companyId).name,
      units: [] as OccupancyUnit[],
    }
    if (association.spaceNumber) {
      // A company can hold several floors or suites, and the entry is stored as
      // it was written ("4,6"), so it is expanded with the same parser the
      // fields use — otherwise a multi-value occupancy would match nothing.
      const isFloor = association.spaceType === 'Floor'
      const parsed = isFloor
        ? parseFloorEntry(association.spaceNumber)
        : parseSuiteEntry(association.spaceNumber)
      const field = isFloor ? 'Floor' : association.spaceType
      for (const value of parsed.values) entry.units.push({ field, value })
    }
    byCompany.set(association.companyId, entry)
  }
  return [...byCompany.values()]
}

/** An existing company's space, as the two occupancy fields show it. */
export function associationToSpaceFields(
  association: Pick<SpaceAssociation, 'spaceType' | 'spaceNumber' | 'floor'>,
): SpaceInput {
  if (association.spaceType === 'Floor') {
    return { floor: association.spaceNumber, suiteUnitType: 'Suite', suiteUnitNumber: '' }
  }
  if (association.spaceType === 'Flat') {
    return {
      floor: association.floor ?? '',
      suiteUnitType: 'Apartment',
      suiteUnitNumber: association.spaceNumber,
    }
  }
  return {
    floor: association.floor ?? '',
    suiteUnitType: association.spaceType,
    suiteUnitNumber: association.spaceNumber,
  }
}

/**
 * The two occupancy fields written back onto an association. A company can hold
 * several floors or suites, so the entry is kept as written ("1,3-5") rather
 * than split — the label then reads back exactly what the user typed.
 */
export function spaceFieldsToAssociation(value: SpaceInput): Pick<
  SpaceAssociation,
  'spaceType' | 'spaceNumber' | 'floor'
> {
  const floor = value.floor.trim()
  const suite = value.suiteUnitNumber.trim()
  if (value.suiteUnitType && suite) {
    return {
      spaceType: value.suiteUnitType as SpaceAssociation['spaceType'],
      spaceNumber: suite,
      floor: floor || undefined,
    }
  }
  return { spaceType: 'Floor', spaceNumber: floor, floor: undefined }
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
  /** What the user has typed into the two occupancy fields. */
  spaceFields?: OccupancyFieldsValue
  /** Everyone else on the property, for the one-company-per-space check. */
  occupants?: OccupantSpaces[]
  affiliations?: readonly string[]
}

export type AssociationErrors = {
  spaceError: string | null
  companyError: string | null
  effectiveDateError: string | null
  endDateError: string | null
  /** Per-field occupancy messages: format, duplicates and conflicts. */
  floorError: string | null
  suiteUnitError: string | null
  affiliationError: string | null
  /** Set when the chosen space is already taken, so the field can be marked. */
  occupied: boolean
  hasErrors: boolean
}

export function validateAssociationForm({
  spaces,
  spaceKey,
  spaceLocked,
  isEditMode,
  companyId,
  companyName,
  effectiveDate,
  cutOffDate,
  spaceFields,
  occupants = [],
  affiliations = [],
}: AssociationValidationInput): AssociationErrors {
  const selectedSpace = spaces.find((space) => space.key === spaceKey)

  // The company being switched away from keeps its space until the effective
  // date, so it is not a conflict for the company taking it over.
  const outgoingCompanyId = spaceLocked && !isEditMode ? selectedSpace?.currentCompanyId : undefined
  const others = occupants.filter(
    (occupant) => occupant.companyId !== companyId && occupant.companyId !== outgoingCompanyId,
  )

  const occupancy = spaceFields
    ? validateOccupancy({ value: spaceFields, occupants: others })
    : { floorError: null, suiteUnitError: null, hasErrors: false }

  // Sharing a property only works when every active company has its own space.
  const missingOccupancy =
    spaceFields && !spaceLocked
      ? occupancyRequiredError({ value: spaceFields, occupants: others, adding: !isEditMode })
      : null

  const effective = parseMMDDYYYY(effectiveDate)
  const end = cutOffDate.trim() ? parseMMDDYYYY(cutOffDate) : null
  const contractEnd = selectedSpace?.currentContractEndDate
    ? parseMMDDYYYY(selectedSpace.currentContractEndDate)
    : null

  // Only the locked switch flow warns about an existing pending switch; every
  // other occupancy problem is reported against the field it came from.
  const spaceError =
    missingOccupancy ??
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
        ? ERRORS.activeContractConflict
        : null

  const endDateError =
    cutOffDate.trim() && !end
      ? 'Enter a valid date (MM/DD/YYYY).'
      : end && effective && end <= effective
        ? ERRORS.tillDateBeforeEffective
        : null

  const affiliationError = affiliations.length === 0 ? ERRORS.affiliationRequired : null

  return {
    spaceError,
    companyError,
    effectiveDateError,
    endDateError,
    floorError: occupancy.floorError,
    suiteUnitError: occupancy.suiteUnitError,
    affiliationError,
    occupied: occupancy.hasErrors,
    hasErrors: Boolean(
      spaceError ||
        companyError ||
        effectiveDateError ||
        endDateError ||
        affiliationError ||
        occupancy.hasErrors,
    ),
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
    return ERRORS.tillDateBeforeEffective
  }
  if (nextCompany && nextStart && (!end || end >= nextStart)) {
    return `Select a Till Date before ${nextCompany.name} starts on ${formatShortDate(nextCompany.effectiveDate)}.`
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
