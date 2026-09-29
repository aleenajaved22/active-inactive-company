import { useMemo, useState } from 'react'
import tableSearch from '../assets/table-search.svg'
import {
  propertyCompanies,
  type PropertyCompany,
  type PropertyCompanyListStatus,
  type PropertyCompanySelection,
} from '../data/propertyCompanies'

type CompanyListingPanelProps = {
  selectedCompanyId: string
  selectedListStatus: PropertyCompanyListStatus
  onSelectCompany: (selection: PropertyCompanySelection) => void
  onSwitchCompany: (companyId: string) => void
}

function statusOf(company: PropertyCompany): 'Active' | 'Inactive' {
  return company.listStatus === 'Inactive' ? 'Inactive' : 'Active'
}

function StatusBadge({ status }: { status: 'Active' | 'Inactive' }) {
  const className =
    status === 'Active' ? 'bg-[#eff8ef] text-[#2e964b]' : 'bg-[#ececed] text-[#5b5b5f]'

  return (
    <span className={`shrink-0 rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px] ${className}`}>
      {status}
    </span>
  )
}

export function CompanyListingPanel({
  selectedCompanyId,
  selectedListStatus,
  onSelectCompany,
  onSwitchCompany,
}: CompanyListingPanelProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return propertyCompanies.filter((company) => {
      if (!needle) return true
      return company.name.toLowerCase().includes(needle)
    })
  }, [query])

  const activeCompanies = filtered.filter((company) => statusOf(company) === 'Active')
  const inactiveCompanies = filtered.filter((company) => statusOf(company) === 'Inactive')

  return (
    <aside className="flex w-[15vw] shrink-0 flex-col overflow-hidden border-r border-[#e6e6e7] bg-white">
      <div className="shrink-0 border-b border-[#e6e6e7] px-4 py-4">
        <h2 className="text-sm font-bold leading-5 text-[#262527]">Companies</h2>
        <label className="mt-3 flex h-9 items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3">
          <span className="relative size-4 shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableSearch} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search companies"
            aria-label="Search companies"
            className="min-w-0 flex-1 bg-transparent text-sm leading-5 text-[#262527] outline-none placeholder:text-[#86868b]"
          />
        </label>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-4">
        {filtered.length === 0 ? (
          <p className="px-1 text-sm leading-5 text-[#86868b]">No companies match your search.</p>
        ) : (
          <>
            <CompanyGroup
              title="Active"
              companies={activeCompanies}
              selectedCompanyId={selectedCompanyId}
              selectedListStatus={selectedListStatus}
              onSelectCompany={onSelectCompany}
              onSwitchCompany={onSwitchCompany}
            />
            <CompanyGroup
              title="Inactive"
              companies={inactiveCompanies}
              selectedCompanyId={selectedCompanyId}
              selectedListStatus={selectedListStatus}
              onSelectCompany={onSelectCompany}
              onSwitchCompany={onSwitchCompany}
            />
          </>
        )}
      </div>
    </aside>
  )
}

function CompanyGroup({
  title,
  companies,
  selectedCompanyId,
  selectedListStatus,
  onSelectCompany,
  onSwitchCompany,
}: {
  title: 'Active' | 'Inactive'
  companies: PropertyCompany[]
  selectedCompanyId: string
  selectedListStatus: PropertyCompanyListStatus
  onSelectCompany: (selection: PropertyCompanySelection) => void
  onSwitchCompany: (companyId: string) => void
}) {
  if (companies.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="px-1 text-xs font-medium leading-[18px] text-[#86868b]">
        {title} ({companies.length})
      </p>
      <ul className="flex flex-col divide-y divide-[#e6e6e7]">
        {companies.map((company) => {
          const status = statusOf(company)
          const selected = selectedListStatus === status && company.id === selectedCompanyId

          return (
            <li key={company.id}>
              <button
                type="button"
                onClick={() => {
                  if (selected) {
                    onSelectCompany({ companyId: company.id, listStatus: status })
                    return
                  }
                  onSwitchCompany(company.id)
                }}
                className={`flex w-full items-center justify-between gap-2 px-2.5 py-2.5 text-left ${
                  selected ? 'bg-blue-50' : 'bg-white hover:bg-[#f5f5f6]'
                }`}
              >
                <span
                  className={`min-w-0 truncate text-sm leading-5 text-[#262527] ${
                    selected ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {company.name}
                </span>
                <StatusBadge status={status} />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
