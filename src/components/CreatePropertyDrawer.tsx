import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import createPropertyMap from '../assets/create-property-map.png'
import detailPlus from '../assets/detail-plus.svg'
import modalClose from '../assets/modal-close.svg'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import tableSearch from '../assets/table-search.svg'
import {
  affiliationOptions,
  assigneeOptions,
  associatedFranchiseOptions,
  companyOptions,
  defaultAffiliations,
  hubspotStageOptions,
  parentCompanyOptions,
  propertySourceOptions,
  supervisorOptions,
  type Affiliation,
} from '../data/propertyFormOptions'
import {
  COMPANY_AT_PROPERTY,
  HUBSPOT_STAGE_LABEL,
  TILL_DATE_TOOLTIP,
} from '../data/companyAtPropertyCopy'
import { buildOccupants } from '../data/companyAssociation'
import { initialSpaceAssociations } from '../data/propertySpaceAssociations'
import { validateOccupancy } from '../data/propertyOccupancy'
import { companyParents, type SpaceType } from '../data/propertySpaces'
import { CreateCompanyModal } from './CreateCompanyModal'
import { InfoTooltip } from './InfoTooltip'
import { ModalDateInput } from './ModalDateInput'
import { OccupancyGroup } from './OccupancyGroup'
import { SpaceFields } from './PropertySpaceFields'

type CreatePropertyDrawerProps = {
  open: boolean
  onClose: () => void
}

function DrawerLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <p className="text-sm font-medium leading-5 text-[#86868b]">
      {children}
      {required && <span className="text-[#b32318]"> *</span>}
    </p>
  )
}

function DrawerLabelWithInfo({
  children,
  required,
  tooltip,
  tooltipId,
}: {
  children: ReactNode
  required?: boolean
  tooltip: string
  tooltipId: string
}) {
  return (
    <div className="flex items-center gap-1">
      <DrawerLabel required={required}>{children}</DrawerLabel>
      <InfoTooltip id={tooltipId} label={`${children} information`} text={tooltip} />
    </div>
  )
}

function DrawerSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full appearance-none rounded-lg border border-[#e6e6e7] bg-white px-3.5 text-base leading-6 outline-none ${
          value ? 'text-[#262527]' : 'text-[#ccc]'
        }`}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2" aria-hidden>
        <img alt="" className="block size-full max-w-none" src={questionsChevronDown} />
      </span>
    </div>
  )
}

function DrawerTextInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-lg border border-[#e6e6e7] bg-white px-3.5 text-base leading-6 text-[#262527] outline-none placeholder:text-[#ccc]"
    />
  )
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <p className="text-base font-bold leading-6 text-[#262527]">{title}</p>
      {description && <p className="mt-1 text-sm leading-5 text-[#6a6a70]">{description}</p>}
    </div>
  )
}

function SectionDivider() {
  return <div className="h-px w-full shrink-0 bg-[#e6e6e7]" />
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1 flex items-start gap-1.5 text-sm leading-5 text-[#d92d20]">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="mt-0.5 shrink-0">
        <path
          d="M8 5.33333V8M8 10.6667H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{children}</span>
    </p>
  )
}

export function CreatePropertyDrawer({ open, onClose }: CreatePropertyDrawerProps) {
  const [address, setAddress] = useState('')
  const [floor, setFloor] = useState('')
  const [suiteUnitType, setSuiteUnitType] = useState<SpaceType | ''>('Suite')
  const [suiteUnitNumber, setSuiteUnitNumber] = useState('')
  const [propertyName, setPropertyName] = useState('')
  const [addressNotes, setAddressNotes] = useState('')
  const [company, setCompany] = useState('Costco Wholesale')
  const [parentCompany, setParentCompany] = useState(companyParents['Costco Wholesale'] ?? '')
  const [cutOffDate, setCutOffDate] = useState('')
  const [hubspotStage, setHubspotStage] = useState('')
  const [affiliations, setAffiliations] = useState<Set<Affiliation>>(new Set(defaultAffiliations))
  const [assignee, setAssignee] = useState('')
  const [assignSupervisor, setAssignSupervisor] = useState(false)
  const [supervisor, setSupervisor] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [createCompanyOpen, setCreateCompanyOpen] = useState(false)
  const spaceFieldRef = useRef<HTMLDivElement>(null)
  const suiteUnitNumberRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !createCompanyOpen) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, createCompanyOpen, onClose])

  useEffect(() => {
    if (open) return
    setAddress('')
    setFloor('')
    setSuiteUnitType('Suite')
    setSuiteUnitNumber('')
    setPropertyName('')
    setAddressNotes('')
    setCompany('Costco Wholesale')
    setParentCompany(companyParents['Costco Wholesale'] ?? '')
    setCutOffDate('')
    setHubspotStage('')
    setAffiliations(new Set(defaultAffiliations))
    setAssignee('')
    setAssignSupervisor(false)
    setSupervisor('')
    setSubmitAttempted(false)
    setCreateCompanyOpen(false)
  }, [open])

  const toggleAffiliation = (label: Affiliation) => {
    setAffiliations((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const selectCompany = (value: string) => {
    setCompany(value)
    setParentCompany(companyParents[value] ?? '')
  }

  // Format, duplicate and already-occupied checks, shared with the company modals.
  const occupancy = validateOccupancy({
    value: { floor, suiteUnitType, suiteUnitNumber },
    occupants: buildOccupants(initialSpaceAssociations),
  })
  const floorError = occupancy.floorError
  const suiteUnitError = occupancy.suiteUnitError
  const spaceConflict = occupancy.hasErrors
  const assigneeError = submitAttempted && !assignee ? 'Select an assignee.' : null

  const handleCreate = () => {
    setSubmitAttempted(true)
    if (!assignee) {
      document.getElementById('create-property-assignee')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      document.getElementById('create-property-assignee')?.focus()
      return
    }
    if (spaceConflict) {
      spaceFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (suiteUnitError) suiteUnitNumberRef.current?.focus()
      return
    }
    window.alert('Property created (prototype)')
    onClose()
  }

  if (!open) return null

  return createPortal(
    <>
      <div className="fixed inset-0 z-[60] flex justify-end">
        <button
          type="button"
          className="absolute inset-0 bg-[#000000]/50"
          aria-label="Close create property drawer"
          onClick={onClose}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-property-title"
          className="relative flex h-full w-full max-w-[806px] flex-col bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]"
        >
          <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
            <div className="mb-8 flex shrink-0 items-start justify-between gap-2">
              <div>
                <h2 id="create-property-title" className="text-xl font-bold leading-7 text-[#262527]">
                  Create Property
                </h2>
                <p className="mt-1 text-sm leading-5 text-[#6a6a70]">Please add the following information</p>
              </div>
              <button type="button" aria-label="Close" onClick={onClose} className="size-6 shrink-0">
                <img alt="" className="block size-full max-w-none" src={modalClose} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-6 pb-4">
                <section className="flex flex-col gap-4">
                  <SectionHeading title="Address" />
                  <div className="flex flex-col gap-1.5">
                    <DrawerLabel required>Address</DrawerLabel>
                    <div className="flex h-11 items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5 focus-within:border-primary">
                      <span className="relative size-5 shrink-0" aria-hidden>
                        <img alt="" className="block size-full max-w-none" src={tableSearch} />
                      </span>
                      <input
                        id="create-property-address"
                        type="text"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="Type Address"
                        className="min-w-0 flex-1 bg-transparent text-base leading-6 text-[#262527] outline-none placeholder:text-[#ccc]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <DrawerLabel>Address Description</DrawerLabel>
                    <textarea
                      id="create-property-address-notes"
                      value={addressNotes}
                      onChange={(event) => setAddressNotes(event.target.value)}
                      placeholder="e.g. blue building next to the pharmacy, enter from the rear gate"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2.5 text-base leading-6 text-[#262527] outline-none placeholder:text-[#ccc]"
                    />
                  </div>
                  <div className="relative h-[270px] overflow-hidden rounded-lg border border-[#e6e6e7]">
                    <img alt="" className="size-full object-cover" src={createPropertyMap} />
                  </div>
                </section>

                <SectionDivider />

                <section className="flex flex-col gap-4">
                  <SectionHeading title="Property Details" />
                  <div className="grid grid-cols-2 items-start gap-6">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <DrawerLabel>Location / Property Name</DrawerLabel>
                      <DrawerTextInput
                        id="create-property-name"
                        value={propertyName}
                        onChange={setPropertyName}
                        placeholder="Add Location / Property Name"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <DrawerLabel required>Property Source</DrawerLabel>
                      <DrawerSelect
                        id="create-property-source"
                        value="Referred"
                        onChange={() => {}}
                        options={propertySourceOptions}
                      />
                    </div>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <DrawerLabel>Associated Franchise</DrawerLabel>
                      <DrawerSelect
                        id="create-property-franchise"
                        value="402 - Central Valencia"
                        onChange={() => {}}
                        options={associatedFranchiseOptions}
                      />
                    </div>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <DrawerLabel required>{HUBSPOT_STAGE_LABEL}</DrawerLabel>
                      <DrawerSelect
                        id="create-property-hubspot"
                        value={hubspotStage}
                        onChange={setHubspotStage}
                        options={hubspotStageOptions}
                        placeholder="Choose Stage"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <DrawerLabel>Affiliation</DrawerLabel>
                    <div className="flex flex-wrap gap-2">
                      {affiliationOptions.map((label) => {
                        const selected = affiliations.has(label)
                        return (
                          <button
                            key={label}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleAffiliation(label)}
                            className={`rounded-[40px] border px-3 py-1.5 text-sm leading-5 ${
                              selected
                                ? 'border-[1.5px] border-primary bg-white text-[#262527]'
                                : 'border border-[#e6e6e7] bg-white text-[#262527]'
                            }`}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </section>

                <SectionDivider />

                <section className="flex flex-col gap-4">
                  <SectionHeading title="Company" />
                  <div className="grid grid-cols-2 items-start gap-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <DrawerLabel required>Company</DrawerLabel>
                        <button
                          type="button"
                          onClick={() => setCreateCompanyOpen(true)}
                          className="flex items-center gap-1 text-sm font-medium text-primary"
                        >
                          <span className="relative size-5 shrink-0" aria-hidden>
                            <img alt="" className="absolute inset-0 block size-full max-w-none" src={detailPlus} />
                          </span>
                          Create New
                        </button>
                      </div>
                      <DrawerSelect
                        id="create-property-company"
                        value={company}
                        onChange={selectCompany}
                        options={companyOptions}
                      />
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-xs leading-[18px] text-[#86868b]">Strategic Partnership Status:</span>
                        <span className="rounded-2xl bg-[#eff8ef] px-2 py-0.5 text-xs font-medium leading-[18px] text-[#2e964b]">
                          SP - Active
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <DrawerLabel>Parent Company</DrawerLabel>
                      <DrawerSelect
                        id="create-property-parent-company"
                        value={parentCompany}
                        onChange={setParentCompany}
                        options={parentCompanyOptions}
                        placeholder="Select parent company"
                      />
                    </div>
                  </div>
                  <div className="flex w-full max-w-[359px] flex-col gap-1.5">
                    <DrawerLabelWithInfo tooltip={TILL_DATE_TOOLTIP} tooltipId="create-property-cut-off-date-help">
                      {COMPANY_AT_PROPERTY.tillDateLabel}
                    </DrawerLabelWithInfo>
                    <ModalDateInput
                      id="create-property-cut-off-date"
                      variant="drawer"
                      value={cutOffDate}
                      onChange={setCutOffDate}
                    />
                  </div>
                  <div ref={spaceFieldRef} className="pt-2">
                    <OccupancyGroup>
                    <SpaceFields
                      layout="even"
                      idPrefix="create-property"
                      value={{ floor, suiteUnitType, suiteUnitNumber }}
                      onChange={(next) => {
                        setFloor(next.floor)
                        setSuiteUnitType(next.suiteUnitType)
                        setSuiteUnitNumber(next.suiteUnitNumber)
                      }}
                      errors={{
                        floor: submitAttempted ? floorError : null,
                        suiteUnit: submitAttempted ? suiteUnitError : null,
                      }}
                      suiteUnitNumberRef={suiteUnitNumberRef}
                    />
                    </OccupancyGroup>
                  </div>
                </section>

                <SectionDivider />

                <section className="flex flex-col gap-6">
                  <SectionHeading title="Assign to" />
                  <div className="grid grid-cols-2 items-start gap-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <DrawerLabel required>Assignee</DrawerLabel>
                        <DrawerSelect
                          id="create-property-assignee"
                          value={assignee}
                          onChange={setAssignee}
                          options={assigneeOptions}
                          placeholder="Select Assignee"
                        />
                        {assigneeError && <FieldError id="create-property-assignee-error">{assigneeError}</FieldError>}
                      </div>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={assignSupervisor}
                          onChange={(event) => {
                            setAssignSupervisor(event.target.checked)
                            if (!event.target.checked) setSupervisor('')
                          }}
                          className="size-4 rounded border border-[#6a6a70] accent-primary"
                        />
                        <span className="text-sm leading-5 text-[#262527]">Assign Supervisor</span>
                      </label>
                    </div>
                    {assignSupervisor && (
                      <div className="flex flex-col gap-1.5">
                        <DrawerLabel>Supervisor</DrawerLabel>
                        <DrawerSelect
                          id="create-property-supervisor"
                          value={supervisor}
                          onChange={setSupervisor}
                          options={supervisorOptions}
                          placeholder="Select Supervisor"
                        />
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-[#e6e6e7] px-8 pb-6 pt-5">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2 text-sm font-medium leading-5 text-[#444446]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm font-medium leading-5 text-white"
              >
                Create Property
              </button>
            </div>
          </div>
        </aside>
      </div>

      <CreateCompanyModal
        open={createCompanyOpen}
        onClose={() => setCreateCompanyOpen(false)}
        onCancel={() => setCreateCompanyOpen(false)}
        onCreate={() => window.alert('Company created (prototype)')}
      />
    </>,
    document.body,
  )
}
