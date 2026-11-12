import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import modalClose from '../assets/modal-close.svg'
import tableAlertCircleWarn from '../assets/table-alert-circle-warn.svg'
import type { PropertyCompany } from '../data/propertyCompanies'
import { validateCompanyEndDate } from '../data/companyAssociation'
import {
  COMPANY_AT_PROPERTY,
  ERRORS,
  OCCUPANCY_DESCRIPTION,
  OCCUPANCY_LABEL,
  PROPERTY_AFFILIATION_DESCRIPTION,
  PROPERTY_AFFILIATION_LABEL,
  SWITCH_SUITE_LABEL,
  TILL_DATE_HELPER,
} from '../data/companyAtPropertyCopy'
import {
  occupancyRequiredError,
  validateOccupancy,
  type OccupantSpaces,
} from '../data/propertyOccupancy'
import { assigneeOptions } from '../data/propertyFormOptions'
import { ModalDateInput } from './ModalDateInput'
import { AffiliationSelect } from './AffiliationSelect'
import { ModalFormRow } from './ModalFormRow'
import { SpaceFields, emptySpaceFields, type SpaceFieldsValue } from './PropertySpaceFields'
import type { PropertyAffiliation } from './switchCompanyTypes'

function companyRecordLabel(company: PropertyCompany) {
  const suffix = company.id.replace(/-/g, '').slice(-6).padStart(6, '0')
  return `TK-PAT-Company_${suffix}`
}

function ModalError({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-1.5 text-sm leading-5 text-[#b32318]">
      <span className="relative mt-0.5 size-4 shrink-0" aria-hidden>
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableAlertCircleWarn} />
      </span>
      <span>{children}</span>
    </p>
  )
}

export type EditCompanyModalProps = {
  open: boolean
  company: PropertyCompany | null
  initialAffiliations: PropertyAffiliation[]
  initialEndDate: string
  /** The occupancy this company currently holds, so it can be corrected here. */
  initialSpaceFields?: SpaceFieldsValue
  /** Everyone else on the property, for the one-company-per-space check. */
  occupants?: OccupantSpaces[]
  initialAssignee?: string
  initialSupervisor?: string
  /** The association's start; the end date has to come after it. */
  effectiveDate: string
  /** A pending company taking over the same space; the end date must come before it starts. */
  nextCompany?: { name: string; effectiveDate: string }
  onClose: () => void
  onSave: (values: {
    affiliations: PropertyAffiliation[]
    endDate: string
    spaceFields: SpaceFieldsValue
    assignee: string
    supervisor?: string
  }) => void
}

export function EditCompanyModal({
  open,
  company,
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
}: EditCompanyModalProps) {
  // Seeded straight from the props: the caller remounts this modal per company,
  // so there is nothing to synchronise after the first render.
  const [affiliations, setAffiliations] = useState<Set<PropertyAffiliation>>(
    () => new Set(initialAffiliations),
  )
  const [endDate, setEndDate] = useState(initialEndDate)
  const [spaceFields, setSpaceFields] = useState<SpaceFieldsValue>(
    () => initialSpaceFields ?? emptySpaceFields(),
  )
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const endDateError = validateCompanyEndDate({ endDate, effectiveDate, nextCompany })
  // This modal is the only place an existing company's occupancy can be
  // corrected, so a clash with another company has to be resolvable here.
  const others = occupants.filter((occupant) => occupant.companyId !== company?.id)
  const occupancy = validateOccupancy({ value: spaceFields, occupants: others })
  const missingOccupancy = occupancyRequiredError({
    value: spaceFields,
    occupants: others,
    adding: false,
  })
  const affiliationError = affiliations.size === 0 ? ERRORS.affiliationRequired : null

  const handleSave = () => {
    setSubmitAttempted(true)
    if (endDateError || occupancy.hasErrors || missingOccupancy || affiliationError) return
    onSave({
      affiliations: [...affiliations],
      endDate: endDate.trim(),
      spaceFields,
      assignee: initialAssignee.trim() || assigneeOptions[0] || '',
      supervisor: initialSupervisor,
    })
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open || !company) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-company-title"
    >
      <button type="button" className="absolute inset-0 bg-[#262527]/40" aria-label="Close dialog" onClick={onClose} />
      <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-[960px] flex-col rounded-xl border border-[#e6e6e7] bg-white p-6 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]">
        <div className="mb-4 flex w-full shrink-0 items-start gap-2 border-b border-[#e6e6e7] pb-4">
          <h2 id="edit-company-title" className="min-w-0 flex-1 text-xl font-bold leading-7 text-[#262527]">
            Edit Company
          </h2>
          <button type="button" aria-label="Close" onClick={onClose} className="relative size-6 shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={modalClose} />
          </button>
        </div>

        <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
        <div className="mb-5 rounded-lg bg-[#f5f5f6] px-4 py-3">
          <p className="text-sm font-medium leading-5 text-[#262527]">{companyRecordLabel(company)}</p>
        </div>

        <ModalFormRow
          label={PROPERTY_AFFILIATION_LABEL}
          description={PROPERTY_AFFILIATION_DESCRIPTION}
          required
        >
          <div className="flex flex-col gap-1.5">
            <AffiliationSelect id="edit-company-affiliation" value={affiliations} onChange={setAffiliations} />
            {submitAttempted && affiliationError && <ModalError>{affiliationError}</ModalError>}
          </div>
        </ModalFormRow>

        <ModalFormRow label={OCCUPANCY_LABEL} description={OCCUPANCY_DESCRIPTION}>
          <div className="flex flex-col gap-1.5">
            <SpaceFields
              idPrefix="edit-company"
              size="sm"
              suiteUnitNumberOnly
              suiteUnitOnlyLabel={SWITCH_SUITE_LABEL}
              value={spaceFields}
              onChange={setSpaceFields}
              errors={{
                suiteUnit: submitAttempted ? occupancy.suiteUnitError : null,
              }}
            />
            {submitAttempted && missingOccupancy && <ModalError>{missingOccupancy}</ModalError>}
          </div>
        </ModalFormRow>

        <ModalFormRow label={COMPANY_AT_PROPERTY.tillDateLabel} description={TILL_DATE_HELPER}>
          <div className="flex flex-col gap-1.5">
            <ModalDateInput id="edit-company-end-date" value={endDate} onChange={setEndDate} />
            {submitAttempted && endDateError && <ModalError>{endDateError}</ModalError>}
          </div>
        </ModalFormRow>

        </div>

        <div className="mt-6 flex shrink-0 justify-end gap-3 border-t border-[#e6e6e7] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2 text-sm leading-5 text-[#444446]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm leading-5 text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
