import { useMemo, useState } from 'react'
import { getPropertyCompany, type PropertyCompanyListStatus } from '../data/propertyCompanies'
import {
  parseMMDDYYYY,
  spaceLabelOf,
  type SpaceAssociation,
} from '../data/propertySpaceAssociations'
import { IconAdd, IconSearch } from './MobileIcons'
import { MobileSelectRow } from './MobileSelectRow'
import { MobileSheet, type MobileActionItem } from './MobileSheet'
import { formatShortDate } from '../data/dateFormat'
import { MobileListStatusBadge } from './MobileStatusPills'

/** Current = the web panel's Active and Pending rows; everything else is history. */
const currentStatusOrder: PropertyCompanyListStatus[] = ['Active', 'Pending']
const INACTIVE_PAGE_SIZE = 8

const endTime = (association: SpaceAssociation) =>
  parseMMDDYYYY(association.endDate)?.getTime() ?? 0

const matchesQuery = (association: SpaceAssociation, query: string) => {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const company = getPropertyCompany(association.companyId)
  return `${company.name} ${company.parentCompany ?? ''} ${spaceLabelOf(association)}`
    .toLowerCase()
    .includes(needle)
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
    <label className="flex h-9 items-center gap-2 rounded-[10px] bg-[#f6f6f8] px-4 py-[7px]">
      <IconSearch size={16} className="text-[#86868b]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-base leading-6 text-black outline-none placeholder:text-[#86868b] [&::-webkit-search-cancel-button]:hidden"
      />
    </label>
  )
}

function AssociationRow({
  association,
  selected,
  onSelect,
  onMore,
}: {
  association: SpaceAssociation
  selected: boolean
  onSelect: () => void
  onMore?: () => void
}) {
  const company = getPropertyCompany(association.companyId)
  const trailing =
    association.status === 'Pending'
      ? `Effective ${formatShortDate(association.effectiveDate)}`
      : company.parentCompany
  return (
    <MobileSelectRow
      label={company.name}
      detail={[spaceLabelOf(association), trailing].filter(Boolean).join(' · ')}
      checked={selected}
      onSelect={onSelect}
      status={<MobileListStatusBadge status={association.status} />}
      onMore={onMore}
      moreLabel={`Actions for ${company.name}`}
    />
  )
}

type MobileCompaniesSheetProps = {
  open: boolean
  associations: SpaceAssociation[]
  selectedAssociationId: string
  onSelectAssociation: (id: string) => void
  onClose: () => void
  onAddCompany: () => void
  /** Status-dependent row actions, mirroring the web app's ⋮ menu. */
  actionsFor: (association: SpaceAssociation) => MobileActionItem[]
  onShowActions: (association: SpaceAssociation, items: MobileActionItem[]) => void
}

