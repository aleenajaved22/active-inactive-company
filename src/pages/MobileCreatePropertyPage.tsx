import { useRef, useState } from 'react'
import createPropertyMap from '../assets/create-property-map.png'
import {
  affiliationOptions,
  assigneeOptions,
  associatedFranchiseOptions,
  companyOptions,
  contactOptions,
  contactRoles,
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
  OCCUPANCY_DESCRIPTION,
  OCCUPANCY_LABEL,
  OCCUPANCY_PLACEHOLDERS,
  OCCUPANCY_TOOLTIPS,
  TILL_DATE_TOOLTIP,
} from '../data/companyAtPropertyCopy'
import { buildOccupants } from '../data/companyAssociation'
import { validateOccupancy } from '../data/propertyOccupancy'
import { initialSpaceAssociations } from '../data/propertySpaceAssociations'
import { companyParents, suiteUnitTypes, type SpaceType } from '../data/propertySpaces'
import { MobileActionFooter, MOBILE_ACTION_FOOTER_HEIGHT } from '../mobile/MobileActionFooter'
import {
  MobileCheckbox,
  MobileChoiceChips,
  MobileFieldHint,
  MobileSectionHeading,
  MobileSelectField,
  MobileSuiteUnitField,
  MobileTextAreaField,
  MobileTextField,
} from '../mobile/MobileFields'
import { MobileCreateCompanyScreen } from '../mobile/MobileCreateCompanyScreen'
import { MobileFrame } from '../mobile/MobileFrame'
import { IconAdd, IconCalendar, IconExpand, IconMyLocation } from '../mobile/MobileIcons'
import { MobilePageHeader } from '../mobile/MobilePageHeader'

const ASSIGNEE_ID = 'mobile-create-property-assignee'

type MobileCreatePropertyPageProps = {
  onBack?: () => void
  onSubmit?: () => void
}

/**
 * Sections, field set, required fields, defaults and validation follow the web
 * app's Create Property drawer; only the chrome is mobile.
 */
