import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import detailCompanyMenu from '../assets/detail-company-menu.svg'
import tableSearch from '../assets/table-search.svg'
import { getPropertyCompany, type PropertyCompanyListStatus } from '../data/propertyCompanies'
import {
  parseMMDDYYYY,
  spaceKeyOf,
  spaceLabelOf,
  type SpaceAssociation,
} from '../data/propertySpaceAssociations'
import type { PropertyModal } from '../prototype/screenLinks'
import { EditCompanyModal } from './EditCompanyModal'
import { SwitchCompanyModal } from './SwitchCompanyModal'
import type {
  PropertyAffiliation,
  SwitchCompanyFormValues,
  SwitchCompanySubmitPayload,
  SwitchSpaceOption,
} from './switchCompanyTypes'

type CompanyListingPanelProps = {
  associations: SpaceAssociation[]
  onAssociationsChange: (next: SpaceAssociation[]) => void
  selectedAssociationId: string
  onSelectAssociation: (id: string) => void
  propertyModal?: PropertyModal
  onPropertyModalChange?: (modal?: PropertyModal) => void
  /** Hides the panel while keeping its search, view and page state. */
  collapsed?: boolean
  companyHref?: (companyId: string) => string
}

const currentStatusOrder: PropertyCompanyListStatus[] = ['Active', 'Pending']
const INACTIVE_PAGE_SIZE = 8

// Row separators, hidden around the selected row so its rounded highlight stands alone.
const rowListClass =
  'flex flex-col divide-y divide-[#e6e6e7] [&>li[data-selected]]:border-t-transparent [&>li[data-selected]+li]:border-t-transparent'

const matchesQuery = (association: SpaceAssociation, query: string) => {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const company = getPropertyCompany(association.companyId)
  return `${company.name} ${company.parentCompany ?? ''} ${spaceLabelOf(association)}`.toLowerCase().includes(needle)
}

