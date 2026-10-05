import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import modalClose from '../assets/modal-close.svg'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import tableAlertCircleWarn from '../assets/table-alert-circle-warn.svg'
import type { PropertyCompany } from '../data/propertyCompanies'
import { validateCompanyEndDate } from '../data/companyAssociation'
import {
  COMPANY_AT_PROPERTY,
  ERRORS,
  TILL_DATE_HELPER,
} from '../data/companyAtPropertyCopy'
import {
  occupancyRequiredError,
  validateOccupancy,
  type OccupantSpaces,
} from '../data/propertyOccupancy'
import { AssigneeFields, emptyAssignee, type AssigneeValue } from './AssigneeFields'
import { ModalDateInput } from './ModalDateInput'
import { OccupancyGroup } from './OccupancyGroup'
import { SpaceFields, emptySpaceFields, type SpaceFieldsValue } from './PropertySpaceFields'
import {
  propertyAffiliationOptions,
  type PropertyAffiliation,
} from './switchCompanyTypes'

const affiliationChipStyles: Record<PropertyAffiliation, { bg: string; text: string }> = {
  Headquarters: { bg: '#fff4d8', text: '#b54708' },
  Managed: { bg: '#e5f6ff', text: '#146dff' },
  Owned: { bg: '#f4edfd', text: '#9747ff' },
  Shared: { bg: '#fbeeed', text: '#d9534f' },
  'Regional Office': { bg: '#eff8ef', text: '#2e964b' },
  Tenant: { bg: '#ffeed4', text: '#ef5c07' },
}

function companyRecordLabel(company: PropertyCompany) {
  const suffix = company.id.replace(/-/g, '').slice(-6).padStart(6, '0')
  return `TK-PAT-Company_${suffix}`
}

function AffiliationChipSelect({
  value,
  onChange,
}: {
  value: Set<PropertyAffiliation>
  onChange: (next: Set<PropertyAffiliation>) => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [open])

  const selectedList = propertyAffiliationOptions.filter((label) => value.has(label))

  const toggle = (label: PropertyAffiliation) => {
    const next = new Set(value)
    if (next.has(label)) next.delete(label)
    else next.add(label)
    onChange(next)
  }

  const remove = (label: PropertyAffiliation, event: ReactMouseEvent) => {
    event.stopPropagation()
    const next = new Set(value)
    next.delete(label)
    onChange(next)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-10 w-full items-center gap-2 rounded-lg border border-[#aeaeb2] bg-white px-3 py-2 text-left"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selectedList.length === 0 ? (
            <span className="text-base leading-6 text-[#ccc]">Select Option</span>
          ) : (
            selectedList.map((label) => {
              const style = affiliationChipStyles[label]
              return (
                <span
                  key={label}
                  className="inline-flex max-w-full items-center gap-1 rounded-2xl px-2 py-0.5 text-sm leading-5"
                  style={{ backgroundColor: style.bg, color: style.text }}
                >
                  <span className="truncate">{label}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove ${label}`}
                    className="shrink-0 text-base leading-none opacity-70 hover:opacity-100"
                    onClick={(event) => remove(label, event)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        remove(label, event as unknown as ReactMouseEvent)
                      }
                    }}
                  >
                    ×
                  </span>
                </span>
              )
            })
          )}
        </div>
        <span className="relative size-4 shrink-0">
          <img
            alt=""
            className={`absolute inset-0 block size-full max-w-none transition-transform ${open ? 'rotate-180' : ''}`}
            src={questionsChevronDown}
          />
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-multiselectable
          className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[220px] overflow-y-auto rounded-lg border border-[#e6e6e7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          {propertyAffiliationOptions.map((label) => {
            const selected = value.has(label)
            const style = affiliationChipStyles[label]
            return (
              <li key={label} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => toggle(label)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm leading-5 hover:bg-[#f5f5f6] ${
                    selected ? 'bg-[#f5f5f6]' : ''
                  }`}
                >
                  <span
                    className="inline-flex rounded-2xl px-2 py-0.5 text-sm leading-5"
                    style={{ backgroundColor: style.bg, color: style.text }}
                  >
                    {label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
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
  const [assignee, setAssignee] = useState<AssigneeValue>(() => ({
    ...emptyAssignee(),
    assignee: initialAssignee,
    assignSupervisor: Boolean(initialSupervisor),
    supervisor: initialSupervisor ?? '',
  }))
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
  const assigneeError = submitAttempted && !assignee.assignee ? 'Select an assignee.' : null

  const handleSave = () => {
    setSubmitAttempted(true)
    if (endDateError || occupancy.hasErrors || missingOccupancy || affiliationError) return
    if (!assignee.assignee) return
    onSave({
      affiliations: [...affiliations],
      endDate: endDate.trim(),
      spaceFields,
      assignee: assignee.assignee,
      supervisor: assignee.assignSupervisor ? assignee.supervisor : undefined,
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
      <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-[640px] flex-col rounded-xl border border-[#e6e6e7] bg-white p-6 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]">
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-company-affiliation" className="text-sm font-medium leading-5 text-[#86868b]">
            Property Affiliation
            <span className="text-[#b32318]"> *</span>
          </label>
          <AffiliationChipSelect value={affiliations} onChange={setAffiliations} />
          {submitAttempted && affiliationError && <ModalError>{affiliationError}</ModalError>}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <OccupancyGroup>
          <SpaceFields
            layout="even"
            idPrefix="edit-company"
            size="sm"
            value={spaceFields}
            onChange={setSpaceFields}
            errors={{
              floor: submitAttempted ? occupancy.floorError : null,
              suiteUnit: submitAttempted ? occupancy.suiteUnitError : null,
            }}
          />
          </OccupancyGroup>
          {submitAttempted && missingOccupancy && <ModalError>{missingOccupancy}</ModalError>}
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <label htmlFor="edit-company-end-date" className="text-sm font-medium leading-5 text-[#86868b]">
            {COMPANY_AT_PROPERTY.tillDateLabel}
          </label>
          <ModalDateInput id="edit-company-end-date" value={endDate} onChange={setEndDate} />
          {submitAttempted && endDateError ? (
            <ModalError>{endDateError}</ModalError>
          ) : (
            <p className="text-xs leading-[18px] text-[#86868b]">{TILL_DATE_HELPER}</p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <p className="text-sm font-medium leading-5 text-[#86868b]">
            Assign to
            <span className="text-[#b32318]"> *</span>
          </p>
          <AssigneeFields idPrefix="edit-company" value={assignee} onChange={setAssignee} error={assigneeError} />
        </div>
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