/** The two lists the drawer switches between, each with its count. */
function ViewToggle({
  view,
  onChange,
  currentCount,
  inactiveCount,
}: {
  view: 'current' | 'inactive'
  onChange: (view: 'current' | 'inactive') => void
  currentCount: number
  inactiveCount: number
}) {
  const options = [
    { id: 'current' as const, label: 'Current', count: currentCount },
    { id: 'inactive' as const, label: 'Inactive', count: inactiveCount },
  ]
  return (
    <div role="tablist" aria-label="Company list" className="flex gap-0.5 rounded-[10px] bg-[#f6f6f8] p-0.5">
      {options.map((option) => {
        const active = view === option.id
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm leading-5 ${
              active
                ? 'bg-white font-medium text-black shadow-[0px_1px_3px_rgba(16,24,40,0.12)]'
                : 'text-[#6a6a70]'
            }`}
          >
            {option.label}
            <span
              className={`rounded-full px-1.5 text-xs font-medium leading-[18px] ${
                active ? 'bg-[#e5f6ff] text-[#146dff]' : 'bg-[#ececed] text-[#6a6a70]'
              }`}
            >
              {option.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * The mobile stand-in for the web app's companies column. One drawer, with a
 * switch between the companies on the property now and its inactive history;
 * the counts sit on the switch, and one search box filters whichever list is
 * showing. The inactive list is paged, as on the web.
 */
export function MobileCompaniesSheet({
  open,
  associations,
  selectedAssociationId,
  onSelectAssociation,
  onClose,
  onAddCompany,
  actionsFor,
  onShowActions,
}: MobileCompaniesSheetProps) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'current' | 'inactive'>('current')
  const [inactivePage, setInactivePage] = useState(0)

  // Active first, then pending switches — each marked by its badge.
  const currentRows = useMemo(
    () =>
      currentStatusOrder.flatMap((status) =>
        associations.filter((item) => item.status === status && matchesQuery(item, query)),
      ),
    [associations, query],
  )
  const inactiveFiltered = useMemo(
    () =>
      associations
        .filter((item) => item.status === 'Inactive' && matchesQuery(item, query))
        .sort((a, b) => endTime(b) - endTime(a)),
    [associations, query],
  )
  const pageCount = Math.max(1, Math.ceil(inactiveFiltered.length / INACTIVE_PAGE_SIZE))
  const page = Math.min(inactivePage, pageCount - 1)
  const inactivePageRows = inactiveFiltered.slice(
    page * INACTIVE_PAGE_SIZE,
    (page + 1) * INACTIVE_PAGE_SIZE,
  )

  const rows = view === 'current' ? currentRows : inactivePageRows

  const select = (id: string) => {
    onSelectAssociation(id)
    onClose()
  }

  const showActions = (association: SpaceAssociation) => {
    const items = actionsFor(association)
    if (items.length > 0) onShowActions(association, items)
  }

  const switchView = (next: 'current' | 'inactive') => {
    setView(next)
    setInactivePage(0)
  }

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="Companies"
      action={
        <button
          type="button"
          onClick={onAddCompany}
          className="flex shrink-0 items-center gap-1 text-sm font-medium leading-5 text-[#146dff]"
        >
          <IconAdd size={18} />
          Add
        </button>
      }
    >
      <div className="flex flex-col gap-2 px-[18px] pb-2 pt-3">
        <ViewToggle
          view={view}
          onChange={switchView}
          currentCount={currentRows.length}
          inactiveCount={inactiveFiltered.length}
        />
        <SearchField
          value={query}
          onChange={(value) => {
            setQuery(value)
            setInactivePage(0)
          }}
          placeholder={view === 'current' ? 'Search companies' : 'Search past companies'}
        />
      </div>

      <div className="no-scrollbar min-h-[360px] flex-1 overflow-y-auto px-[18px] pb-6">
        {rows.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm leading-5 text-[#86868b]">
            {query.trim()
              ? view === 'current'
                ? 'No active or pending companies match your search.'
                : 'No past companies match your search.'
              : view === 'current'
                ? 'No active companies.'
                : 'No past companies.'}
          </p>
        ) : (
          <ul role="radiogroup" aria-label="Companies" className="flex flex-col">
            {rows.map((association) => (
              <AssociationRow
                key={association.id}
                association={association}
                selected={association.id === selectedAssociationId}
                onSelect={() => select(association.id)}
                onMore={() => showActions(association)}
              />
            ))}
          </ul>
        )}

        {view === 'inactive' && pageCount > 1 && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setInactivePage((value) => Math.max(value - 1, 0))}
              className="rounded-lg bg-[#f6f6f8] px-4 py-2.5 text-sm font-medium leading-5 text-[#146dff] disabled:text-[#c7c7cc]"
            >
              Previous
            </button>
            <span className="text-xs leading-[18px] text-[#86868b]">
              Page {page + 1} of {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setInactivePage((value) => Math.min(value + 1, pageCount - 1))}
              className="rounded-lg bg-[#f6f6f8] px-4 py-2.5 text-sm font-medium leading-5 text-[#146dff] disabled:text-[#c7c7cc]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </MobileSheet>
  )
}
