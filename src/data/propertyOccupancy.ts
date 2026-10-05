import {
  ERRORS,
  addOccupancyFirstError,
  occupancyTakenError,
} from './companyAtPropertyCopy'

/**
 * Property occupancy: parsing, format rules and the conflict checks behind the
 * agreed error messages. A company can hold more than one floor or suite, so
 * both fields accept a list; only Floor accepts a range, because suite
 * numbering is not always sequential.
 */

/** A single space held by a company, after a field's entry has been expanded. */
export type OccupancyUnit = {
  /** Floor, Suite, Unit or Apartment. */
  field: string
  /** The individual value, e.g. "5" or "210B". */
  value: string
}

export type OccupancyParse = {
  /** Every value the entry expands to, in the order written. */
  values: string[]
  /** Set when the entry does not match the field's accepted format. */
  invalid: boolean
  /** Set when the same value appears twice in one entry. */
  duplicate: boolean
}

const EMPTY_PARSE: OccupancyParse = { values: [], invalid: false, duplicate: false }

/** Floors are ordinal, so "05" and "5" are the same floor. */
const normalizeFloor = (value: string) => String(Number(value))

/** Suites are compared case-insensitively: "210b" and "210B" are the same suite. */
const normalizeSuite = (value: string) => value.toUpperCase()

/**
 * Floor accepts numbers only: a single floor, a comma-separated list, or a
 * range written with a dash. "1,3-5" expands to 1, 3, 4, 5.
 */
export function parseFloorEntry(raw: string): OccupancyParse {
  const entry = raw.trim()
  if (!entry) return EMPTY_PARSE

  const values: string[] = []
  for (const part of entry.split(',')) {
    const token = part.trim()
    if (!token) return { values: [], invalid: true, duplicate: false }

    const range = /^(\d+)\s*-\s*(\d+)$/.exec(token)
    if (range) {
      const from = Number(range[1])
      const to = Number(range[2])
      // A descending or zero-width range is a typo rather than a selection.
      if (from >= to) return { values: [], invalid: true, duplicate: false }
      for (let floor = from; floor <= to; floor += 1) values.push(String(floor))
      continue
    }

    if (!/^\d+$/.test(token)) return { values: [], invalid: true, duplicate: false }
    values.push(normalizeFloor(token))
  }

  return { values, invalid: false, duplicate: new Set(values).size !== values.length }
}

/**
 * Suite / Unit / Apartment accepts letters and numbers, singly or as a
 * comma-separated list. Ranges are not supported.
 */
export function parseSuiteEntry(raw: string): OccupancyParse {
  const entry = raw.trim()
  if (!entry) return EMPTY_PARSE

  const values: string[] = []
  for (const part of entry.split(',')) {
    const token = part.trim()
    if (!token || !/^[A-Za-z0-9]+$/.test(token)) {
      return { values: [], invalid: true, duplicate: false }
    }
    values.push(normalizeSuite(token))
  }

  return { values, invalid: false, duplicate: new Set(values).size !== values.length }
}

/** The format message for an entry, or null when it is acceptable. */
export function occupancyFormatError(parse: OccupancyParse): string | null {
  if (parse.invalid) return ERRORS.invalidFormat
  if (parse.duplicate) return ERRORS.duplicateValues
  return null
}

export type OccupancyFieldsValue = {
  floor: string
  suiteUnitType: string
  suiteUnitNumber: string
}

/** Everything one company holds, across both fields. */
export function expandOccupancy(value: OccupancyFieldsValue): OccupancyUnit[] {
  const units: OccupancyUnit[] = []
  for (const floor of parseFloorEntry(value.floor).values) {
    units.push({ field: 'Floor', value: floor })
  }
  const suiteField = value.suiteUnitType || 'Suite'
  for (const suite of parseSuiteEntry(value.suiteUnitNumber).values) {
    units.push({ field: suiteField, value: suite })
  }
  return units
}

/** A company already on the property, with the spaces it holds. */
export type OccupantSpaces = {
  companyId: string
  companyName: string
  units: OccupancyUnit[]
}

export type OccupancyConflictInput = {
  /** What the user has entered in this modal. */
  value: OccupancyFieldsValue
  /** Everyone else currently active or pending on the property. */
  occupants: OccupantSpaces[]
  /** Excluded from the check, so editing a company does not clash with itself. */
  ignoreCompanyId?: string
}

export type OccupancyConflicts = {
  floorError: string | null
  suiteUnitError: string | null
  /** True when any message is set, so the caller can block the save. */
  hasErrors: boolean
}

const sameUnit = (a: OccupancyUnit, b: OccupancyUnit) => a.field === b.field && a.value === b.value

/**
 * Checks one field's entry against everyone else on the property.
 *
 * One company in conflict is named, because the user can go and resolve it.
 * Several are not, because no single name would be the one to act on.
 */
function conflictMessageFor(
  field: 'Floor' | 'SuiteUnit',
  fieldName: string,
  parse: OccupancyParse,
  occupants: OccupantSpaces[],
): string | null {
  const formatError = occupancyFormatError(parse)
  if (formatError) return formatError
  if (parse.values.length === 0) return null

  const entered = parse.values.map((value) => ({
    field: field === 'Floor' ? 'Floor' : fieldName,
    value,
  }))

  const clashingByCompany = new Map<string, { name: string; values: string[] }>()
  for (const unit of entered) {
    for (const occupant of occupants) {
      if (!occupant.units.some((held) => sameUnit(held, unit))) continue
      const existing = clashingByCompany.get(occupant.companyId) ?? {
        name: occupant.companyName,
        values: [],
      }
      existing.values.push(unit.value)
      clashingByCompany.set(occupant.companyId, existing)
    }
  }

  if (clashingByCompany.size === 0) return null
  if (clashingByCompany.size > 1) return ERRORS.severalCompaniesOccupied

  const [only] = [...clashingByCompany.values()]
  return occupancyTakenError(field === 'Floor' ? 'Floor' : fieldName, only.values, only.name)
}

/** Format, duplicate and conflict messages for both occupancy fields. */
export function validateOccupancy({
  value,
  occupants,
  ignoreCompanyId,
}: OccupancyConflictInput): OccupancyConflicts {
  const others = occupants.filter((occupant) => occupant.companyId !== ignoreCompanyId)
  const suiteField = value.suiteUnitType || 'Suite'

  const floorError = conflictMessageFor('Floor', 'Floor', parseFloorEntry(value.floor), others)
  const suiteUnitError = conflictMessageFor(
    'SuiteUnit',
    suiteField,
    parseSuiteEntry(value.suiteUnitNumber),
    others,
  )

  return { floorError, suiteUnitError, hasErrors: Boolean(floorError || suiteUnitError) }
}

/**
 * Two companies can only share a property when each has its own occupancy.
 * Returns the message to show against the occupancy fields, or null.
 *
 * `occupants` is everyone already active on the property, excluding the company
 * being edited.
 */
export function occupancyRequiredError({
  value,
  occupants,
  adding,
}: {
  value: OccupancyFieldsValue
  occupants: OccupantSpaces[]
  /** True when a company is being added, false when one is being edited. */
  adding: boolean
}): string | null {
  if (occupants.length === 0) return null

  // An existing company with no occupancy has to be fixed first — there would be
  // no way to tell the two apart.
  const unplaced = occupants.find((occupant) => occupant.units.length === 0)
  if (unplaced && adding) return addOccupancyFirstError(unplaced.companyName)

  if (expandOccupancy(value).length === 0) return ERRORS.clearedOccupancyWhileShared
  return null
}
