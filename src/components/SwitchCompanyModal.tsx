import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import modalClose from '../assets/modal-close.svg'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import detailPlus from '../assets/detail-plus.svg'
import tableAlertCircleWarn from '../assets/table-alert-circle-warn.svg'
import { AffiliationSelect } from './AffiliationSelect'
import { CreateCompanyModal } from './CreateCompanyModal'
import { InfoTooltip } from './InfoTooltip'
import { ModalDateInput } from './ModalDateInput'
import {
  deriveSpaceKey,
  describeSpaceInput,
  validateAssociationForm,
} from '../data/companyAssociation'
import {
  COMPANY_AT_PROPERTY,
  DISCARD_SWITCH,
  EFFECTIVE_DATE_DESCRIPTION,
  OCCUPANCY_DESCRIPTION,
  OCCUPANCY_LABEL,
  TILL_DATE_DESCRIPTION,
} from '../data/companyAtPropertyCopy'
import type { OccupantSpaces } from '../data/propertyOccupancy'
import { formatShortDate, todayMMDDYYYY } from '../data/dateFormat'
import { propertyCompanies } from '../data/propertyCompanies'
import { AssigneeFields, emptyAssignee, type AssigneeValue } from './AssigneeFields'
import { SpaceFields, emptySpaceFields, type SpaceFieldsValue } from './PropertySpaceFields'
import {
  type PropertyAffiliation,
  type SwitchCompanyFormValues,
  type SwitchCompanySubmitPayload,
  type SwitchSpaceOption,
} from './switchCompanyTypes'

type SwitchCompanyModalProps = {
  open: boolean
  mode?: 'switch' | 'edit'
  spaces: SwitchSpaceOption[]
  /** Everyone already on the property, so occupancy can be checked against them. */
  occupants?: OccupantSpaces[]
  /** Pre-selects and locks the space, e.g. when switching from a company's row menu. */
  initialSpaceKey?: string
  /** Pre-selects the company to switch to when opening in switch mode. */
  targetCompanyId?: string
  initialForm?: SwitchCompanyFormValues
  initialCreateCompany?: boolean
  associationId?: string
  onClose: () => void
  onConfirm: (payload: SwitchCompanySubmitPayload) => void
  onRevertPending?: (associationId: string) => void
  onFlowChange?: (flow: 'switch-company' | 'create-company' | null) => void
}

