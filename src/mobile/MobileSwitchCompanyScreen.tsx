import { useMemo, useState } from 'react'
import { propertyAffiliationOptions, type PropertyAffiliation } from '../components/switchCompanyTypes'
import { deriveSpaceKey, describeSpaceInput, validateAssociationForm } from '../data/companyAssociation'
import {
  COMPANY_AT_PROPERTY,
  EFFECTIVE_DATE_DESCRIPTION,
  TILL_DATE_DESCRIPTION,
  DISCARD_SWITCH,
} from '../data/companyAtPropertyCopy'
import type { OccupantSpaces } from '../data/propertyOccupancy'
import { formatShortDate, todayMMDDYYYY } from '../data/dateFormat'
import { propertyCompanies } from '../data/propertyCompanies'
import { MobileAssigneeFields, emptyMobileAssignee, type MobileAssigneeValue } from './MobileAssigneeFields'
import type {
  SwitchCompanyFormValues,
  SwitchCompanySubmitPayload,
  SwitchSpaceOption,
} from '../components/switchCompanyTypes'
import { MobileActionFooter, MOBILE_ACTION_FOOTER_HEIGHT } from './MobileActionFooter'
import { MobileCompanyPickerSheet } from './MobileCompanyPickerSheet'
import { GuideBar, GuideProvider, GuideTarget, type GuideStep } from './MobileFieldGuide'
import { occupancyGuideSteps } from './guideSteps'
import { MobileOccupancyFields } from './MobileOccupancyFields'
import {
  MobileChoiceChips,
  MobileDateField,
  MobileFieldError,
  MobileFieldHint,
  MobileGroupLabel,
  MobilePickerField,
  MobileTextField,
} from './MobileFields'
import { MobilePageHeader } from './MobilePageHeader'
import { MobileSheet } from './MobileSheet'

/** Splits a locked space ("Suite|210" plus its floor) into the Floor / Suite-Unit fields. */
function lockedSpaceFields(space: SwitchSpaceOption) {
  const [type, number = ''] = space.key.split('|')
  if (type === 'Floor') return { floor: number, suiteUnitType: '', suiteUnitNumber: '' }
  if (type === 'Flat') {
    return {
      floor: space.floor ?? '',
      suiteUnitType: 'Apartment',
      suiteUnitNumber: number,
    }
  }
  return {
    floor: space.floor ?? '',
    suiteUnitType: type,
    suiteUnitNumber: number,
  }
}

export type SwitchCompanyMode = 'add' | 'switch' | 'make-active' | 'edit'

type MobileSwitchCompanyScreenProps = {
  mode: SwitchCompanyMode
  spaces: SwitchSpaceOption[]
  /** Everyone already on the property, so occupancy can be checked against them. */
  occupants?: OccupantSpaces[]
  /** Pre-selects and locks the space, e.g. switching from a company's row. */
  initialSpaceKey?: string
  /** Pre-selects the company, e.g. making a past company active again. */
  targetCompanyId?: string
  initialForm?: SwitchCompanyFormValues
  associationId?: string
  onClose: () => void
  onConfirm: (payload: SwitchCompanySubmitPayload) => void
  onRevertPending?: (associationId: string) => void
  onCreateCompany: () => void
}

/**
 * The web app's Switch Company modal as a full screen. One screen covers all
 * four of its modes, so the rules cannot diverge between platforms.
 */