const endTime = (association: SpaceAssociation) => parseMMDDYYYY(association.endDate)?.getTime() ?? 0

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={direction === 'right' ? 'M6 12L10 8L6 4' : 'M10 12L6 8L10 4'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StatusBadge({ status }: { status: PropertyCompanyListStatus }) {
  const className =
    status === 'Active'
      ? 'bg-[#eff8ef] text-[#2e964b]'
      : status === 'Pending'
        ? 'bg-[#fff4d8] text-[#b54708]'
        : 'bg-[#ececed] text-[#5b5b5f]'

  return (
    <span className={`shrink-0 rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px] ${className}`}>
      {status}
    </span>
  )
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "Nov 1" this year, "Jan 2027" otherwise, so the badge stays short. */
function shortStartDate(value: string) {
  const date = parseMMDDYYYY(value)
  if (!date) return value
  const month = monthNames[date.getMonth()]
  return date.getFullYear() === new Date().getFullYear() ? `${month} ${date.getDate()}` : `${month} ${date.getFullYear()}`
}

/** Pending badge showing when the company moves in; the tooltip gives the full date. */
function PendingBadge({ id, effectiveDate }: { id: string; effectiveDate: string }) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)
  const [style, setStyle] = useState<CSSProperties>({})
  const tooltipId = `pending-start-${id}`

  useLayoutEffect(() => {
    if (!visible || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setStyle({ position: 'fixed', left: rect.left + rect.width / 2, top: rect.top - 8, zIndex: 80 })
  }, [visible])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Pending, starts ${effectiveDate}`}
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="shrink-0 cursor-default whitespace-nowrap rounded-2xl bg-[#fff4d8] px-2 py-0.5 text-xs font-medium leading-[18px] text-[#b54708]"
      >
        Starts {shortStartDate(effectiveDate)}
      </button>
      {visible &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            style={style}
            className="pointer-events-none w-max -translate-x-1/2 -translate-y-full rounded-lg bg-[#262527] px-3 py-2 text-xs leading-[18px] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          >
            Pending · Starts <span className="font-medium">{effectiveDate}</span>
            <span
              aria-hidden
              className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#262527]"
            />
          </div>,
          document.body,
        )}
    </>
  )
}

type RowMenuItem = { label: string; onSelect: () => void }

function RowMenu({ label, items }: { label: string; items: RowMenuItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
        className="flex size-7 items-center justify-center rounded-lg hover:bg-[#e6e6e7]/60"
      >
        <img alt="" className="size-4 max-w-none" src={detailCompanyMenu} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 min-w-[160px] rounded-lg border border-[#e6e6e7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
              className="w-full px-3 py-2 text-left text-sm leading-5 text-[#262527] hover:bg-[#f5f5f6]"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Builds one switch target per space, with its current and pending company. */
function buildSpaceOptions(associations: SpaceAssociation[]): SwitchSpaceOption[] {
  const options = new Map<string, SwitchSpaceOption>()
  for (const association of associations) {
    const key = spaceKeyOf(association)
    const option = options.get(key) ?? { key, label: spaceLabelOf(association) }
    const companyName = getPropertyCompany(association.companyId).name
    if (association.status === 'Active') {
      option.currentCompanyId = association.companyId
      option.currentCompanyName = companyName
      option.currentContractEndDate = association.endDate || undefined
    } else if (association.status === 'Pending') {
      option.pendingAssociationId = association.id
      option.pendingCompanyName = companyName
    }
    options.set(key, option)
  }
  return [...options.values()].sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }))
}

export function CompanyListingPanel({
  associations,
  onAssociationsChange,
  selectedAssociationId,
  onSelectAssociation,
  propertyModal,
  onPropertyModalChange,
  collapsed = false,
  companyHref,
}: CompanyListingPanelProps) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'current' | 'inactive'>('current')
  const [inactiveQuery, setInactiveQuery] = useState('')
  const [inactivePage, setInactivePage] = useState(0)
  const [switchSpaceKey, setSwitchSpaceKey] = useState<string | undefined>()
  const [editPendingId, setEditPendingId] = useState<string | null>(null)
  const [editAffiliationsId, setEditAffiliationsId] = useState<string | null>(null)

  const spaceOptions = useMemo(() => buildSpaceOptions(associations), [associations])
  const editingPending = associations.find((item) => item.id === editPendingId)
  const editingAffiliations = associations.find((item) => item.id === editAffiliationsId)

  const pendingInitialForm = useMemo<SwitchCompanyFormValues | undefined>(
    () =>
      editingPending
        ? {
            spaceKey: spaceKeyOf(editingPending),
            companyId: editingPending.companyId,
            effectiveDate: editingPending.effectiveDate,
            cutOffDate: editingPending.endDate,
            affiliations: editingPending.affiliations,
          }
        : undefined,
    [editingPending],
  )

  // One list: active companies first, then pending switches (each marked by its badge).
  const currentRows = useMemo(
    () =>
      currentStatusOrder.flatMap((status) =>
        associations.filter((item) => item.status === status && matchesQuery(item, query)),
      ),
    [associations, query],
  )
  // Most recently ended first, so the latest history is on page one.
  const inactiveAll = useMemo(
    () => associations.filter((item) => item.status === 'Inactive').sort((a, b) => endTime(b) - endTime(a)),
    [associations],
  )
  const inactiveMatchingMainSearch = inactiveAll.filter((item) => matchesQuery(item, query)).length
  const inactiveFiltered = inactiveAll.filter((item) => matchesQuery(item, inactiveQuery))
  const inactivePageCount = Math.max(1, Math.ceil(inactiveFiltered.length / INACTIVE_PAGE_SIZE))
  const page = Math.min(inactivePage, inactivePageCount - 1)
  const inactivePageRows = inactiveFiltered.slice(page * INACTIVE_PAGE_SIZE, (page + 1) * INACTIVE_PAGE_SIZE)

  const openInactive = () => {
    setInactiveQuery(query)
    setInactivePage(0)
    setView('inactive')
  }

  const switchModalOpen = propertyModal !== undefined || editPendingId !== null

  const openSwitch = (spaceKey?: string) => {
    setSwitchSpaceKey(spaceKey)
    onPropertyModalChange?.('switch-company')
  }

  const closeSwitch = () => {
    setEditPendingId(null)
    setSwitchSpaceKey(undefined)
    onPropertyModalChange?.(undefined)
  }

  const handleConfirm = (payload: SwitchCompanySubmitPayload) => {
    if (payload.mode === 'edit' && payload.associationId) {
      onAssociationsChange(
        associations.map((item) =>
          item.id === payload.associationId
            ? {
                ...item,
                companyId: payload.companyId,
                effectiveDate: payload.effectiveDate,
                endDate: payload.cutOffDate,
                affiliations: payload.affiliations,
              }
            : item,
        ),
      )
      onSelectAssociation(payload.associationId)
      return
    }

    const [spaceType, spaceNumber] = payload.spaceKey.split('|') as [SpaceAssociation['spaceType'], string]
    const id = `pending-${Date.now()}`
    onAssociationsChange([
      ...associations,
      {
        id,
        spaceType,
        spaceNumber,
        companyId: payload.companyId,
        status: 'Pending',
        effectiveDate: payload.effectiveDate,
        endDate: payload.cutOffDate,
        affiliations: payload.affiliations,
      },
    ])
    onSelectAssociation(id)
  }

  const handleRevert = (associationId: string) => {
    const reverted = associations.find((item) => item.id === associationId)
    const next = associations.filter((item) => item.id !== associationId)
    onAssociationsChange(next)
    // Return to the company that stays active on the same space.
    const fallback =
      next.find((item) => item.status === 'Active' && reverted && spaceKeyOf(item) === spaceKeyOf(reverted)) ??
      next.find((item) => item.status === 'Active') ??
      next[0]
    if (fallback) onSelectAssociation(fallback.id)
  }

  const handleSaveAffiliations = (affiliations: PropertyAffiliation[]) => {
    if (!editAffiliationsId) return
    onAssociationsChange(
      associations.map((item) => (item.id === editAffiliationsId ? { ...item, affiliations } : item)),
    )
    setEditAffiliationsId(null)
  }

  return (
    <aside
      id="company-listing-panel"
      aria-label="Companies"
      aria-hidden={collapsed || undefined}
      inert={collapsed}
      className={`flex shrink-0 flex-col overflow-hidden bg-white transition-[width] duration-200 ease-out ${
        collapsed ? 'w-0 border-r-0' : 'w-[max(15vw,220px)] border-r border-[#e6e6e7]'
      }`}
    >
      <div className="flex min-h-0 w-[max(15vw,220px)] flex-1 flex-col">
      {view === 'current' ? (
        <>
          <div className="shrink-0 border-b border-[#e6e6e7] px-4 py-4">
            <h2 className="text-sm font-bold leading-5 text-[#262527]">Companies</h2>
            <SearchField value={query} onChange={setQuery} placeholder="Search companies" />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
            {currentRows.length === 0 ? (
              <p className="px-1 text-sm leading-5 text-[#86868b]">
                {query.trim() ? 'No active or pending companies match your search.' : 'No active companies.'}
              </p>
            ) : (
              <ul className={rowListClass}>
                {currentRows.map((association) => (
                  <CompanyRow
                    key={association.id}
                    association={association}
                    selected={association.id === selectedAssociationId}
                    onSelect={() => onSelectAssociation(association.id)}
                    companyHref={companyHref?.(association.companyId)}
                    menuItems={
                      association.status === 'Active'
                        ? [
                            { label: 'Switch company', onSelect: () => openSwitch(spaceKeyOf(association)) },
                            { label: 'Edit affiliation', onSelect: () => setEditAffiliationsId(association.id) },
                          ]
                        : [{ label: 'Edit switch', onSelect: () => setEditPendingId(association.id) }]
                    }
                  />
                ))}
              </ul>
            )}
          </div>

          {inactiveAll.length > 0 && (
            <button
              type="button"
              onClick={openInactive}
              className="flex shrink-0 items-center gap-2 border-t border-[#e6e6e7] px-4 py-3 text-left hover:bg-[#f5f5f6]"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium leading-5 text-[#262527]">Inactive companies</span>
                <span className="block truncate text-xs leading-[18px] text-[#86868b]">
                  {query.trim()
                    ? `${inactiveMatchingMainSearch} ${inactiveMatchingMainSearch === 1 ? 'match' : 'matches'} your search`
                    : 'Past companies on this property'}
                </span>
              </span>
              <span className="shrink-0 rounded-2xl bg-[#ececed] px-2 py-0.5 text-xs font-medium leading-[18px] text-[#5b5b5f]">
                {query.trim() ? inactiveMatchingMainSearch : inactiveAll.length}
              </span>
              <span className="shrink-0 text-[#86868b]">
                <ChevronIcon direction="right" />
              </span>
            </button>
          )}
        </>
      ) : (
        <>
          <div className="shrink-0 border-b border-[#e6e6e7] px-4 py-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Back to active companies"
                onClick={() => setView('current')}
                className="-ml-1.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-[#444446] hover:bg-[#f5f5f6]"
              >
                <ChevronIcon direction="left" />
              </button>
              <h2 className="min-w-0 flex-1 truncate text-sm font-bold leading-5 text-[#262527]">
                Inactive companies
              </h2>
              <span className="shrink-0 text-xs leading-[18px] text-[#86868b]">{inactiveAll.length}</span>
            </div>
            <SearchField
              value={inactiveQuery}
              onChange={(value) => {
                setInactiveQuery(value)
                setInactivePage(0)
              }}
              placeholder="Search inactive"
            />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-2">
            {inactivePageRows.length === 0 ? (
              <p className="px-1 py-2 text-sm leading-5 text-[#86868b]">No inactive companies match your search.</p>
            ) : (
              <ul className={rowListClass}>
                {inactivePageRows.map((association) => (
                  <CompanyRow
                    key={association.id}
                    association={association}
                    selected={association.id === selectedAssociationId}
                    onSelect={() => onSelectAssociation(association.id)}
                    companyHref={companyHref?.(association.companyId)}
                    menuItems={[]}
                    showStatus={false}
                  />
                ))}
              </ul>
            )}
          </div>

          {inactiveFiltered.length > INACTIVE_PAGE_SIZE && (
            <nav
              aria-label="Inactive companies pages"
              className="flex shrink-0 items-center justify-between gap-2 border-t border-[#e6e6e7] px-4 py-2.5"
            >
              <span className="text-xs leading-[18px] text-[#6a6a70]">
                {page * INACTIVE_PAGE_SIZE + 1}–{Math.min((page + 1) * INACTIVE_PAGE_SIZE, inactiveFiltered.length)} of{' '}
                {inactiveFiltered.length}
              </span>
              <span className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page === 0}
                  onClick={() => setInactivePage(page - 1)}
                  className="flex size-7 items-center justify-center rounded-lg border border-[#e6e6e7] text-[#444446] hover:bg-[#f5f5f6] disabled:cursor-not-allowed disabled:text-[#ccc] disabled:hover:bg-transparent"
                >
                  <ChevronIcon direction="left" />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={page >= inactivePageCount - 1}
                  onClick={() => setInactivePage(page + 1)}
                  className="flex size-7 items-center justify-center rounded-lg border border-[#e6e6e7] text-[#444446] hover:bg-[#f5f5f6] disabled:cursor-not-allowed disabled:text-[#ccc] disabled:hover:bg-transparent"
                >
                  <ChevronIcon direction="right" />
                </button>
              </span>
            </nav>
          )}
        </>
      )}

      </div>

      <SwitchCompanyModal
        open={switchModalOpen}
        mode={editingPending ? 'edit' : 'switch'}
        spaces={spaceOptions}
        initialSpaceKey={editingPending ? undefined : switchSpaceKey}
        initialForm={pendingInitialForm}
        initialCreateCompany={propertyModal === 'create-company'}
        associationId={editPendingId ?? undefined}
        onClose={closeSwitch}
        onConfirm={handleConfirm}
        onRevertPending={handleRevert}
        onFlowChange={(flow) => {
          if (flow === null) closeSwitch()
          else onPropertyModalChange?.(flow)
        }}
      />
      <EditCompanyModal
        open={editingAffiliations !== undefined}
        company={editingAffiliations ? getPropertyCompany(editingAffiliations.companyId) : null}
        initialAffiliations={editingAffiliations?.affiliations ?? []}
        onClose={() => setEditAffiliationsId(null)}
        onSave={handleSaveAffiliations}
      />
    </aside>
  )
}

function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="mt-3 flex h-9 items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3">
      <span className="relative size-4 shrink-0">
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableSearch} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm leading-5 text-[#262527] outline-none placeholder:text-[#86868b]"
      />
    </label>
  )
}

function CompanyRow({
  association,
  selected,
  onSelect,
  companyHref,
  menuItems,
  showStatus = true,
}: {
  association: SpaceAssociation
  selected: boolean
  onSelect: () => void
  companyHref?: string
  menuItems: RowMenuItem[]
  /** Off inside the inactive view, where every row shares the same status. */
  showStatus?: boolean
}) {
  const company = getPropertyCompany(association.companyId)
  const space = spaceLabelOf(association)
  const detail =
    association.status === 'Inactive' && association.endDate ? `${space} · Ended ${association.endDate}` : space
  const nameClass = 'min-w-0 truncate text-sm font-medium leading-5 text-[#262527]'

  return (
    // The select button fills the row; the name link, badge and menu sit above it.
    <li
      data-selected={selected || undefined}
      className={`relative flex items-center gap-1 rounded-[4px] pr-1 ${selected ? 'bg-blue-50' : 'bg-white hover:bg-[#f5f5f6]'}`}
    >
      <button
        type="button"
        aria-current={selected || undefined}
        aria-label={`Show ${company.name}, ${space}`}
        onClick={onSelect}
        className="absolute inset-0 rounded-[4px]"
      />
      <div className="pointer-events-none relative flex min-w-0 flex-1 flex-col gap-0.5 py-2.5 pl-2.5">
        {companyHref ? (
          <a href={companyHref} className={`pointer-events-auto self-start hover:text-primary hover:underline ${nameClass}`}>
            {company.name}
          </a>
        ) : (
          <span className={nameClass}>{company.name}</span>
        )}
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="min-w-0 truncate text-xs leading-[18px] text-[#86868b]">{detail}</span>
          {showStatus &&
            (association.status === 'Pending' ? (
              <span className="pointer-events-auto flex shrink-0">
                <PendingBadge id={association.id} effectiveDate={association.effectiveDate} />
              </span>
            ) : (
              <StatusBadge status={association.status} />
            ))}
        </div>
      </div>
      <div className="relative flex shrink-0 items-center">
        {menuItems.length > 0 ? (
          <RowMenu label={`Actions for ${company.name}, ${space}`} items={menuItems} />
        ) : (
          <span className="w-1 shrink-0" aria-hidden />
        )}
      </div>
    </li>
  )
}