function ModalFormRow({
  label,
  description,
  required,
  stacked,
  children,
}: {
  label: string
  description: string
  required?: boolean
  /** Puts the fields under the label at full width, for rows that need more room. */
  stacked?: boolean
  children: ReactNode
}) {
  return (
    <div className={`grid gap-x-8 gap-y-3 py-5 ${stacked ? 'grid-cols-1' : 'grid-cols-2'}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold leading-5 text-[#262527]">
            {label}
            {required && <span className="text-[#b32318]"> *</span>}
          </p>
          <InfoTooltip label={`${label} information`} text={description} />
        </div>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function ModalFieldError({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-sm leading-5 text-[#b32318]">
      <span className="relative mt-0.5 size-4 shrink-0" aria-hidden>
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableAlertCircleWarn} />
      </span>
      <span>{children}</span>
    </p>
  )
}

/** Splits a locked space ("Suite|210" plus its floor) into the Floor / Suite-Unit-Apartment fields. */
function lockedSpaceFields(space: SwitchSpaceOption): SpaceFieldsValue {
  const [type, number = ''] = space.key.split('|')
  const fields = emptySpaceFields()
  if (type === 'Floor') return { ...fields, floor: number, suiteUnitType: '', suiteUnitNumber: '' }
  if (type === 'Flat') {
    return { ...fields, floor: space.floor ?? '', suiteUnitType: 'Apartment', suiteUnitNumber: number }
  }
  return { ...fields, floor: space.floor ?? '', suiteUnitType: type as SpaceFieldsValue['suiteUnitType'], suiteUnitNumber: number }
}

export function SwitchCompanyModal({
  open,
  mode = 'switch',
  spaces,
  occupants = [],
  initialSpaceKey,
  targetCompanyId,
  initialForm,
  initialCreateCompany = false,
  associationId,
  onClose,
  onConfirm,
  onRevertPending,
  onFlowChange,
}: SwitchCompanyModalProps) {
  const isEditMode = mode === 'edit'
  const [query, setQuery] = useState('')
  const [spaceKey, setSpaceKey] = useState('')
  const [spaceFields, setSpaceFields] = useState<SpaceFieldsValue>(emptySpaceFields)
  const [spaceMenuOpen, setSpaceMenuOpen] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [pendingId, setPendingId] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [pendingAffiliations, setPendingAffiliations] = useState<Set<PropertyAffiliation>>(new Set())
  const [effectiveDate, setEffectiveDate] = useState('')
  const [cutOffDate, setCutOffDate] = useState('')
  const [assignee, setAssignee] = useState<AssigneeValue>(emptyAssignee)
  const [createCompanyOpen, setCreateCompanyOpen] = useState(false)
  const [pendingSubmit, setPendingSubmit] = useState<SwitchCompanySubmitPayload | null>(null)
  const [revertConfirmOpen, setRevertConfirmOpen] = useState(false)
  const comboboxRef = useRef<HTMLDivElement>(null)
  const spacesRef = useRef(spaces)
  spacesRef.current = spaces

  const pendingCompany = useMemo(
    () => propertyCompanies.find((company) => company.id === pendingId),
    [pendingId],
  )

  useEffect(() => {
    if (!open) return
    if (isEditMode && initialForm) {
      setSpaceKey(initialForm.spaceKey)
      setPendingId(initialForm.companyId)
      setEffectiveDate(initialForm.effectiveDate)
      setCutOffDate(initialForm.cutOffDate)
      setPendingAffiliations(new Set(initialForm.affiliations))
      setAssignee({
        assignee: initialForm.assignee,
        assignSupervisor: Boolean(initialForm.supervisor),
        supervisor: initialForm.supervisor ?? '',
      })
    } else {
      setSpaceKey(initialSpaceKey ?? '')
      setPendingId(targetCompanyId ?? '')
      setEffectiveDate(todayMMDDYYYY())
      setCutOffDate('')
      setPendingAffiliations(new Set())
      setAssignee(emptyAssignee())
    }
    const prefillSpace = !isEditMode && targetCompanyId ? spacesRef.current.find((space) => space.key === initialSpaceKey) : undefined
    setSpaceFields(prefillSpace ? lockedSpaceFields(prefillSpace) : emptySpaceFields())
    setSubmitAttempted(false)
    setSpaceMenuOpen(false)
    setQuery('')
    setDropdownOpen(false)
    setCreateCompanyOpen(initialCreateCompany)
    setPendingSubmit(null)
    setRevertConfirmOpen(false)
  }, [open, isEditMode, initialForm, initialSpaceKey, targetCompanyId, initialCreateCompany])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (revertConfirmOpen) {
          setRevertConfirmOpen(false)
          event.stopPropagation()
          return
        }
        if (pendingSubmit) {
          setPendingSubmit(null)
          event.stopPropagation()
          return
        }
        if (dropdownOpen || spaceMenuOpen) {
          setDropdownOpen(false)
          setSpaceMenuOpen(false)
          event.stopPropagation()
          return
        }
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, dropdownOpen, spaceMenuOpen, pendingSubmit, revertConfirmOpen, onClose])

  useEffect(() => {
    if (!dropdownOpen) return
    const closeOnOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [dropdownOpen])

  const filteredCompanies = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return propertyCompanies
    return propertyCompanies.filter((company) => company.name.toLowerCase().includes(needle))
  }, [query])

  const inputValue = dropdownOpen ? query : pendingId ? (pendingCompany?.name ?? '') : ''

  const selectedSpace = spaces.find((space) => space.key === spaceKey)
  // Making a past company active starts from its old space, but the fields stay editable.
  const isMakeActive = !isEditMode && Boolean(targetCompanyId)
  const spaceLocked = isEditMode || (Boolean(initialSpaceKey) && !isMakeActive)
  // Adding a company reuses the switch flow with no space preselected.
  const isAddMode = !isEditMode && !initialSpaceKey
  // The row action that opens this says "Edit switch"; a bare "Edit" as a
  // heading does not say what is being edited.
  const actionLabel = isEditMode
    ? 'Edit Switch'
    : isAddMode
      ? 'Add company'
      : isMakeActive
        ? 'Make active'
        : 'Switch company'

  const effectiveSpaceKey = spaceLocked ? spaceKey : deriveSpaceKey(spaceFields)
  const addSpaceLabel = describeSpaceInput(spaceFields)
  const {
    spaceError,
    companyError,
    effectiveDateError,
    endDateError,
    floorError,
    suiteUnitError,
    affiliationError,
    hasErrors,
  } = validateAssociationForm({
    spaces,
    spaceKey,
    effectiveSpaceKey,
    spaceLocked,
    isEditMode,
    isMakeActive,
    companyId: pendingId,
    companyName: pendingCompany?.name,
    effectiveDate,
    cutOffDate,
    spaceFields,
    occupants,
    affiliations: [...pendingAffiliations],
  })
  const showErrors = submitAttempted
  const assigneeError = submitAttempted && !assignee.assignee ? 'Select an assignee.' : null

  const closeModal = () => {
    setPendingSubmit(null)
    onFlowChange?.(null)
    onClose()
  }

  const buildSubmitPayload = (): SwitchCompanySubmitPayload => ({
    mode: isEditMode ? 'edit' : 'switch',
    associationId: isEditMode ? associationId : undefined,
    spaceKey: effectiveSpaceKey,
    companyId: pendingId,
    effectiveDate,
    cutOffDate,
    affiliations: [...pendingAffiliations],
    assignee: assignee.assignee,
    supervisor: assignee.assignSupervisor ? assignee.supervisor : undefined,
  })

  const completeSubmit = (payload: SwitchCompanySubmitPayload) => {
    onConfirm(payload)
    closeModal()
  }

  const confirmTargetCompany = useMemo(() => {
    if (!pendingSubmit) return null
    return propertyCompanies.find((company) => company.id === pendingSubmit.companyId)
  }, [pendingSubmit])

  if (!open) return null

  if (createCompanyOpen) {
    return (
      <CreateCompanyModal
        open
        onClose={closeModal}
        onCancel={() => {
          setCreateCompanyOpen(false)
          onFlowChange?.('switch-company')
        }}
        onCreate={() => window.alert('Company created (prototype)')}
      />
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="switch-company-title">
      <button type="button" className="absolute inset-0 bg-[#262527]/40" aria-label="Close dialog" onClick={closeModal} />
      <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-[960px] flex-col rounded-xl border border-[#e6e6e7] bg-white p-6 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]">
        <div className="mb-2 flex w-full shrink-0 flex-col gap-1 border-b border-[#e6e6e7] pb-4">
          <div className="flex w-full items-start gap-1">
            <h2
              id="switch-company-title"
              className="min-w-0 flex-1 break-words text-xl font-bold leading-7 text-[#262527]"
            >
              {actionLabel}
            </h2>
            <button type="button" aria-label="Close" onClick={closeModal} className="relative size-6 shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={modalClose} />
            </button>
          </div>
        </div>

        <div className="-mx-2 flex min-h-0 flex-1 flex-col overflow-y-auto px-2">
          <ModalFormRow
            label="Company"
            description={
              isMakeActive
                ? 'This company is being made active again on this property'
                : 'Select the company that should be associated with this property'
            }
            required
          >
            {isMakeActive ? (
              // Make active brings this same company record back, so it cannot be swapped.
              <div className="flex h-10 items-center rounded-lg border border-[#e6e6e7] bg-[#f5f5f6] px-3.5">
                <span className="truncate text-sm leading-5 text-[#262527]">{pendingCompany?.name}</span>
              </div>
            ) : (
            <div ref={comboboxRef} className="relative flex flex-col gap-2">
              <div className="flex justify-end py-0">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false)
                    setQuery('')
                    setCreateCompanyOpen(true)
                    onFlowChange?.('create-company')
                  }}
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-transparent px-3.5 py-0 text-sm font-medium leading-5 text-primary hover:bg-[#f5f5f6]"
                >
                  <span className="relative size-4 shrink-0" aria-hidden>
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={detailPlus} />
                  </span>
                  Create new company
                </button>
              </div>
              <div className="relative min-w-0">
                <div
                  className={`flex h-10 items-center gap-2 rounded-lg border bg-white px-3.5 ${
                    showErrors && companyError ? 'border-[#b32318]' : 'border-[#e6e6e7]'
                  }`}
                >
                  <input
                    id="switch-company-combobox"
                    type="text"
                    role="combobox"
                    aria-expanded={dropdownOpen}
                    aria-controls="switch-company-listbox"
                    aria-autocomplete="list"
                    value={inputValue}
                    placeholder="Search by company name"
                    onChange={(event) => {
                      setQuery(event.target.value)
                      setDropdownOpen(true)
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    className="min-w-0 flex-1 bg-transparent text-sm leading-5 text-[#262527] outline-none placeholder:text-[#6a6a70]"
                  />
                  <button
                    type="button"
                    aria-label={dropdownOpen ? 'Close company list' : 'Open company list'}
                    onClick={() => {
                      setDropdownOpen((prev) => {
                        if (prev) setQuery('')
                        return !prev
                      })
                    }}
                    className="relative size-4 shrink-0"
                  >
                    <img
                      alt=""
                      className={`absolute inset-0 block size-full max-w-none transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                      src={questionsChevronDown}
                    />
                  </button>
                </div>
                {dropdownOpen && (
                  <ul
                    id="switch-company-listbox"
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[220px] overflow-y-auto rounded-lg border border-[#e6e6e7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                  >
                    {filteredCompanies.length === 0 ? (
                      <li className="px-4 py-2.5 text-sm leading-5 text-[#6a6a70]">No companies match your search.</li>
                    ) : (
                      filteredCompanies.map((company) => {
                        const selected = company.id === pendingId
                        return (
                          <li key={company.id} role="option" aria-selected={selected}>
                            <button
                              type="button"
                              onClick={() => {
                                setPendingId(company.id)
                                setQuery('')
                                setDropdownOpen(false)
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm font-medium leading-5 ${
                                selected ? 'bg-primary-subtle text-primary' : 'text-[#262527] hover:bg-[#f5f5f6]'
                              }`}
                            >
                              <span className="block truncate">{company.name}</span>
                            </button>
                          </li>
                        )
                      })
                    )}
                  </ul>
                )}
              </div>
              {showErrors && companyError && <ModalFieldError>{companyError}</ModalFieldError>}
            </div>
            )}
          </ModalFormRow>

          <ModalFormRow label={OCCUPANCY_LABEL} description={OCCUPANCY_DESCRIPTION}>
            {spaceLocked && selectedSpace ? (
              <div className="flex flex-col gap-2">
                <SpaceFields
                  idPrefix="switch-company-locked"
                  size="sm"
                  layout="stacked"
                  disabled
                  value={lockedSpaceFields(selectedSpace)}
                  onChange={() => {}}
                />
                {selectedSpace.currentCompanyName && (
                  <p className="text-sm leading-5 text-[#86868b]">Current: {selectedSpace.currentCompanyName}</p>
                )}
              </div>
            ) : (
              <SpaceFields
                idPrefix="switch-company"
                size="sm"
                layout="stacked"
                value={spaceFields}
                onChange={setSpaceFields}
                errors={{
                  floor: showErrors ? floorError : null,
                  suiteUnit: showErrors ? suiteUnitError : null,
                }}
              />
            )}
            {showErrors && spaceError && <ModalFieldError>{spaceError}</ModalFieldError>}
          </ModalFormRow>

          <ModalFormRow
            label={COMPANY_AT_PROPERTY.effectiveDateLabel}
            description={EFFECTIVE_DATE_DESCRIPTION}
            required
          >
            <div className="flex flex-col gap-1.5">
              <ModalDateInput id="switch-company-effective-date" value={effectiveDate} onChange={setEffectiveDate} />
              {showErrors && effectiveDateError && <ModalFieldError>{effectiveDateError}</ModalFieldError>}
            </div>
          </ModalFormRow>

          <ModalFormRow
            label={COMPANY_AT_PROPERTY.tillDateLabel}
            description={TILL_DATE_DESCRIPTION}
          >
            <ModalDateInput id="switch-company-cut-off-date" value={cutOffDate} onChange={setCutOffDate} />
            {showErrors && endDateError && <ModalFieldError>{endDateError}</ModalFieldError>}
          </ModalFormRow>

          <ModalFormRow
            label="Property Affiliation"
            description="Select one or more affiliation types that apply to this property"
            required
          >
            <div className="flex flex-col gap-1.5">
            <AffiliationSelect
              id="switch-company-affiliation"
              value={pendingAffiliations}
              onChange={setPendingAffiliations}
              invalid={showErrors && Boolean(affiliationError)}
            />
            {showErrors && affiliationError && <ModalFieldError>{affiliationError}</ModalFieldError>}
            </div>
          </ModalFormRow>

          <ModalFormRow
            label="Assign to"
            description="Every property and company needs an assignee. Add a supervisor when one is needed"
            required
          >
            <AssigneeFields
              idPrefix="switch-company"
              value={assignee}
              onChange={setAssignee}
              error={assigneeError}
            />
          </ModalFormRow>
        </div>

        <div className="mt-2 flex shrink-0 items-center justify-between gap-3 border-t border-[#e6e6e7] pt-4">
          {isEditMode && associationId && onRevertPending ? (
            <button
              type="button"
              onClick={() => setRevertConfirmOpen(true)}
              className="text-sm font-medium leading-5 text-[#b32318]"
            >
              {DISCARD_SWITCH.action}
            </button>
          ) : (
            <span aria-hidden className="shrink-0" />
          )}
          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2 text-sm leading-5 text-[#444446]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitAttempted(true)
                if (hasErrors || !assignee.assignee) return
                const payload = buildSubmitPayload()
                if (isEditMode) {
                  completeSubmit(payload)
                  return
                }
                setPendingSubmit(payload)
              }}
              className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm leading-5 text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
            >
              {isEditMode ? 'Update' : actionLabel}
            </button>
          </div>
        </div>
      </div>

      {revertConfirmOpen && associationId && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="revert-pending-confirm-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#262527]/50"
            aria-label="Dismiss confirmation"
            onClick={() => setRevertConfirmOpen(false)}
          />
          <div className="relative w-full max-w-[480px] rounded-xl border border-[#e6e6e7] bg-white p-6 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]">
            <div className="flex gap-3">
              <span className="relative mt-0.5 size-10 shrink-0" aria-hidden>
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableAlertCircleWarn} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 id="revert-pending-confirm-title" className="text-lg font-bold leading-7 text-[#262527]">
                  {DISCARD_SWITCH.heading}
                </h3>
                <p className="mt-2 text-sm leading-5 text-[#6a6a70]">{DISCARD_SWITCH.body}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRevertConfirmOpen(false)}
                className="rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2 text-sm leading-5 text-[#444446]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onRevertPending?.(associationId)
                  setRevertConfirmOpen(false)
                  closeModal()
                }}
                className="rounded-lg border border-[#b32318] bg-[#b32318] px-3.5 py-2 text-sm font-medium leading-5 text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
              >
                {DISCARD_SWITCH.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingSubmit && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="switch-company-confirm-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#262527]/50"
            aria-label="Dismiss confirmation"
            onClick={() => setPendingSubmit(null)}
          />
          <div className="relative w-full max-w-[480px] rounded-xl border border-[#e6e6e7] bg-white p-6 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]">
            <div className="flex gap-3">
              <span className="relative mt-0.5 size-10 shrink-0" aria-hidden>
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableAlertCircleWarn} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 id="switch-company-confirm-title" className="text-lg font-bold leading-7 text-[#262527]">
                  {actionLabel}?
                </h3>
                <p className="mt-2 text-sm leading-5 text-[#6a6a70]">
                  <span className="font-medium text-[#262527]">{confirmTargetCompany?.name}</span> will take over{' '}
                  <span className="font-medium text-[#262527]">{selectedSpace?.label ?? addSpaceLabel}</span> on{' '}
                  {formatShortDate(pendingSubmit.effectiveDate)}.
                  {selectedSpace?.currentCompanyName ? ` ${selectedSpace.currentCompanyName} stays active until then.` : ''}{' '}
                  Do you want to continue?
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingSubmit(null)}
                className="rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2 text-sm leading-5 text-[#444446]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => completeSubmit(pendingSubmit)}
                className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm font-medium leading-5 text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
              >
                {actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  )
}
