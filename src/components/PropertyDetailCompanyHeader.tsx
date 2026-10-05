import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import avatarJeff from '../assets/avatar-jeff.png'
import contactAvatarAleena from '../assets/contacts/avatar-aleena.png'
import contactAvatarDarrell from '../assets/contacts/avatar-darrell.png'
import contactAvatarJohn from '../assets/contacts/avatar-john.png'
import modalClose from '../assets/modal-close.svg'
import type { CompanyAffiliationBadge } from '../data/propertyDetailSidePanel'
import type { PropertyCompanyListStatus } from '../data/propertyCompanies'
import { parentCompanyOptions } from '../data/propertyFormOptions'
import { AssigneeFields, FormSelect, type AssigneeValue } from './AssigneeFields'
import { InfoTooltip } from './InfoTooltip'
import { PendingStatusBadge } from './PendingStatusBadge'
import { CompanyListStatusBadge } from './PropertyLeadActivities'
import { ActionMenu, type ActionMenuItem } from './companyActions'

type PropertyDetailCompanyHeaderProps = {
  companyName: string
  /** Same ⋮ actions as this company's row in the Companies panel. */
  actions?: ActionMenuItem[]
  /** Opens the company detail page when set. */
  companyHref?: string
  /** The suite, unit or floor this company holds on the property. */
  spaceLabel?: string
  listStatus: PropertyCompanyListStatus
  /** From the company record, so it sits with the company rather than the property. */
  industryVertical: string
  parentCompany?: string
  parentCompanyHref?: string
  /** Only called when Parent Company is blank; a HubSpot value is locked. */
  onParentCompanyChange?: (value: string) => void
  /** Set per property + company, which is why it lives here and not in the left panel. */
  assignee: string
  supervisor?: string
  onAssigneeChange?: (value: { assignee: string; supervisor?: string }) => void
  affiliations: CompanyAffiliationBadge[]
  pendingEffectiveDate?: string
  pendingTooltipId?: string
}

const avatarByName: Record<string, string> = {
  'Jeff Zolos': avatarJeff,
  'Henry Micheal': contactAvatarDarrell,
  'Jerome Bell': contactAvatarAleena,
  'John Doe': contactAvatarJohn,
}

function avatarSrc(name: string) {
  return avatarByName[name] ?? contactAvatarJohn
}