export function MobileCreatePropertyPage({ onBack, onSubmit }: MobileCreatePropertyPageProps) {
  const [address, setAddress] = useState('')
  const [addressNotes, setAddressNotes] = useState('')
  const [propertyName, setPropertyName] = useState('')
  const [propertySource, setPropertySource] = useState(propertySourceOptions[0])
  const [franchise, setFranchise] = useState(associatedFranchiseOptions[0])
  const [hubspotStage, setHubspotStage] = useState('')
  const [affiliations, setAffiliations] = useState<Set<string>>(new Set<string>(defaultAffiliations))
  const [company, setCompany] = useState('Costco Wholesale')
  const [parentCompany, setParentCompany] = useState(companyParents['Costco Wholesale'] ?? '')
  const [cutOffDate, setCutOffDate] = useState('')
  const [floor, setFloor] = useState('')
  const [suiteUnitType, setSuiteUnitType] = useState<SpaceType | ''>('Suite')
  const [suiteUnitNumber, setSuiteUnitNumber] = useState('')
  const [assignee, setAssignee] = useState('')
  const [assignSupervisor, setAssignSupervisor] = useState(false)
  const [supervisor, setSupervisor] = useState('')
  const [contacts, setContacts] = useState<Record<string, string>>({ 'Decision Maker': 'Henry Micheal' })
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [createCompanyOpen, setCreateCompanyOpen] = useState(false)

  const spaceFieldRef = useRef<HTMLDivElement>(null)
  const suiteUnitNumberRef = useRef<HTMLInputElement>(null)

  const toggleAffiliation = (option: string) => {
    setAffiliations((prev) => {
      const next = new Set(prev)
      if (next.has(option)) next.delete(option)
      else next.add(option)
      return next
    })
  }

  const selectCompany = (value: string) => {
    setCompany(value)
    setParentCompany(companyParents[value] ?? '')
  }

  // Format, duplicate and already-occupied checks, shared with the web drawer.
  const occupancy = validateOccupancy({
    value: { floor, suiteUnitType, suiteUnitNumber },
    occupants: buildOccupants(initialSpaceAssociations),
  })
  const floorError = occupancy.floorError
  const suiteUnitError = occupancy.suiteUnitError
  const spaceConflict = occupancy.hasErrors
  const assigneeError = submitAttempted && !assignee ? 'Select an assignee.' : null

  const handleSubmit = () => {
    setSubmitAttempted(true)
    if (!assignee) {
      const field = document.getElementById(ASSIGNEE_ID)
      field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      field?.focus()
      return
    }
    if (spaceConflict) {
      spaceFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (suiteUnitError) suiteUnitNumberRef.current?.focus()
      return
    }
    onSubmit?.()
  }

  return (
    <MobileFrame caption="Mobile — Create property">
      <div className="relative size-full overflow-hidden bg-white">
        <div
          className="no-scrollbar absolute inset-0 overflow-y-auto"
          style={{ paddingTop: 100, paddingBottom: MOBILE_ACTION_FOOTER_HEIGHT + 24 }}
        >
          <div className="flex flex-col gap-6 px-4 pt-5">
            {/* Address */}
            <section className="flex flex-col gap-3">
              <MobileSectionHeading>Address</MobileSectionHeading>
              <MobileTextField
                label="Address"
                required
                value={address}
                onChange={setAddress}
                placeholder="Type Address"
              />
              <MobileTextAreaField
                label="Address Description"
                value={addressNotes}
                onChange={setAddressNotes}
                placeholder="e.g. blue building next to the pharmacy, enter from the rear gate"
              />
              <div className="relative h-60 overflow-hidden rounded-lg border border-[#146dff]">
                <img alt="" className="size-full object-cover" src={createPropertyMap} />
                <div className="absolute bottom-3 right-3 flex flex-col gap-2">
                  <button
                    type="button"
                    aria-label="Use current location"
                    className="flex size-10 items-center justify-center rounded-full bg-white text-[#4d4d51] shadow-[0px_4px_12px_rgba(0,0,0,0.12)]"
                  >
                    <IconMyLocation size={20} />
                  </button>
                  <button
                    type="button"
                    aria-label="Expand map"
                    className="flex size-10 items-center justify-center rounded-full bg-white text-[#4d4d51] shadow-[0px_4px_12px_rgba(0,0,0,0.12)]"
                  >
                    <IconExpand size={20} />
                  </button>
                </div>
              </div>
            </section>

            {/* Property Details */}
            <section className="flex flex-col gap-3">
              <MobileSectionHeading>Property Details</MobileSectionHeading>
              <MobileTextField
                label="Location / Property Name"
                value={propertyName}
                onChange={setPropertyName}
                placeholder="Add Location / Property Name"
              />
              <MobileSelectField
                label="Property Source"
                required
                value={propertySource}
                onChange={setPropertySource}
                options={propertySourceOptions}
              />
              <MobileSelectField
                label="Associated Franchise"
                value={franchise}
                onChange={setFranchise}
                options={associatedFranchiseOptions}
              />
              <MobileSelectField
                label={HUBSPOT_STAGE_LABEL}
                required
                value={hubspotStage}
                onChange={setHubspotStage}
                options={hubspotStageOptions}
                placeholder="Choose Stage"
              />
              <div className="flex flex-col gap-2 pt-1">
                <span className="px-1 text-xs leading-4 text-[#4d4d51]">Affiliation</span>
                <MobileChoiceChips
                  options={affiliationOptions as readonly Affiliation[]}
                  selected={affiliations}
                  onToggle={toggleAffiliation}
                />
              </div>
            </section>

            {/* Company */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <MobileSectionHeading>Company</MobileSectionHeading>
                <button
                  type="button"
                  onClick={() => setCreateCompanyOpen(true)}
                  className="flex items-center gap-1 text-sm font-medium leading-5 text-[#146dff]"
                >
                  <IconAdd size={18} />
                  Create New
                </button>
              </div>
              <MobileSelectField
                label="Company"
                required
                value={company}
                onChange={selectCompany}
                options={companyOptions}
              />
              <div className="flex items-center gap-1.5 px-4">
                <span className="text-xs leading-[18px] text-[#86868b]">
                  Strategic Partnership Status:
                </span>
                <span className="rounded-2xl bg-[#eff8ef] px-2 py-0.5 text-xs font-medium leading-[18px] text-[#2e964b]">
                  SP - Active
                </span>
              </div>
              <MobileSelectField
                label="Parent Company"
                value={parentCompany}
                onChange={setParentCompany}
                options={parentCompanyOptions}
                placeholder="Select parent company"
              />
              <div className="flex flex-col gap-1">
                <label className="relative flex h-[62px] w-full items-center gap-0.5 rounded-lg bg-[#f6f6f8] px-4 py-3">
                  <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                    <span className="text-xs leading-4 text-[#4d4d51]">
                      {COMPANY_AT_PROPERTY.tillDateLabel}
                    </span>
                    <input
                      type="date"
                      value={cutOffDate}
                      onChange={(event) => setCutOffDate(event.target.value)}
                      className={`w-full bg-transparent text-[15px] font-medium leading-5 outline-none [&::-webkit-calendar-picker-indicator]:opacity-0 ${
                        cutOffDate ? 'text-black' : 'text-[#86868b]'
                      }`}
                    />
                  </span>
                  <IconCalendar size={20} className="pointer-events-none text-[#5b5b5f]" />
                </label>
                <MobileFieldHint>{TILL_DATE_TOOLTIP}</MobileFieldHint>
              </div>
              <div ref={spaceFieldRef} className="flex flex-col gap-2 pt-1">
                <span className="px-1 text-xs leading-4 text-[#4d4d51]">{OCCUPANCY_LABEL}</span>
                <MobileFieldHint>{OCCUPANCY_DESCRIPTION}</MobileFieldHint>
                <MobileTextField
                  label="Floor"
                  value={floor}
                  onChange={setFloor}
                  placeholder={OCCUPANCY_PLACEHOLDERS.floor}
                  error={floorError}
                />
                <MobileFieldHint>{OCCUPANCY_TOOLTIPS.floor}</MobileFieldHint>
                <MobileSuiteUnitField
                  typeValue={suiteUnitType}
                  onTypeChange={(value) => setSuiteUnitType(value as SpaceType)}
                  typeOptions={suiteUnitTypes}
                  numberValue={suiteUnitNumber}
                  onNumberChange={setSuiteUnitNumber}
                  numberRef={suiteUnitNumberRef}
                  error={suiteUnitError}
                />
                <MobileFieldHint>{OCCUPANCY_TOOLTIPS.suiteUnit}</MobileFieldHint>
              </div>
            </section>

            {/* Assign to */}
            <section className="flex flex-col gap-3">
              <MobileSectionHeading>Assign to</MobileSectionHeading>
              <MobileSelectField
                id={ASSIGNEE_ID}
                label="Assignee"
                required
                value={assignee}
                onChange={setAssignee}
                options={assigneeOptions}
                placeholder="Select Assignee"
                error={assigneeError}
              />
              <MobileCheckbox
                checked={assignSupervisor}
                onChange={(checked) => {
                  setAssignSupervisor(checked)
                  if (!checked) setSupervisor('')
                }}
              >
                Assign Supervisor
              </MobileCheckbox>
              {assignSupervisor && (
                <MobileSelectField
                  label="Supervisor"
                  value={supervisor}
                  onChange={setSupervisor}
                  options={supervisorOptions}
                  placeholder="Select Supervisor"
                />
              )}
            </section>

            {/* Associated Contacts */}
            <section className="flex flex-col gap-3">
              <MobileSectionHeading>Associated Contacts</MobileSectionHeading>
              {contactRoles.map((role) => (
                <MobileSelectField
                  key={role.label}
                  label={role.label}
                  value={contacts[role.label] ?? ''}
                  onChange={(value) => setContacts((prev) => ({ ...prev, [role.label]: value }))}
                  options={contactOptions}
                  placeholder="Select Contact"
                />
              ))}
            </section>
          </div>
        </div>

        <MobilePageHeader title="Create Property" onBack={onBack} />
        <MobileActionFooter label="Send Request" onClick={handleSubmit} />

        {createCompanyOpen && (
          <MobileCreateCompanyScreen
            onClose={() => setCreateCompanyOpen(false)}
            onCreate={() => {
              window.alert('Company created (prototype)')
              setCreateCompanyOpen(false)
            }}
          />
        )}
      </div>
    </MobileFrame>
  )
}
