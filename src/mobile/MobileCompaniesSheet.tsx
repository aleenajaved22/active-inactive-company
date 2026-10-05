import { useMemo, useState } from 'react'
import { getPropertyCompany, type PropertyCompanyListStatus } from '../data/propertyCompanies'
import {
  parseMMDDYYYY,
  spaceLabelOf,
  type SpaceAssociation,
} from '../data/propertySpaceAssociations'
import { IconAdd, IconChevronRight, IconSearch } from './MobileIcons'
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

/**
 * The mobile stand-in for the web app's companies column, keeping its two
 * views: current companies, and a drill-down into the inactive history with
 * its own search and pagination.
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
  const [inactiveQuery, setInactiveQuery] = useState('')
  const [inactivePage, setInactivePage] = useState(0)

  // Active first, then pending switches — each marked by its badge.
  const currentRows = useMemo(
    () =>
      currentStatusOrder.flatMap((status) =>
        associations.filter((item) => item.status === status && matchesQuery(item, query)),
      ),
    [associations, query],
  )
  const inactiveAll = useMemo(
    () =>
      associations
        .filter((item) => item.status === 'Inactive')
        .sort((a, b) => endTime(b) - endTime(a)),
    [associations],
  )
  const inactiveMatchingMainSearch = inactiveAll.filter((item) => matchesQuery(item, query)).length
  const inactiveFiltered = inactiveAll.filter((item) => matchesQuery(item, inactiveQuery))
  const pageCount = Math.max(1, Math.ceil(inactiveFiltered.length / INACTIVE_PAGE_SIZE))
  const page = Math.min(inactivePage, pageCount - 1)
  const inactivePageRows = inactiveFiltered.slice(
    page * INACTIVE_PAGE_SIZE,
    (page + 1) * INACTIVE_PAGE_SIZE,
  )

  // The drill-down inherits whatever was typed in the current view, as on the web.
  const openInactive = () => {
    setInactiveQuery(query)
    setInactivePage(0)
    setView('inactive')
  }

  const select = (id: string) => {
    onSelectAssociation(id)
    onClose()
  }

  const showActions = (association: SpaceAssociation) => {
    const items = actionsFor(association)
    if (items.length > 0) onShowActions(association, items)
  }

  if (view === 'inactive') {
    return (
      <MobileSheet
        open={open}
        onClose={onClose}
        onBack={() => setView('current')}
        title={`Inactive (${inactiveFiltered.length})`}
      >
        <div className="px-[18px] pb-2 pt-3">
          <SearchField
            value={inactiveQuery}
            onChange={(value) => {
              setInactiveQuery(value)
              setInactivePage(0)
            }}
            placeholder="Search past companies"
          />
        </div>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-[18px] pb-6">
          {inactivePageRows.length === 0 ? (
            <p className="px-1 py-6 text-center text-sm leading-5 text-[#86868b]">
              No past companies match your search.
            </p>
          ) : (
            <ul role="radiogroup" aria-label="Companies" className="flex flex-col">
              {inactivePageRows.map((association) => (
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
          {pageCount > 1 && (
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

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title={`Companies (${currentRows.length})`}
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
      <div className="px-[18px] pb-2 pt-3">
        <SearchField value={query} onChange={setQuery} placeholder="Search companies" />
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-[18px]">
        {currentRows.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm leading-5 text-[#86868b]">
            {query.trim()
              ? 'No active or pending companies match your search.'
              : 'No active companies.'}
          </p>
        ) : (
          <ul role="radiogroup" aria-label="Companies" className="flex flex-col">
            {currentRows.map((association) => (
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
      </div>

      {inactiveAll.length > 0 && (
        <button
          type="button"
          onClick={openInactive}
          className="flex shrink-0 items-center gap-2 border-t border-[#e6e6e7] px-[18px] py-3 pb-6 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium leading-5 text-[#262527]">
              Inactive companies
            </span>
            <span className="block truncate text-xs leading-[18px] text-[#86868b]">
              {query.trim()
                ? `${inactiveMatchingMainSearch} ${inactiveMatchingMainSearch === 1 ? 'match' : 'matches'} your search`
                : 'Past companies on this property'}
            </span>
          </span>
          <span className="shrink-0 rounded-2xl bg-[#ececed] px-2 py-0.5 text-xs font-medium leading-[18px] text-[#5b5b5f]">
            {query.trim() ? inactiveMatchingMainSearch : inactiveAll.length}
          </span>
          <IconChevronRight size={20} className="shrink-0 text-[#86868b]" />
        </button>
      )}
    </MobileSheet>
  )
}
