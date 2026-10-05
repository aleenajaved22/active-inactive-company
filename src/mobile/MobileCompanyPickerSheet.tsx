import { useMemo, useState } from 'react'
import { propertyCompanies } from '../data/propertyCompanies'
import { IconAdd, IconSearch } from './MobileIcons'
import { MobileSelectRow } from './MobileSelectRow'
import { MobileSheet } from './MobileSheet'

/**
 * The web app's company combobox as a drawer: search every company, or branch
 * off to create one.
 */
export function MobileCompanyPickerSheet({
  open,
  selectedId,
  onSelect,
  onClose,
  onCreateCompany,
}: {
  open: boolean
  selectedId: string
  onSelect: (companyId: string) => void
  onClose: () => void
  onCreateCompany: () => void
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return propertyCompanies
    return propertyCompanies.filter((company) => company.name.toLowerCase().includes(needle))
  }, [query])

  return (
    <MobileSheet open={open} onClose={onClose} title="Select Company" layer={45}>
      <div className="px-[18px] pt-3">
        <label className="flex h-9 items-center gap-2 rounded-[10px] bg-[#f6f6f8] px-4 py-[7px]">
          <IconSearch size={16} className="text-[#86868b]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent text-base leading-6 text-black outline-none placeholder:text-[#86868b] [&::-webkit-search-cancel-button]:hidden"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={onCreateCompany}
        className="mx-[18px] mt-3 flex items-center gap-2 self-start text-sm font-semibold leading-5 text-[#146dff]"
      >
        <IconAdd size={18} />
        Create new
      </button>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-[18px] pb-8 pt-1">
        {filtered.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm leading-5 text-[#86868b]">
            No companies match your search.
          </p>
        ) : (
          <ul role="radiogroup" aria-label="Companies" className="flex flex-col">
            {filtered.map((company) => (
              <MobileSelectRow
                key={company.id}
                label={company.name}
                detail={company.parentCompany}
                checked={company.id === selectedId}
                onSelect={() => {
                  onSelect(company.id)
                  onClose()
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </MobileSheet>
  )
}
