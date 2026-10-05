import { useMemo, useState } from 'react'
import { propertyAffiliationOptions, type PropertyAffiliation } from '../components/switchCompanyTypes'
import {
  deriveSpaceKey,
  describeSpaceInput,
  validateAssociationForm,
} from '../data/companyAssociation'
import { formatShortDate } from '../data/dateFormat'
import { propertyCompanies } from '../data/propertyCompanies'
import { suiteUnitTypes } from '../data/propertySpaces'
import type { SwitchCompanyFormValues, SwitchCompanySubmitPayload, SwitchSpaceOption } from '../components/switchCompanyTypes'
import { MobileActionFooter, MOBILE_ACTION_FOOTER_HEIGHT } from './MobileActionFooter'
import { MobileCompanyPickerSheet } from './MobileCompanyPickerSheet'
import {
  MobileChoiceChips,
  MobileDateField,
  MobileFieldError,
  MobileFieldHint,
  MobilePickerField,
  MobileSectionHeading,
  MobileSuiteUnitField,
  MobileTextField,
} from './MobileFields'
import { MobilePageHeader } from './MobilePageHeader'
import { MobileSheet } from './MobileSheet'

/** Splits a locked space ("Suite|210" plus its floor) into the Floor / Suite-Unit fields. */
function lockedSpaceFields(space: SwitchSpaceOption) {
  const [type, number = ''] = space.key.split('|')
  if (type === 'Floor') return { floor: number, suiteUnitType: '', suiteUnitNumber: '' }
  if (type === 'Flat') {
    return { floor: space.floor ?? '', suiteUnitType: 'Apartment', suiteUnitNumber: number }
  }
  return { floor: space.floor ?? '', suiteUnitType: type, suiteUnitNumber: number }
}

export type SwitchCompanyMode = 'add' | 'switch' | 'make-active' | 'edit'

type MobileSwitchCompanyScreenProps = {
  mode: SwitchCompanyMode
  spaces: SwitchSpaceOption[]
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
  const [effectiveDate, setEffectiveDate] = useState(initialForm?.effectiveDate ?? '')
  const [cutOffDate, setCutOffDate] = useState(initialForm?.cutOffDate ?? '')
  const [affiliations, setAffiliations] = useState<Set<string>>(
    new Set<string>(initialForm?.affiliations ?? []),
  )
  const prefillSpace = isMakeActive
    ? spaces.find((space) => space.key === initialSpaceKey)
    : undefined
  const [spaceFields, setSpaceFields] = useState(
    prefillSpace
      ? lockedSpaceFields(prefillSpace)
      : { floor: '', suiteUnitType: 'Suite', suiteUnitNumber: '' },
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
    ? 'Edit switch'
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
  })
  const showErrors = submitAttempted

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
  })

  const submit = () => {
    setSubmitAttempted(true)
    if (errors.hasErrors) return
    // Editing a pending switch saves straight away; creating one confirms first.
    if (isEditMode) {
      onConfirm(payload())
      onClose()
      return
    }
    setConfirmOpen(true)
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-white">
      <div
        className="no-scrollbar absolute inset-0 overflow-y-auto"
        style={{ paddingTop: 100, paddingBottom: MOBILE_ACTION_FOOTER_HEIGHT + 24 }}
      >
        <div className="flex flex-col gap-5 px-4 pt-5">
          <p className="text-sm leading-5 text-[#6a6a70]">
            {isEditMode
              ? 'You can edit this switch until the effective date.'
              : 'You can edit these details until the effective date.'}
          </p>

          <section className="flex flex-col gap-2">
            <MobilePickerField
              label="Company"
              required
              value={selectedCompany?.name ?? ''}
              placeholder="Search by company name"
              onOpen={() => setPickerOpen(true)}
              error={showErrors ? errors.companyError : null}
            />
            <MobileFieldHint>
              The company that should be associated with this property.
            </MobileFieldHint>
          </section>

          <section className="flex flex-col gap-2">
            <MobileSectionHeading>Property Occupancy</MobileSectionHeading>
            <MobileFieldHint>
              The floor, suite, unit or apartment for this company.
            </MobileFieldHint>
            <MobileTextField
              label="Floor"
              value={fields.floor}
              disabled={Boolean(lockedFields)}
              onChange={(floor) => setSpaceFields((prev) => ({ ...prev, floor }))}
              placeholder="5"
              inputMode="numeric"
            />
            <MobileSuiteUnitField
              typeValue={fields.suiteUnitType || 'Suite'}
              onTypeChange={(suiteUnitType) => setSpaceFields((prev) => ({ ...prev, suiteUnitType }))}
              typeOptions={suiteUnitTypes}
              numberValue={fields.suiteUnitNumber}
              onNumberChange={(suiteUnitNumber) =>
                setSpaceFields((prev) => ({ ...prev, suiteUnitNumber }))
              }
              disabled={Boolean(lockedFields)}
            />
            {lockedFields && selectedSpace?.currentCompanyName && (
              <MobileFieldHint>Current: {selectedSpace.currentCompanyName}</MobileFieldHint>
            )}
            {(showErrors || errors.occupied) && errors.spaceError && (
              <MobileFieldError>{errors.spaceError}</MobileFieldError>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <MobileDateField
              label="Company Effective Date"
              required
              value={effectiveDate}
              onChange={setEffectiveDate}
              error={showErrors ? errors.effectiveDateError : null}
            />
            <MobileFieldHint>
              On the Effective Date, this property is associated with the selected company and
              becomes active. A new company cannot be associated while the current company has
              active contracts
            </MobileFieldHint>
            <MobileDateField
              label="Company at property till date"
              value={cutOffDate}
              onChange={setCutOffDate}
              error={showErrors ? errors.endDateError : null}
            />
            <MobileFieldHint>
              Optional. The selected company stays at this property until this date, then is
              dissociated.
            </MobileFieldHint>
          </section>

          <section className="flex flex-col gap-2">
            <MobileSectionHeading>Property Affiliation</MobileSectionHeading>
            <MobileFieldHint>
              Select one or more affiliation types that apply to this property
            </MobileFieldHint>
            <MobileChoiceChips
              options={propertyAffiliationOptions}
              selected={affiliations}
              onToggle={toggleAffiliation}
            />
          </section>

          {isEditMode && associationId && onRevertPending && (
            <div className="mt-2 border-t border-[#e6e6e7] pt-4">
              <button
                type="button"
                onClick={() => setRevertOpen(true)}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[#fbeeed] text-base font-medium leading-5 text-[#b32318]"
              >
                Revert change
              </button>
              <p className="pt-2 text-center text-xs leading-4 text-[#86868b]">
                Removes the pending switch from this property.
              </p>
            </div>
          )}
        </div>
      </div>

      <MobilePageHeader title={actionLabel} onBack={onClose} />
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
            <span className="font-medium text-[#262527]">{selectedCompany?.name}</span> will take
            over{' '}
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

      <MobileSheet open={revertOpen} onClose={() => setRevertOpen(false)} title="Revert change?">
        <div className="flex flex-col gap-4 px-4 pb-8">
          <p className="text-sm leading-5 text-[#6a6a70]">
            This will remove the pending company association from this property. You can switch
            company again later if needed.
          </p>
          <button
            type="button"
            onClick={() => {
              if (associationId) onRevertPending?.(associationId)
              setRevertOpen(false)
              onClose()
            }}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#b32318] text-base font-medium leading-5 text-white"
          >
            Revert change
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
  )
}
