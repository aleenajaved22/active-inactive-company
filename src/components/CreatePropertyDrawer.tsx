import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import createPropertyMap from '../assets/create-property-map.png'
import detailPlus from '../assets/detail-plus.svg'
import modalClose from '../assets/modal-close.svg'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import tableSearch from '../assets/table-search.svg'
import { CreateCompanyModal } from './CreateCompanyModal'
import { ModalDateInput } from './ModalDateInput'

const affiliationOptions = [
  'Headquarters',
  'Regional Office',
  'Managed',
  'Owned',
  'Shared',
  'Tenant',
] as const

type Affiliation = (typeof affiliationOptions)[number]

const contactRoles = [
  { label: 'Decision Maker', color: 'text-[#9747ff]' },
  { label: 'End User', color: 'text-primary' },
  { label: 'Billing', color: 'text-[#2e964b]' },
  { label: 'Blocker', color: 'text-[#d9534f]' },
  { label: 'Influencer', color: 'text-[#f4780b]' },
] as const

type CreatePropertyDrawerProps = {
  open: boolean
  onClose: () => void
}

const CUT_OFF_DATE_HELP =
  'On the Company Association End Date, the current company is dissociated from this property'

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
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties>({})

  useLayoutEffect(() => {
    if (!tooltipVisible || !triggerRef.current) return

    const updatePosition = () => {
      const trigger = triggerRef.current
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      const width = Math.min(320, window.innerWidth - 24)
      let left = rect.left + rect.width / 2 - width / 2
      left = Math.max(12, Math.min(left, window.innerWidth - width - 12))
      setTooltipStyle({
        position: 'fixed',
        left,
        top: rect.top - 6,
        width,
        transform: 'translateY(-100%)',
        zIndex: 80,
      })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [tooltipVisible])

  const showTooltip = () => setTooltipVisible(true)
  const hideTooltip = () => setTooltipVisible(false)

  return (
    <div className="flex items-center gap-1">
      <DrawerLabel required={required}>{children}</DrawerLabel>
      <button
        ref={triggerRef}
        type="button"
        className="flex size-4 shrink-0 items-center justify-center rounded-full text-[#86868b] hover:text-[#6a6a70]"
        aria-describedby={tooltipVisible ? tooltipId : undefined}
        aria-label={`${children} information`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M8 5.33333V8M8 10.6667H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {tooltipVisible &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            style={tooltipStyle}
            className="pointer-events-none rounded-lg bg-[#262527] p-3 text-sm leading-5 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          >
            {tooltip}
          </div>,
          document.body,
        )}
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

export function CreatePropertyDrawer({ open, onClose }: CreatePropertyDrawerProps) {
  const [propertyName, setPropertyName] = useState('')
  const [parentCompany, setParentCompany] = useState('')
  const [hubspotStage, setHubspotStage] = useState('')
  const [cutOffDate, setCutOffDate] = useState('')
  const [assignee, setAssignee] = useState('')
  const [assignSupervisor, setAssignSupervisor] = useState(false)
  const [address, setAddress] = useState('')
  const [addressNotes, setAddressNotes] = useState('')
  const [affiliations, setAffiliations] = useState<Set<Affiliation>>(new Set(['Headquarters', 'Managed']))
  const [createCompanyOpen, setCreateCompanyOpen] = useState(false)

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
    setPropertyName('')
    setParentCompany('')
    setHubspotStage('')
    setCutOffDate('')
    setAssignee('')
    setAssignSupervisor(false)
    setAddress('')
    setAddressNotes('')
    setAffiliations(new Set(['Headquarters', 'Managed']))
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
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-6">
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
                      value="Costco Wholesale"
                      onChange={() => {}}
                      options={['Costco Wholesale', '7 Eleven']}
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
                    <DrawerTextInput
                      id="create-property-parent-company"
                      value={parentCompany}
                      onChange={setParentCompany}
                      placeholder="Parent Company"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <DrawerLabel required>Location / Property Name</DrawerLabel>
                    <DrawerTextInput
                      id="create-property-name"
                      value={propertyName}
                      onChange={setPropertyName}
                      placeholder="Add Location / Property Name"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <DrawerLabel required>Property Source</DrawerLabel>
                    <DrawerSelect
                      id="create-property-source"
                      value="Referred"
                      onChange={() => {}}
                      options={['Referred', 'Inbound', 'Outbound']}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <DrawerLabel>Associated Franchise</DrawerLabel>
                    <DrawerSelect
                      id="create-property-franchise"
                      value="402 - Central Valencia"
                      onChange={() => {}}
                      options={['402 - Central Valencia', '420 - Automation']}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <DrawerLabel required>Choose a Hubspot Stage to Map</DrawerLabel>
                    <DrawerSelect
                      id="create-property-hubspot"
                      value={hubspotStage}
                      onChange={setHubspotStage}
                      options={['Discovery', 'Qualified', 'Needs Assessment']}
                      placeholder="Choose Stage"
                    />
                  </div>
                </div>

                <div className="flex w-full max-w-[359px] flex-col gap-1.5">
                  <DrawerLabelWithInfo required tooltip={CUT_OFF_DATE_HELP} tooltipId="create-property-cut-off-date-help">
                    Company Association End Date
                  </DrawerLabelWithInfo>
                  <ModalDateInput
                    id="create-property-cut-off-date"
                    variant="drawer"
                    value={cutOffDate}
                    onChange={setCutOffDate}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                  <p className="shrink-0 text-base font-bold leading-6 text-[#262527]">Affiliation</p>
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

                <div className="h-px w-full bg-[#e6e6e7]" />

                <div className="flex flex-col gap-3">
                  <p className="text-base font-bold leading-6 text-[#262527]">Assign to</p>
                  <div className="max-w-[354px] flex flex-col gap-1.5">
                    <p className="text-sm font-medium leading-5 text-[#5b5b5f]">Select Assignee</p>
                    <DrawerSelect
                      id="create-property-assignee"
                      value={assignee}
                      onChange={setAssignee}
                      options={['Jeff Zolos', 'Henry Micheal']}
                      placeholder="Select Assignee"
                    />
                  </div>
                  <label className="flex max-w-[354px] cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={assignSupervisor}
                      onChange={(event) => setAssignSupervisor(event.target.checked)}
                      className="size-4 rounded border border-[#6a6a70] accent-primary"
                    />
                    <span className="text-sm leading-5 text-[#262527]">Assign Supervisor</span>
                  </label>
                </div>

                <div className="h-px w-full bg-[#e6e6e7]" />

                <div className="flex flex-col gap-3">
                  <p className="text-base font-bold leading-6 text-[#262527]">Referred by</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <DrawerLabel required>Property</DrawerLabel>
                      <DrawerSelect
                        id="create-property-referred-property"
                        value="402 - Central Valencia"
                        onChange={() => {}}
                        options={['402 - Central Valencia']}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <DrawerLabel required>Contact</DrawerLabel>
                      <DrawerSelect
                        id="create-property-referred-contact"
                        value="Jerome Bell"
                        onChange={() => {}}
                        options={['Jerome Bell', 'Henry Micheal']}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-[#e6e6e7]" />

                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-base font-bold leading-6 text-[#262527]">Contact Details</p>
                    <p className="mt-1 text-sm leading-5 text-[#6a6a70]">
                      Please add the contact against following label
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-none border border-[#e6e6e7]">
                    <div className="grid grid-cols-[172px_1fr]">
                      <div className="border-r border-[#e6e6e7] bg-[#f9f9f9] px-6 py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]">
                        Contact Title
                      </div>
                      <div className="bg-[#f9f9f9] px-6 py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]">
                        Users
                      </div>
                      {contactRoles.map((role, index) => (
                        <div key={role.label} className="contents">
                          <div className="flex items-center border-r border-t border-[#e6e6e7] px-6 py-4">
                            <span className={`text-xs font-medium leading-[18px] ${role.color}`}>{role.label}</span>
                          </div>
                          <div className="border-t border-[#e6e6e7] px-6 py-2">
                            <div className="relative">
                              <select
                                defaultValue={index === 0 ? 'Henry Micheal' : ''}
                                className={`h-9 w-full appearance-none rounded-lg border border-[#e6e6e7] bg-white px-3.5 text-sm leading-5 outline-none ${
                                  index === 0 ? 'text-[#262527]' : 'text-[#ccc]'
                                }`}
                              >
                                <option value="">Select Contact</option>
                                <option value="Henry Micheal">Henry Micheal henrymicheal23@signal.com</option>
                                <option value="Jerome Bell">Jerome Bell</option>
                              </select>
                              <span className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2" aria-hidden>
                                <img alt="" className="block size-full max-w-none" src={questionsChevronDown} />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-[#e6e6e7]" />

                <div className="flex flex-col gap-4 pb-4">
                  <p className="text-base font-bold leading-6 text-[#262527]">Address</p>
                  <div className="flex flex-col gap-1.5">
                    <DrawerLabel required>Address</DrawerLabel>
                    <div className="flex h-11 items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5">
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
                  <div className="relative h-[270px] overflow-hidden rounded-lg border border-[#e6e6e7]">
                    <img alt="" className="size-full object-cover" src={createPropertyMap} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <DrawerLabel>Address Notes</DrawerLabel>
                    <textarea
                      id="create-property-address-notes"
                      value={addressNotes}
                      onChange={(event) => setAddressNotes(event.target.value)}
                      placeholder="e.g. blue building next to the pharmacy, enter from the rear gate"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2.5 text-base leading-6 text-[#262527] outline-none placeholder:text-[#ccc]"
                    />
                  </div>
                </div>
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
                onClick={() => {
                  window.alert('Property created (prototype)')
                  onClose()
                }}
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
