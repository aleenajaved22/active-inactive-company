import { useMemo, useState } from 'react'
import detailPlus from '../assets/detail-plus.svg'
import tableSearch from '../assets/table-search.svg'
import { getPropertyCompany, type PropertyCompanyListStatus } from '../data/propertyCompanies'
import {
  parseMMDDYYYY,
  spaceLabelOf,
  type SpaceAssociation,
} from '../data/propertySpaceAssociations'
import { formatShortDate } from '../data/dateFormat'
import { CollapsedPanelRail, PANEL_RAIL_WIDTH } from './CollapsedPanelRail'
import { PendingStatusBadge } from './PendingStatusBadge'
import { ActionMenu, type ActionMenuItem } from './companyActions'

type CompanyListingPanelProps = {
  associations: SpaceAssociation[]
  selectedAssociationId: string
  onSelectAssociation: (id: string) => void
  /** Row ⋮ actions, shared with the company header. */
  menuItemsFor: (association: SpaceAssociation) => ActionMenuItem[]
  /** Hides the panel while keeping its search, view and page state. */
  collapsed?: boolean
  /** Current panel width in px (ignored while collapsed). */
  width?: number
  /** Expands the panel from its collapsed rail. */
  onExpand?: () => void
  /** Opens the flow to add a company to a space on this property. */
  onAddCompany?: () => void
  companyHref?: (companyId: string) => string
}

const DEFAULT_PANEL_WIDTH = 232
const currentStatusOrder: PropertyCompanyListStatus[] = ['Active', 'Pending']
const INACTIVE_PAGE_SIZE = 8

// Row separators, hidden around the selected row so its rounded highlight stands alone.
const rowListClass =
  'flex flex-col divide-y divide-[#e6e6e7] [&>li[data-selected]]:border-b-transparent [&>li:has(+li[data-selected])]:border-b-transparent'

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

export function CompanyListingPanel({
  associations,
  selectedAssociationId,
  onSelectAssociation,
  menuItemsFor,
  collapsed = false,
  width = DEFAULT_PANEL_WIDTH,
  onExpand,
  onAddCompany,
  companyHref,
}: CompanyListingPanelProps) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'current' | 'inactive'>('current')
  const [inactiveQuery, setInactiveQuery] = useState('')
  const [inactivePage, setInactivePage] = useState(0)
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

  return (
    <aside
      id="company-listing-panel"
      aria-label="Companies"
      style={{ width: collapsed ? PANEL_RAIL_WIDTH : width }}
      className="flex shrink-0 flex-col overflow-hidden bg-white transition-[width] duration-200 ease-out"
    >
      {collapsed ? (
        <CollapsedPanelRail label="Companies" count={currentRows.length} onExpand={() => onExpand?.()} />
      ) : (
      <div className="flex min-h-0 flex-1 flex-col" style={{ width }}>
      {view === 'current' ? (
        <>
          <div className="shrink-0 border-b border-[#e6e6e7] px-6 pb-5 pt-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold leading-5 text-[#262527]">Companies ({currentRows.length})</h2>
              {onAddCompany && (
                <button
                  type="button"
                  onClick={onAddCompany}
                  className="flex shrink-0 items-center gap-1 text-sm font-medium leading-5 text-primary hover:underline"
                >
                  <span className="relative size-4 shrink-0" aria-hidden>
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={detailPlus} />
                  </span>
                  Add
                </button>
              )}
            </div>
            <SearchField value={query} onChange={setQuery} placeholder="Search companies" />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-3">
            {currentRows.length === 0 ? (
              <p className="px-6 text-sm leading-5 text-[#86868b]">
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
                    menuItems={menuItemsFor(association)}
                  />
                ))}
              </ul>
            )}
          </div>

          {inactiveAll.length > 0 && (
            <button
              type="button"
              onClick={openInactive}
              className="flex shrink-0 items-center gap-2 border-t border-[#e6e6e7] px-6 py-3 text-left hover:bg-[#f5f5f6]"
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
          <div className="shrink-0 border-b border-[#e6e6e7] px-6 pb-5 pt-4">
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
                Inactive companies ({inactiveAll.length})
              </h2>
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

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-0 pb-2">
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
                    menuItems={menuItemsFor(association)}
                    showStatus={false}
                  />
                ))}
              </ul>
            )}
          </div>

          {inactiveFiltered.length > INACTIVE_PAGE_SIZE && (
            <nav
              aria-label="Inactive companies pages"
              className="flex shrink-0 items-center justify-between gap-2 border-t border-[#e6e6e7] px-6 py-2.5"
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
      )}
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
  menuItems: ActionMenuItem[]
  /** Off inside the inactive view, where every row shares the same status. */
  showStatus?: boolean
}) {
  const company = getPropertyCompany(association.companyId)
  const space = spaceLabelOf(association)
  const detail =
    association.status === 'Inactive' && association.endDate ? `${space} · Ended ${formatShortDate(association.endDate)}` : space
  const nameClass = 'min-w-0 truncate text-sm font-medium leading-5 text-[#262527]'

  return (
    // The select button fills the row; the name link, badge and menu sit above it.
    <li
      data-selected={selected || undefined}
      className={`relative flex items-center gap-1 pr-6 ${selected ? 'bg-blue-50' : 'bg-white hover:bg-[#f5f5f6]'}`}
    >
      <button
        type="button"
        aria-current={selected || undefined}
        aria-label={`Show ${company.name}, ${space}`}
        onClick={onSelect}
        className="absolute inset-0"
      />
      {selected && <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-primary" />}
      <div className="pointer-events-none relative flex min-w-0 flex-1 flex-col gap-1.5 py-2.5 pl-6">
        {companyHref ? (
          <a href={companyHref} className={`pointer-events-auto max-w-full self-start hover:text-primary hover:underline ${nameClass}`}>
            {company.name}
          </a>
        ) : (
          <span className={nameClass}>{company.name}</span>
        )}
        <span title={detail} className="min-w-0 truncate text-[13px] leading-[18px] text-[#5b5b5f]">
          {detail}
        </span>
      </div>
      {showStatus &&
        (association.status === 'Pending' ? (
          <span className="relative flex shrink-0">
            <PendingStatusBadge
              effectiveDate={association.effectiveDate}
              tooltipId={`pending-start-${association.id}`}
            />
          </span>
        ) : (
          <span className="pointer-events-none relative flex shrink-0">
            <StatusBadge status={association.status} />
          </span>
        ))}
      <div className="relative flex shrink-0 items-center">
        {menuItems.length > 0 ? (
          <ActionMenu label={`Actions for ${company.name}, ${space}`} items={menuItems} />
        ) : (
          <span className="w-1 shrink-0" aria-hidden />
        )}
      </div>
    </li>
  )
}
