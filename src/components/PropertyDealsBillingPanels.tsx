import { useEffect, useMemo, useRef, useState } from 'react'
import detailDealOpen from '../assets/detail-deal-open.svg'
import detailEdit2 from '../assets/detail-edit-2.svg'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import tablePlus from '../assets/table-plus.svg'
import tableSearch from '../assets/table-search.svg'
import type { CompanyDealCard, PropertyCompany } from '../data/propertyCompanies'
import { mainPanelLinkClass, mainPanelPrimaryButtonClass } from './mainPanelReadOnlyStyles'

const stageFilterOptions = [
  'All',
  'Approved',
  'Discovery',
  'Qualified',
  'Needs Assessment',
  'Negotiation',
  'Current Customer',
  'Lost Proposal',
  'Lost Customer',
  'Nurture',
] as const

function dealMatchesStageFilter(deal: CompanyDealCard, filter: string): boolean {
  if (filter === 'All') return true
  const dealStage = deal.stage.toLowerCase()
  const needle = filter.toLowerCase()
  if (dealStage.includes(needle)) return true
  if (needle === 'lost proposal' && dealStage.includes('proposal')) return true
  if (needle === 'lost customer' && dealStage.includes('closed lost')) return true
  if (needle === 'current customer' && dealStage.includes('closed won')) return true
  return false
}

function StagesFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (stage: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 items-center gap-2 rounded-lg bg-white px-3.5 text-sm text-[#262527]"
      >
        {value || 'All Stages'}
        <span className={`relative size-4 shrink-0 ${open ? 'rotate-180' : ''}`}>
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={questionsChevronDown} />
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 max-h-[280px] min-w-full w-max overflow-y-auto rounded-lg border border-[#e6e6e7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          {stageFilterOptions.map((option) => (
            <li key={option} role="option" aria-selected={value === option}>
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-sm leading-5 text-[#262527] hover:bg-[#f5f5f6]"
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function BillingInfoField({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className ?? 'w-[233px] max-w-full shrink-0'}>
      <p className="text-xs leading-[18px] text-[#86868b]">{label}</p>
      <p className="mt-0.5 text-sm font-medium leading-5 text-[#262527]">{value}</p>
    </div>
  )
}

function stageBadgeClass(stage: string): string {
  const normalized = stage.toLowerCase()
  if (normalized.includes('proposal')) return 'bg-[#e5f6ff] text-[#146dff]'
  if (normalized.includes('closed won')) return 'bg-[#eff8ef] text-[#2e964b]'
  if (normalized.includes('closed lost')) return 'bg-[#fbeeed] text-[#b32318]'
  if (normalized.includes('terminated')) return 'bg-[#fef0c7] text-[#f4780b]'
  if (normalized.includes('negotiation')) return 'bg-[#f4edfd] text-[#9747ff]'
  return 'bg-[#f5f5f6] text-[#5b5b5f]'
}

type DealsTabPanelProps = {
  company: PropertyCompany
  readOnly?: boolean
}

export function DealsTabPanel({ company, readOnly = false }: DealsTabPanelProps) {
  const [stageFilter, setStageFilter] = useState('')

  const filteredDeals = useMemo(() => {
    if (!stageFilter || stageFilter === 'All') return company.deals
    return company.deals.filter((deal) => dealMatchesStageFilter(deal, stageFilter))
  }, [company.deals, stageFilter])

  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col gap-4 pb-6">
      <div className="relative z-10 flex w-full flex-wrap items-center gap-3">
        <label className="flex h-9 w-[240px] shrink-0 items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5">
          <span className="relative size-5 shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableSearch} />
          </span>
          <span className="text-sm text-[#86868b]">Search by deal name</span>
        </label>
        <StagesFilter value={stageFilter} onChange={setStageFilter} />
        <button type="button" className={`ml-auto h-9 shrink-0 ${mainPanelPrimaryButtonClass(readOnly, 'filled')}`}>
          <span className="relative size-4">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={tablePlus} />
          </span>
          New deal
        </button>
      </div>
      <div className="overflow-x-auto border-y border-[#e6e6e7]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="border-b border-[#e6e6e7] bg-white">
            <tr>
              {['Deal Name', 'Amount', 'Date ↓', 'Stage', ''].map((h) => (
                <th key={h || 'actions'} className="whitespace-nowrap px-4 py-3 text-xs font-medium text-[#5b5b5f]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal) => (
              <tr key={deal.id} className="border-t border-[#e6e6e7] hover:bg-[#f5f5f6]">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-[#262527]">{deal.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[#86868b]">{deal.amount}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[#86868b]">{deal.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-2xl px-2 py-0.5 text-xs font-medium ${stageBadgeClass(deal.stage)}`}>
                    {deal.stage}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    aria-label={`Open ${deal.name}`}
                    onClick={() => window.alert(`Open deal: ${deal.name} (prototype)`)}
                    className="relative size-5"
                  >
                    <img alt="" className="block size-full max-w-none" src={detailDealOpen} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

type BillingAddressTabPanelProps = {
  company: PropertyCompany
  readOnly?: boolean
}

export function BillingAddressTabPanel({ company, readOnly = false }: BillingAddressTabPanelProps) {
  const billing = company.billingAddress

  return (
    <div className="mt-6 flex flex-col overflow-y-auto pb-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h3 className="text-base font-bold leading-6 text-[#262527]">Billing Address</h3>
        <button
          type="button"
          onClick={() => window.alert('Edit billing address (prototype)')}
          className={`flex shrink-0 items-center gap-2 text-sm font-medium capitalize tracking-[0.4px] ${mainPanelLinkClass(readOnly)}`}
        >
          <img alt="" className="size-4" src={detailEdit2} />
          Edit
        </button>
      </div>
      <div className="flex flex-wrap gap-x-2.5 gap-y-3.5">
        <BillingInfoField label="Contact" value={billing.contact} />
        <BillingInfoField label="Address" value={billing.address} className="min-w-[233px] flex-[1_1_486px] max-w-full" />
        <BillingInfoField label="Country" value={billing.country} />
        <BillingInfoField label="State" value={billing.state} />
        <BillingInfoField label="City" value={billing.city} />
        <BillingInfoField label="Zipcode" value={billing.zipcode} />
      </div>
    </div>
  )
}