export function MobileSwitchCompanyScreen({
  mode,
  spaces,
  occupants = [],
  initialSpaceKey,
  targetCompanyId,
  initialForm,
  associationId,
  onClose,
  onConfirm,
  onRevertPending,
  onCreateCompany,
}: MobileSwitchCompanyScreenProps) {
  const isEditMode = mode === 'edit'
  const isMakeActive = mode === 'make-active'
  const isAddMode = mode === 'add'
  const spaceLocked = isEditMode || (Boolean(initialSpaceKey) && !isMakeActive)

  const [spaceKey] = useState(initialForm?.spaceKey ?? initialSpaceKey ?? '')
  const [companyId, setCompanyId] = useState(initialForm?.companyId ?? targetCompanyId ?? '')
  const [effectiveDate, setEffectiveDate] = useState(initialForm?.effectiveDate ?? todayMMDDYYYY())
  const [cutOffDate, setCutOffDate] = useState(initialForm?.cutOffDate ?? '')
  const [affiliations, setAffiliations] = useState<Set<string>>(
    new Set<string>(initialForm?.affiliations ?? []),
  )
  const prefillSpace = isMakeActive ? spaces.find((space) => space.key === initialSpaceKey) : undefined
  const [spaceFields, setSpaceFields] = useState(
    prefillSpace
      ? lockedSpaceFields(prefillSpace)
      : { floor: '', suiteUnitType: 'Suite', suiteUnitNumber: '' },
  )
  const [assignee, setAssignee] = useState<MobileAssigneeValue>(() =>
    initialForm?.assignee
      ? {
          assignee: initialForm.assignee,
          assignSupervisor: Boolean(initialForm.supervisor),
          supervisor: initialForm.supervisor ?? '',
        }
      : emptyMobileAssignee(),
  )
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [revertOpen, setRevertOpen] = useState(false)

  const selectedCompany = useMemo(
    () => propertyCompanies.find((company) => company.id === companyId),
    [companyId],
  )
  const selectedSpace = spaces.find((space) => space.key === spaceKey)
  const effectiveSpaceKey = spaceLocked ? spaceKey : deriveSpaceKey(spaceFields)

  // The row action that opens this calls it "Edit switch"; a bare "Edit" as a
  // screen title does not say what is being edited.
  const actionLabel = isEditMode
    ? 'Edit Switch'
    : isAddMode
      ? 'Add company'
      : isMakeActive
        ? 'Make active'
        : 'Switch company'

  const errors = validateAssociationForm({
    spaces,
    spaceKey,
    effectiveSpaceKey,
    spaceLocked,
    isEditMode,
    isMakeActive,
    companyId,
    companyName: selectedCompany?.name,
    effectiveDate,
    cutOffDate,
    spaceFields,
    occupants,
    affiliations: [...affiliations],
  })
  const showErrors = submitAttempted
  const assigneeError = submitAttempted && !assignee.assignee ? 'Select an assignee.' : null

  const lockedFields = spaceLocked && selectedSpace ? lockedSpaceFields(selectedSpace) : null
  const fields = lockedFields ?? spaceFields

  const toggleAffiliation = (label: string) => {
    setAffiliations((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const payload = (): SwitchCompanySubmitPayload => ({
    mode: isEditMode ? 'edit' : 'switch',
    associationId: isEditMode ? associationId : undefined,
    spaceKey: effectiveSpaceKey,
    companyId,
    effectiveDate,
    cutOffDate,
    affiliations: [...affiliations] as PropertyAffiliation[],
    assignee: assignee.assignee,
    supervisor: assignee.assignSupervisor ? assignee.supervisor : undefined,
  })

  const submit = () => {
    setSubmitAttempted(true)
    if (errors.hasErrors || !assignee.assignee) return
    // Editing a pending switch saves straight away; creating one confirms first.
    if (isEditMode) {
      onConfirm(payload())
      onClose()
      return
    }
    setConfirmOpen(true)
  }

  const guideSteps: GuideStep[] = [
    {
      id: 'company',
      title: 'Company',
      text: isMakeActive
        ? 'This company is being made active again on this property'
        : 'Select the company that should be associated with this property',
    },
    ...occupancyGuideSteps,
    { id: 'effective-date', title: COMPANY_AT_PROPERTY.effectiveDateLabel, text: EFFECTIVE_DATE_DESCRIPTION },
    { id: 'till-date', title: COMPANY_AT_PROPERTY.tillDateLabel, text: TILL_DATE_DESCRIPTION },
    {
      id: 'affiliation',
      title: 'Property Affiliation',
      text: 'Select one or more affiliation types that apply to this property',
    },
    {
      id: 'assignee',
      title: 'Assign to',
      text: 'Every property and company needs an assignee. Add a supervisor when one is needed',
    },
  ]

  return (
    <GuideProvider steps={guideSteps}>
      <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-white">
        <div
          className="no-scrollbar absolute inset-0 overflow-y-auto"
          style={{
            paddingTop: 100,
            paddingBottom: MOBILE_ACTION_FOOTER_HEIGHT + 104,
          }}
        >
          <div className="flex flex-col gap-5 px-4 pt-4">
            <GuideTarget id="company">
              {isMakeActive ? (
                <MobileTextField
                  label="Company"
                  required
                  disabled
                  value={selectedCompany?.name ?? ''}
                  onChange={() => {}}
                />
              ) : (
                <MobilePickerField
                  label="Company"
                  required
                  value={selectedCompany?.name ?? ''}
                  placeholder="Search by company name"
                  onOpen={() => setPickerOpen(true)}
                  error={showErrors ? errors.companyError : null}
                />
              )}
            </GuideTarget>

            <MobileOccupancyFields
              compact
              value={fields}
              disabled={Boolean(lockedFields)}
              onChange={(next) => setSpaceFields(next)}
              floorError={showErrors ? errors.floorError : null}
              suiteUnitError={showErrors ? errors.suiteUnitError : null}
            >
              {lockedFields && selectedSpace?.currentCompanyName && (
                <MobileFieldHint>Current: {selectedSpace.currentCompanyName}</MobileFieldHint>
              )}
              {showErrors && errors.spaceError && <MobileFieldError>{errors.spaceError}</MobileFieldError>}
            </MobileOccupancyFields>

            <GuideTarget id="effective-date">
              <MobileDateField
                label={COMPANY_AT_PROPERTY.effectiveDateLabel}
                required
                value={effectiveDate}
                onChange={setEffectiveDate}
                error={showErrors ? errors.effectiveDateError : null}
              />
            </GuideTarget>

            <GuideTarget id="till-date">
              <MobileDateField
                label={COMPANY_AT_PROPERTY.tillDateLabel}
                value={cutOffDate}
                onChange={setCutOffDate}
                error={showErrors ? errors.endDateError : null}
              />
            </GuideTarget>

            <GuideTarget id="affiliation">
              <div className="flex flex-col gap-2">
                <MobileGroupLabel>Property Affiliation *</MobileGroupLabel>
                <MobileChoiceChips
                  options={propertyAffiliationOptions}
                  selected={affiliations}
                  onToggle={toggleAffiliation}
                />
                {showErrors && errors.affiliationError && (
                  <MobileFieldError>{errors.affiliationError}</MobileFieldError>
                )}
              </div>
            </GuideTarget>

            <GuideTarget id="assignee">
              <div className="flex flex-col gap-2">
                <MobileGroupLabel>Assign to</MobileGroupLabel>
                <MobileAssigneeFields value={assignee} onChange={setAssignee} error={assigneeError} />
              </div>
            </GuideTarget>

            {isEditMode && associationId && onRevertPending && (
              <button
                type="button"
                onClick={() => setRevertOpen(true)}
                className="mt-1 flex h-12 w-full items-center justify-center rounded-lg bg-[#fbeeed] text-base font-medium leading-5 text-[#b32318]"
              >
                {DISCARD_SWITCH.action}
              </button>
            )}
          </div>
        </div>

        <MobilePageHeader title={actionLabel} onBack={onClose} />
        <GuideBar
          className="absolute inset-x-4 z-10 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
          style={{ bottom: MOBILE_ACTION_FOOTER_HEIGHT + 10 }}
        />
        <MobileActionFooter label={isEditMode ? 'Update' : actionLabel} onClick={submit} />

        <MobileCompanyPickerSheet
          open={pickerOpen}
          selectedId={companyId}
          onSelect={setCompanyId}
          onClose={() => setPickerOpen(false)}
          onCreateCompany={() => {
            setPickerOpen(false)
            onCreateCompany()
          }}
        />

        {/* Creating a pending association changes who holds the space, so it confirms. */}
        <MobileSheet open={confirmOpen} onClose={() => setConfirmOpen(false)} title={`${actionLabel}?`}>
          <div className="flex flex-col gap-4 px-4 pb-8">
            <p className="text-sm leading-5 text-[#6a6a70]">
              <span className="font-medium text-[#262527]">{selectedCompany?.name}</span> will take over{' '}
              <span className="font-medium text-[#262527]">
                {selectedSpace?.label ?? describeSpaceInput(spaceFields)}
              </span>{' '}
              on {formatShortDate(effectiveDate)}.
              {selectedSpace?.currentCompanyName
                ? ` ${selectedSpace.currentCompanyName} stays active until then.`
                : ''}{' '}
              Do you want to continue?
            </p>
            <button
              type="button"
              onClick={() => {
                onConfirm(payload())
                setConfirmOpen(false)
                onClose()
              }}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#146dff] text-base font-medium leading-5 text-white"
            >
              {actionLabel}
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f6f6f8] text-base font-medium leading-5 text-[#444446]"
            >
              Cancel
            </button>
          </div>
        </MobileSheet>

        <MobileSheet open={revertOpen} onClose={() => setRevertOpen(false)} title={DISCARD_SWITCH.heading}>
          <div className="flex flex-col gap-4 px-4 pb-8">
            <p className="text-sm leading-5 text-[#6a6a70]">{DISCARD_SWITCH.body}</p>
            <button
              type="button"
              onClick={() => {
                if (associationId) onRevertPending?.(associationId)
                setRevertOpen(false)
                onClose()
              }}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#b32318] text-base font-medium leading-5 text-white"
            >
              {DISCARD_SWITCH.confirm}
            </button>
            <button
              type="button"
              onClick={() => setRevertOpen(false)}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f6f6f8] text-base font-medium leading-5 text-[#444446]"
            >
              Cancel
            </button>
          </div>
        </MobileSheet>
      </div>
    </GuideProvider>
  )
}