function HeaderLabeledBlock({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex min-w-0 flex-col items-start gap-1 ${className}`}>
      <span className="text-xs font-medium leading-[18px] text-[#86868b]">{label}</span>
      {children}
    </div>
  )
}

/** The pencil used to open an inline edit from the header. */
function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-5 shrink-0 items-center justify-center rounded text-[#86868b] outline-none hover:bg-[#e6e6e7]/60 hover:text-[#262527] focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M11.3333 2L14 4.66667L5 13.6667L1.66667 14.3333L2.33333 11L11.3333 2Z"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

/** A small dialog in the app's modal language, for the header's inline edits. */
function HeaderEditDialog({
  title,
  onClose,
  onSave,
  saveDisabled,
  children,
}: {
  title: string
  onClose: () => void
  onSave: () => void
  saveDisabled?: boolean
  children: ReactNode
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-[#262527]/40" aria-label="Close dialog" onClick={onClose} />
      <div className="relative w-full max-w-[420px] rounded-xl border border-[#e6e6e7] bg-white p-6 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]">
        <div className="mb-4 flex items-start gap-2 border-b border-[#e6e6e7] pb-4">
          <h3 className="min-w-0 flex-1 text-lg font-bold leading-7 text-[#262527]">{title}</h3>
          <button type="button" aria-label="Close" onClick={onClose} className="relative size-6 shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={modalClose} />
          </button>
        </div>
        {children}
        <div className="mt-6 flex justify-end gap-3 border-t border-[#e6e6e7] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2 text-sm leading-5 text-[#444446]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saveDisabled}
            className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm font-medium leading-5 text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] disabled:cursor-not-allowed disabled:border-[#e6e6e7] disabled:bg-[#e6e6e7] disabled:text-[#86868b]"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function PropertyDetailCompanyHeader({
  companyName,
  actions = [],
  companyHref,
  spaceLabel,
  listStatus,
  industryVertical,
  parentCompany,
  parentCompanyHref,
  onParentCompanyChange,
  assignee,
  supervisor,
  onAssigneeChange,
  affiliations,
  pendingEffectiveDate,
  pendingTooltipId,
}: PropertyDetailCompanyHeaderProps) {
  const [assigneeDialogOpen, setAssigneeDialogOpen] = useState(false)
  const [assigneeDraft, setAssigneeDraft] = useState<AssigneeValue>({
    assignee: '',
    assignSupervisor: false,
    supervisor: '',
  })
  const [parentDialogOpen, setParentDialogOpen] = useState(false)
  const [parentDraft, setParentDraft] = useState('')

  const openAssigneeDialog = () => {
    setAssigneeDraft({
      assignee,
      assignSupervisor: Boolean(supervisor),
      supervisor: supervisor ?? '',
    })
    setAssigneeDialogOpen(true)
  }

  // Parent Company comes from HubSpot. It is editable only while it is blank.
  const parentCompanyLocked = Boolean(parentCompany)

  const statusBadge =
    listStatus === 'Pending' && pendingEffectiveDate !== undefined ? (
      <PendingStatusBadge
        size="lg"
        effectiveDate={pendingEffectiveDate}
        tooltipId={pendingTooltipId ?? 'pending-effective-date-header'}
      />
    ) : (
      <CompanyListStatusBadge status={listStatus} size="lg" />
    )

  return (
    <div className="shrink-0 border-b border-[#e6e6e7] bg-[rgb(245_245_246/0.5)]">
      <div className="flex flex-col gap-4 px-8 py-5">
        {/* Identity: who this is and what state it is in. The name leads, its
            status sits beside it where it is read with it, and the actions
            hold the far edge on the same line. */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex min-w-0 items-center gap-3">
              {companyHref ? (
                <a
                  href={companyHref}
                  title={`Open ${companyName}`}
                  className="group flex min-w-0 items-center gap-1 text-xl font-bold leading-7 text-[#262527] hover:text-primary"
                >
                  <span className="truncate group-hover:underline">{companyName}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                    className="shrink-0 text-[#86868b] group-hover:text-primary"
                  >
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ) : (
                <p className="truncate text-xl font-bold leading-7 text-[#262527]">{companyName}</p>
              )}
              {statusBadge}
            </div>
            {spaceLabel && <p className="truncate text-sm leading-5 text-[#6a6a70]">{spaceLabel}</p>}
          </div>
          <ActionMenu label={`Actions for ${companyName}`} items={actions} />
        </div>

        {/* Details: label over value, one rhythm throughout. The hairline above
            separates them from the identity block instead of vertical rules,
            which broke whenever the row wrapped. */}
        <div className="flex flex-wrap items-start gap-x-10 gap-y-4 border-t border-[#e6e6e7] pt-4">
          <HeaderLabeledBlock label="Industry Vertical" className="max-w-[200px]">
            <span className="block max-w-full truncate text-sm font-medium leading-6 text-[#262527]" title={industryVertical}>
              {industryVertical}
            </span>
          </HeaderLabeledBlock>

          <HeaderLabeledBlock label="Parent Company" className="max-w-[240px]">
            <span className="flex h-6 max-w-full items-center gap-1.5">
              {parentCompany ? (
                <>
                  {parentCompanyHref ? (
                    <a
                      href={parentCompanyHref}
                      title={`Open ${parentCompany}`}
                      className="group flex min-w-0 items-center gap-0.5 text-sm font-medium leading-6 text-[#262527] hover:text-primary"
                    >
                      <span className="truncate group-hover:underline">{parentCompany}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                        className="shrink-0 text-[#86868b] group-hover:text-primary"
                      >
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ) : (
                    <span className="truncate text-sm font-medium leading-6 text-[#262527]">{parentCompany}</span>
                  )}
                  {/* A lock, not an ⓘ: the value is fixed, and says why. */}
                  <InfoTooltip
                    icon="lock"
                    label="Parent Company is locked"
                    text="Parent Company is synced from HubSpot and cannot be edited here. It can only be set while it is blank."
                  />
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setParentDraft('')
                    setParentDialogOpen(true)
                  }}
                  className="text-sm font-medium leading-6 text-primary hover:underline"
                >
                  Add parent company
                </button>
              )}
            </span>
          </HeaderLabeledBlock>

          <HeaderLabeledBlock label="Assignee" className="max-w-[220px]">
            <span className="flex h-6 max-w-full items-center gap-2">
              <img alt="" className="size-5 shrink-0 rounded-full object-cover" src={avatarSrc(assignee)} />
              <span className="truncate text-sm font-medium leading-6 text-[#262527]" title={assignee}>
                {assignee || 'Unassigned'}
              </span>
              {onAssigneeChange && <EditButton label="Edit assignee and supervisor" onClick={openAssigneeDialog} />}
            </span>
          </HeaderLabeledBlock>

          {/* Shown, not hidden behind an icon: who supervises is as useful as who is assigned. */}
          {supervisor && (
            <HeaderLabeledBlock label="Supervisor" className="max-w-[220px]">
              <span className="flex h-6 max-w-full items-center gap-2">
                <img alt="" className="size-5 shrink-0 rounded-full object-cover" src={avatarSrc(supervisor)} />
                <span className="truncate text-sm font-medium leading-6 text-[#262527]" title={supervisor}>
                  {supervisor}
                </span>
              </span>
            </HeaderLabeledBlock>
          )}

          <HeaderLabeledBlock label="Affiliation">
            <div className="flex max-w-[360px] flex-wrap gap-1.5">
              {affiliations.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex h-6 items-center rounded-2xl px-2.5 text-xs font-medium leading-[18px]"
                  style={{ backgroundColor: badge.bg, color: badge.text }}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </HeaderLabeledBlock>
        </div>
      </div>

      {assigneeDialogOpen && (
        <HeaderEditDialog
          title="Assign to"
          onClose={() => setAssigneeDialogOpen(false)}
          saveDisabled={!assigneeDraft.assignee}
          onSave={() => {
            onAssigneeChange?.({
              assignee: assigneeDraft.assignee,
              supervisor: assigneeDraft.assignSupervisor ? assigneeDraft.supervisor : undefined,
            })
            setAssigneeDialogOpen(false)
          }}
        >
          <p className="mb-3 text-sm leading-5 text-[#6a6a70]">
            Set for {companyName} at this property.
          </p>
          <AssigneeFields idPrefix="header-assignee" value={assigneeDraft} onChange={setAssigneeDraft} />
        </HeaderEditDialog>
      )}

      {parentDialogOpen && !parentCompanyLocked && (
        <HeaderEditDialog
          title="Parent Company"
          onClose={() => setParentDialogOpen(false)}
          saveDisabled={!parentDraft}
          onSave={() => {
            onParentCompanyChange?.(parentDraft)
            setParentDialogOpen(false)
          }}
        >
          <p className="mb-3 text-sm leading-5 text-[#6a6a70]">
            Set the parent company for {companyName}. Once set from HubSpot it can no longer be edited here.
          </p>
          <FormSelect
            id="header-parent-company"
            value={parentDraft}
            onChange={setParentDraft}
            options={parentCompanyOptions}
            placeholder="Select parent company"
          />
        </HeaderEditDialog>
      )}
    </div>
  )
}
