import { useState } from 'react'
import { propertyAffiliationOptions, type PropertyAffiliation } from '../components/switchCompanyTypes'
import { validateCompanyEndDate } from '../data/companyAssociation'
import { COMPANY_AT_PROPERTY, ERRORS, TILL_DATE_HELPER } from '../data/companyAtPropertyCopy'
import {
  occupancyRequiredError,
  validateOccupancy,
  type OccupancyFieldsValue,
  type OccupantSpaces,
} from '../data/propertyOccupancy'
import { MobileAssigneeFields, emptyMobileAssignee, type MobileAssigneeValue } from './MobileAssigneeFields'
import { MobileChoiceChips, MobileDateField, MobileFieldError, MobileSectionHeading } from './MobileFields'
import { GuideProvider, GuideToggle, GuidedField } from './MobileFieldGuide'
import { MobileOccupancyFields } from './MobileOccupancyFields'
import { MobileSheet } from './MobileSheet'

/**
 * The web app's Edit Company modal. This is the only place an existing
 * company's occupancy can be corrected after it has been created, so it carries
 * the occupancy fields as well as the affiliations, till date and assignee.
 */
export function MobileEditCompanySheet({
  open,
  companyName,
  companyId,
  initialAffiliations,
  initialEndDate,
  initialSpaceFields,
  occupants = [],
  initialAssignee = '',
  initialSupervisor,
  effectiveDate,
  nextCompany,
  onClose,
  onSave,
}: {
  open: boolean
  companyName: string
  companyId?: string
  initialAffiliations: PropertyAffiliation[]
  initialEndDate: string
  initialSpaceFields?: OccupancyFieldsValue
  occupants?: OccupantSpaces[]
  initialAssignee?: string
  initialSupervisor?: string
  effectiveDate: string
  nextCompany?: { name: string; effectiveDate: string }
  onClose: () => void
  onSave: (values: {
    affiliations: PropertyAffiliation[]
    endDate: string
    spaceFields: OccupancyFieldsValue
    assignee: string
    supervisor?: string
  }) => void
}) {
  const [affiliations, setAffiliations] = useState<Set<string>>(new Set<string>(initialAffiliations))
  const [endDate, setEndDate] = useState(initialEndDate)
  const [spaceFields, setSpaceFields] = useState<OccupancyFieldsValue>(
    initialSpaceFields ?? {
      floor: '',
      suiteUnitType: 'Suite',
      suiteUnitNumber: '',
    },
  )
  const [assignee, setAssignee] = useState<MobileAssigneeValue>(() => ({
    ...emptyMobileAssignee(),
    assignee: initialAssignee,
    assignSupervisor: Boolean(initialSupervisor),
    supervisor: initialSupervisor ?? '',
  }))
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const endDateError = validateCompanyEndDate({
    endDate,
    effectiveDate,
    nextCompany,
  })
  const others = occupants.filter((occupant) => occupant.companyId !== companyId)
  const occupancy = validateOccupancy({
    value: spaceFields,
    occupants: others,
  })
  const missingOccupancy = occupancyRequiredError({
    value: spaceFields,
    occupants: others,
    adding: false,
  })
  const affiliationError = affiliations.size === 0 ? ERRORS.affiliationRequired : null
  const assigneeError = submitAttempted && !assignee.assignee ? 'Select an assignee.' : null

  const toggle = (label: string) => {
    setAffiliations((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const save = () => {
    setSubmitAttempted(true)
    if (endDateError || occupancy.hasErrors || missingOccupancy || affiliationError) return
    if (!assignee.assignee) return
    onSave({
      affiliations: [...affiliations] as PropertyAffiliation[],
      endDate: endDate.trim(),
      spaceFields,
      assignee: assignee.assignee,
      supervisor: assignee.assignSupervisor ? assignee.supervisor : undefined,
    })
    onClose()
  }

  return (
    <MobileSheet open={open} onClose={onClose} title={`Edit ${companyName}`}>
      <div className="no-scrollbar flex min-h-0 flex-col gap-5 overflow-y-auto px-4 pb-8">
        <GuideProvider>
          <GuideToggle />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-5 text-[#262527]">Property Affiliation *</p>
            <MobileChoiceChips
              options={propertyAffiliationOptions}
              selected={affiliations}
              onToggle={toggle}
            />
            {submitAttempted && affiliationError && <MobileFieldError>{affiliationError}</MobileFieldError>}
          </div>

          <MobileOccupancyFields
            compact
            value={spaceFields}
            onChange={setSpaceFields}
            floorError={submitAttempted ? occupancy.floorError : null}
            suiteUnitError={submitAttempted ? occupancy.suiteUnitError : null}
          >
            {submitAttempted && missingOccupancy && <MobileFieldError>{missingOccupancy}</MobileFieldError>}
          </MobileOccupancyFields>

          <GuidedField id="till-date" label={COMPANY_AT_PROPERTY.tillDateLabel} hint={TILL_DATE_HELPER}>
            <MobileDateField
              label={COMPANY_AT_PROPERTY.tillDateLabel}
              value={endDate}
              onChange={setEndDate}
              error={submitAttempted ? endDateError : null}
            />
          </GuidedField>

          <div className="flex flex-col gap-2">
            <MobileSectionHeading>Assign to</MobileSectionHeading>
            <MobileAssigneeFields value={assignee} onChange={setAssignee} error={assigneeError} />
          </div>

          <button
            type="button"
            onClick={save}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#146dff] text-base font-medium leading-5 text-white"
          >
            Save
          </button>
        </GuideProvider>
      </div>
    </MobileSheet>
  )
}
