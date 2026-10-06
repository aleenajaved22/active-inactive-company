import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import avatarJeff from '../assets/avatar-jeff.png'
import contactAvatarAleena from '../assets/contacts/avatar-aleena.png'
import contactAvatarDarrell from '../assets/contacts/avatar-darrell.png'
import contactAvatarJohn from '../assets/contacts/avatar-john.png'
import modalClose from '../assets/modal-close.svg'
import type { CompanyAffiliationBadge } from '../data/propertyDetailSidePanel'
import type { PropertyCompanyListStatus } from '../data/propertyCompanies'
import { parentCompanyOptions } from '../data/propertyFormOptions'
import type { IndustryVertical } from '../data/industryVerticals'
import { AssigneeDrawer } from './AssigneeDrawer'
import { FormSelect } from './AssigneeFields'
import { PendingStatusBadge } from './PendingStatusBadge'

type PropertyDetailCompanyHeaderProps = {
  companyName: string
  /** Opens the company detail page when set. */
  companyHref?: string
  /** The suite, unit or floor this company holds on the property. */
  spaceLabel?: string
  listStatus: PropertyCompanyListStatus
  /** From the company record, so it sits with the company rather than the property. */
  industryVertical: IndustryVertical
  parentCompany?: string
  parentCompanyHref?: string
  /** Only called when Parent Company is blank; a value that is already set cannot be edited here. */
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

/**
 * Whether a scrolling strip has more beyond its right edge. Drives the fade that
 * tells the user the row continues, and clears it once they have scrolled to the end.
 */
function useMoreToScroll<T extends HTMLElement>(deps: unknown[]) {
  const ref = useRef<T>(null)
  const [more, setMore] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setMore(el.scrollWidth - el.clientWidth - el.scrollLeft > 1)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    el.addEventListener('scroll', check, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', check)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ref, more }
}

/**
 * "+N" for the affiliations that did not fit. Hovering (or focusing) it lists
 * them as the same coloured pills, in a popover that is portalled out because
 * the strip around it scrolls and would clip anything absolutely positioned.
 */
function AffiliationOverflow({ items }: { items: CompanyAffiliationBadge[] }) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = useId()
  const [style, setStyle] = useState<CSSProperties | null>(null)

  const show = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    // Near the right edge the popover hangs from the chip's right side instead,
    // so it is never pushed off screen.
    const nearEdge = rect.left + 200 > window.innerWidth
    setStyle({
      position: 'fixed',
      top: rect.bottom + 6,
      zIndex: 80,
      ...(nearEdge ? { right: window.innerWidth - rect.right } : { left: rect.left }),
    })
  }
  const hide = () => setStyle(null)

  // The strip scrolls under the pointer, so a popover left behind would drift.
  useEffect(() => {
    if (!style) return
    window.addEventListener('scroll', hide, true)
    window.addEventListener('resize', hide)
    return () => {
      window.removeEventListener('scroll', hide, true)
      window.removeEventListener('resize', hide)
    }
  }, [style])

  const names = items.map((badge) => badge.label).join(', ')

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${items.length} more ${items.length === 1 ? 'affiliation' : 'affiliations'}: ${names}`}
        aria-describedby={style ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="inline-flex h-6 shrink-0 items-center rounded-2xl bg-[#ececed] px-2 text-xs font-medium leading-[18px] text-[#5b5b5f] outline-none hover:bg-[#e2e2e4] focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        +{items.length}
      </button>
      {style &&
        createPortal(
          <div
            id={id}
            role="tooltip"
            style={style}
            className="pointer-events-none flex flex-col items-start gap-1.5 rounded-lg border border-[#e6e6e7] bg-white p-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
          >
            {items.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex h-6 items-center rounded-2xl px-2.5 text-xs font-medium leading-[18px]"
                style={{ backgroundColor: badge.bg, color: badge.text }}
              >
                {badge.label}
              </span>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}

/** The blue ↗ that marks a name as a link to its own page. */
function LinkArrow({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-primary">
      <path d="M4.5 11.5L11.5 4.5M5.75 4.5H11.5V10.25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** A slight rule between attributes, short enough to read as a separator, not a border. */
function HeaderDivider() {
  return <span aria-hidden className="h-8 w-px shrink-0 bg-[#e6e6e7]" />
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
      <span className="max-w-full truncate text-xs font-medium leading-[18px] text-[#86868b]">{label}</span>
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
  const [assigneeDrawerOpen, setAssigneeDrawerOpen] = useState(false)
  const [parentDialogOpen, setParentDialogOpen] = useState(false)
  const [parentDraft, setParentDraft] = useState('')

  const assigneeValue = useMemo(
    () => ({ assignee, assignSupervisor: Boolean(supervisor), supervisor: supervisor ?? '' }),
    [assignee, supervisor],
  )

  // Parent Company comes from HubSpot, so it is only editable while it is blank.
  const parentCompanyLocked = Boolean(parentCompany)

  const strip = useMoreToScroll<HTMLDivElement>([assignee, parentCompany, industryVertical, affiliations.length, listStatus])

  // Two affiliations are shown; any beyond that fold into a "+N" chip.
  const visibleAffiliations = affiliations.slice(0, 2)
  const hiddenAffiliations = affiliations.slice(2)

  return (
    <div className="shrink-0 border-b border-[#e6e6e7] bg-[rgb(245_245_246/0.5)]">
      {/* One row: the company on the left, what is known about it beside it,
          and the actions on the far edge. Values truncate before anything wraps. */}
      <div className="flex items-center gap-x-5 px-8 py-4">
        <div className="flex max-w-[17rem] shrink-0 flex-col gap-0.5">
          <div className="flex min-w-0 items-center gap-2.5">
            {companyHref ? (
              <a
                href={companyHref}
                title={`Open ${companyName}`}
                className="group flex min-w-0 items-center gap-1.5 text-xl font-bold leading-7 text-[#262527]"
              >
                <span className="truncate group-hover:underline">{companyName}</span>
                <LinkArrow size={18} />
              </a>
            ) : (
              <p className="truncate text-xl font-bold leading-7 text-[#262527]">{companyName}</p>
            )}
            {/* Active is the normal state, so it is not announced. Only a company
                that is not yet active says so. */}
            {listStatus === 'Pending' && pendingEffectiveDate !== undefined && (
              <PendingStatusBadge
                size="lg"
                effectiveDate={pendingEffectiveDate}
                tooltipId={pendingTooltipId ?? 'pending-effective-date-header'}
              />
            )}
          </div>
          {spaceLabel && <p className="truncate text-sm leading-5 text-[#6a6a70]">{spaceLabel}</p>}
        </div>

        {/* The attributes keep a readable size and scroll sideways when the panel is
            too narrow for them, like the tab row beneath. A fade on the clipped
            edge says there is more. The company's own name and status never scroll. */}
        <div
          ref={strip.ref}
          className={`no-scrollbar min-w-0 flex-1 overflow-x-auto ${
            strip.more
              ? '[-webkit-mask-image:linear-gradient(to_right,black_calc(100%-32px),transparent)] [mask-image:linear-gradient(to_right,black_calc(100%-32px),transparent)]'
              : ''
          }`}
        >
        <div className="flex w-max min-w-full items-center justify-end gap-x-4">
          <HeaderLabeledBlock label="Assignee" className="max-w-[13rem] shrink-0">
            <span className="flex h-6 max-w-full items-center gap-2">
              {/* With a supervisor, two avatars overlap: the assignee in front, the
                  supervisor behind and to the right. Names are on hover. */}
              <span
                role="img"
                aria-label={supervisor ? `Assignee ${assignee}, supervisor ${supervisor}` : `Assignee ${assignee}`}
                title={supervisor ? `Assignee: ${assignee} · Supervisor: ${supervisor}` : assignee}
                className="flex shrink-0 items-center -space-x-1.5"
              >
                <img
                  alt=""
                  className="relative z-10 size-5 rounded-full object-cover ring-2 ring-[#fafafa]"
                  src={avatarSrc(assignee)}
                />
                {supervisor && (
                  <img
                    alt=""
                    className="size-5 rounded-full object-cover ring-2 ring-[#fafafa]"
                    src={avatarSrc(supervisor)}
                  />
                )}
              </span>
              <span className="truncate text-sm font-medium leading-6 text-[#262527]">
                {assignee || 'Unassigned'}
              </span>
              {onAssigneeChange && (
                <EditButton label="Edit assignee and supervisor" onClick={() => setAssigneeDrawerOpen(true)} />
              )}
            </span>
          </HeaderLabeledBlock>

          <HeaderDivider />

          <HeaderLabeledBlock label="Parent Company" className="max-w-[13rem] shrink-0">
            <span className="flex h-6 max-w-full items-center">
              {parentCompany ? (
                parentCompanyHref ? (
                  <a
                    href={parentCompanyHref}
                    title={`Open ${parentCompany}`}
                    className="group flex min-w-0 items-center gap-1.5 text-sm font-medium leading-6 text-[#262527]"
                  >
                    <span className="truncate group-hover:underline">{parentCompany}</span>
                    <LinkArrow size={16} />
                  </a>
                ) : (
                  <span className="truncate text-sm font-medium leading-6 text-[#262527]" title={parentCompany}>
                    {parentCompany}
                  </span>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setParentDraft('')
                    setParentDialogOpen(true)
                  }}
                  className="whitespace-nowrap text-sm font-medium leading-6 text-primary hover:underline"
                >
                  Add parent company
                </button>
              )}
            </span>
          </HeaderLabeledBlock>

          <HeaderDivider />

          <HeaderLabeledBlock label="Industry Vertical" className="shrink-0">
            <span className="block max-w-full truncate text-sm font-medium leading-6 text-[#262527]" title={industryVertical}>
              {industryVertical}
            </span>
          </HeaderLabeledBlock>

          <HeaderDivider />

          <HeaderLabeledBlock label="Affiliation" className="shrink-0">
            <div className="flex h-6 items-center gap-1.5">
              {visibleAffiliations.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex h-6 shrink-0 items-center rounded-2xl px-2.5 text-xs font-medium leading-[18px]"
                  style={{ backgroundColor: badge.bg, color: badge.text }}
                >
                  {badge.label}
                </span>
              ))}
              {hiddenAffiliations.length > 0 && <AffiliationOverflow items={hiddenAffiliations} />}
            </div>
          </HeaderLabeledBlock>
        </div>
        </div>

      </div>

      <AssigneeDrawer
        open={assigneeDrawerOpen}
        companyName={companyName}
        spaceLabel={spaceLabel}
        initial={assigneeValue}
        onClose={() => setAssigneeDrawerOpen(false)}
        onSave={(next) => {
          onAssigneeChange?.(next)
          setAssigneeDrawerOpen(false)
        }}
      />

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
