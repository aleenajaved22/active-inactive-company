import { useState } from 'react'
import { CreatePropertyDrawer } from './CreatePropertyDrawer'
import paginationChevronDown from '../assets/pagination-chevron-down.svg'
import paginationChevronLeft from '../assets/pagination-chevron-left.svg'
import paginationChevronRight from '../assets/pagination-chevron-right.svg'
import tableChevronDown from '../assets/table-chevron-down.svg'
import tableChevronRight from '../assets/table-chevron-right.svg'
import tableFilterList from '../assets/table-filter-list.svg'
import tablePlus from '../assets/table-plus.svg'
import tableRepeat from '../assets/table-repeat.svg'
import tableSearch from '../assets/table-search.svg'
import tableStar from '../assets/table-star.svg'
import tableSync from '../assets/table-sync.svg'
import { affiliationStyles, propertyRows } from '../data/properties'

type PropertiesDataSectionProps = {
  onSelectProperty: (index: number) => void
}

function CheckboxCell() {
  return (
    <div className="flex size-4 items-center justify-center rounded border border-[#d0cfd2]" aria-hidden />
  )
}

function AffiliationBadge({ variant }: { variant: keyof typeof affiliationStyles }) {
  const style = affiliationStyles[variant]
  return (
    <span className={`inline-flex rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px] ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  )
}

function PropertyNameCell({ name, sync, starred }: { name: string; sync?: boolean; starred?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium leading-5 text-[#444446]">{name}</span>
      {sync && (
        <span className="flex size-4 items-center justify-center rounded bg-[#146dff]">
          <span className="relative size-2.5">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableRepeat} />
          </span>
        </span>
      )}
      {starred && (
        <span className="flex size-4 items-center justify-center rounded bg-[#fe7711]">
          <span className="relative size-2.5">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableStar} />
          </span>
        </span>
      )}
    </div>
  )
}

function Pagination() {
  return (
    <div className="flex h-14 flex-1 items-center justify-end gap-6 border-t border-[#e6e6e7] bg-white px-6 py-2.5">
      <div className="flex flex-1 items-center justify-end gap-0.5">
        <p className="flex-1 text-right text-sm leading-5 text-[#444446]">Rows per page: 15</p>
        <span className="relative size-3.5 shrink-0">
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={paginationChevronDown} />
        </span>
      </div>
      <p className="text-sm leading-5 text-[#444446]">1-15 of 12,345</p>
      <div className="flex gap-3">
        <button
          type="button"
          aria-label="Previous page"
          className="flex size-8 items-center justify-center rounded-[19px] border border-[#d0cfd2] bg-white p-2"
        >
          <span className="relative size-5">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={paginationChevronLeft} />
          </span>
        </button>
        <button
          type="button"
          aria-label="Next page"
          className="flex size-8 items-center justify-center rounded-[19px] border border-[#d0cfd2] bg-white p-2"
        >
          <span className="relative size-5">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={paginationChevronRight} />
          </span>
        </button>
      </div>
    </div>
  )
}

export function PropertiesDataSection({ onSelectProperty }: PropertiesDataSectionProps) {
  const [createPropertyOpen, setCreatePropertyOpen] = useState(false)
  return (
    <section className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex items-start justify-between gap-4 px-8 py-3">
        <div className="flex items-center gap-2">
          <label className="flex h-9 w-[440px] max-w-full items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2.5">
            <span className="relative size-5 shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableSearch} />
            </span>
            <span className="text-xs leading-[18px] text-[#86868b]">Search by ID, property...</span>
          </label>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-lg bg-white px-3.5 py-2.5"
          >
            <span className="text-xs font-medium leading-[18px] text-[#262527]">Approved</span>
            <span className="rounded-2xl bg-[#eff8ff] px-2 py-0.5 text-[10px] font-medium leading-[18px] text-primary">
              378
            </span>
            <span className="relative size-4 shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableChevronDown} />
            </span>
          </button>
          <button type="button" className="flex h-9 items-center gap-1 rounded-lg px-3.5 py-2">
            <span className="text-xs font-medium leading-[18px] text-[#262527]">More Filters</span>
            <span className="relative size-4 shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableFilterList} />
            </span>
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-[#b81515] bg-white px-3.5 py-2"
          >
            <span className="text-sm font-medium leading-5 text-[#b32318]">Pending Review</span>
            <span className="rounded-2xl bg-[#fef3f2] px-2 py-0.5 text-[10px] font-medium leading-[18px] text-[#b42318]">
              378
            </span>
            <span className="relative h-4 w-[11px] shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableChevronRight} />
            </span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-[#146dff] bg-white px-3.5 py-2"
          >
            <span className="relative size-4 shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableSync} />
            </span>
            <span className="text-sm font-medium leading-5 text-[#146dff]">Sync Leads</span>
          </button>
          <button
            type="button"
            onClick={() => setCreatePropertyOpen(true)}
            className="flex items-center gap-1 rounded-lg border border-[#146dff] bg-[#146dff] px-3.5 py-2"
          >
            <span className="relative size-4 shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={tablePlus} />
            </span>
            <span className="text-sm font-medium leading-5 text-white">Create Property</span>
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-8">
        <div className="inline-flex min-w-full shadow-[1px_0_1px_rgba(0,0,0,0.12)]">
          <table className="min-w-full border-collapse bg-white text-left">
            <thead>
              <tr className="border-t border-[#e6e6e7]">
                <th className="w-16 border-t border-[#e6e6e7] px-6 py-3">
                  <CheckboxCell />
                </th>
                <th className="whitespace-nowrap border-t border-[#e6e6e7] px-6 py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]">
                  ID
                </th>
                <th className="whitespace-nowrap border-t border-[#e6e6e7] px-6 py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]">
                  Property Name
                </th>
                <th className="whitespace-nowrap border-t border-[#e6e6e7] px-6 py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]">
                  Property Affiliation
                </th>
                <th className="whitespace-nowrap border-t border-[#e6e6e7] px-6 py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]">
                  Company Name
                </th>
                <th className="whitespace-nowrap border-t border-[#e6e6e7] px-6 py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]">
                  Parent Company
                </th>
                <th className="whitespace-nowrap border-t border-[#e6e6e7] px-6 py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]">
                  Deals Count
                </th>
                <th className="whitespace-nowrap border-t border-[#e6e6e7] px-6 py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]">
                  Country
                </th>
                <th className="whitespace-nowrap border-t border-[#e6e6e7] px-6 py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]">
                  State
                </th>
              </tr>
            </thead>
            <tbody>
              {propertyRows.map((row, index) => (
                <tr
                  key={`${row.id}-${index}`}
                  className="cursor-pointer border-t border-[#e6e6e7] hover:bg-[#f5f5f6]"
                  onClick={() => onSelectProperty(index)}
                >
                  <td className="px-6 py-3" onClick={(event) => event.stopPropagation()}>
                    <CheckboxCell />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium leading-5 text-[#444446]">{row.id}</td>
                  <td className="px-6 py-4">
                    <PropertyNameCell name={row.name} sync={row.sync} starred={row.starred} />
                  </td>
                  <td className="px-6 py-4">
                    <AffiliationBadge variant={row.affiliation} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm leading-5 text-[#86868b]">{row.company}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm leading-5 text-[#86868b]">{row.parentCompany}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm leading-5 text-[#86868b]">{row.dealsCount}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm leading-5 text-[#86868b]">{row.country}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm leading-5 text-[#86868b]">{row.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination />
      <CreatePropertyDrawer open={createPropertyOpen} onClose={() => setCreatePropertyOpen(false)} />
    </section>
  )
}
