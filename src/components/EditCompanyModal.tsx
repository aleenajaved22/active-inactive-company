import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { createPortal } from 'react-dom'
import modalClose from '../assets/modal-close.svg'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import type { PropertyCompany } from '../data/propertyCompanies'
import {
  propertyAffiliationOptions,
  type PropertyAffiliation,
} from './switchCompanyTypes'

const affiliationChipStyles: Record<PropertyAffiliation, { bg: string; text: string }> = {
  Headquarters: { bg: '#fff4d8', text: '#f6a300' },
  Managed: { bg: '#e5f6ff', text: '#146dff' },
  Owned: { bg: '#f4edfd', text: '#9747ff' },
  Shared: { bg: '#fbeeed', text: '#d9534f' },
  'Regional Office': { bg: '#eff8ef', text: '#2e964b' },
  Tenant: { bg: '#ffeed4', text: '#ef5c07' },
}

function companyRecordLabel(company: PropertyCompany) {
  const suffix = company.id.replace(/-/g, '').slice(-6).padStart(6, '0')
  return `TK-PAT-Company_${suffix}`
}

function AffiliationChipSelect({
  value,
  onChange,
}: {
  value: Set<PropertyAffiliation>
  onChange: (next: Set<PropertyAffiliation>) => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [open])

  const selectedList = propertyAffiliationOptions.filter((label) => value.has(label))

  const toggle = (label: PropertyAffiliation) => {
    const next = new Set(value)
    if (next.has(label)) next.delete(label)
    else next.add(label)
    onChange(next)
  }

  const remove = (label: PropertyAffiliation, event: ReactMouseEvent) => {
    event.stopPropagation()
    const next = new Set(value)
    next.delete(label)
    onChange(next)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-10 w-full items-center gap-2 rounded-lg border border-[#aeaeb2] bg-white px-3 py-2 text-left"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selectedList.length === 0 ? (
            <span className="text-base leading-6 text-[#ccc]">Select Option</span>
          ) : (
            selectedList.map((label) => {
              const style = affiliationChipStyles[label]
              return (
                <span
                  key={label}
                  className="inline-flex max-w-full items-center gap-1 rounded-2xl px-2 py-0.5 text-sm leading-5"
                  style={{ backgroundColor: style.bg, color: style.text }}
                >
                  <span className="truncate">{label}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove ${label}`}
                    className="shrink-0 text-base leading-none opacity-70 hover:opacity-100"
                    onClick={(event) => remove(label, event)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        remove(label, event as unknown as ReactMouseEvent)
                      }
                    }}
                  >
                    ×
                  </span>
                </span>
              )
            })
          )}
        </div>
        <span className="relative size-4 shrink-0">
          <img
            alt=""
            className={`absolute inset-0 block size-full max-w-none transition-transform ${open ? 'rotate-180' : ''}`}
            src={questionsChevronDown}
          />
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-multiselectable
          className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[220px] overflow-y-auto rounded-lg border border-[#e6e6e7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          {propertyAffiliationOptions.map((label) => {
            const selected = value.has(label)
            const style = affiliationChipStyles[label]
            return (
              <li key={label} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => toggle(label)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm leading-5 hover:bg-[#f5f5f6] ${
                    selected ? 'bg-[#f5f5f6]' : ''
                  }`}
                >
                  <span
                    className="inline-flex rounded-2xl px-2 py-0.5 text-sm leading-5"
                    style={{ backgroundColor: style.bg, color: style.text }}
                  >
                    {label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export type EditCompanyModalProps = {
  open: boolean
  company: PropertyCompany | null
  initialAffiliations: PropertyAffiliation[]
  onClose: () => void
  onSave: (affiliations: PropertyAffiliation[]) => void
}

export function EditCompanyModal({
  open,
  company,
  initialAffiliations,
  onClose,
  onSave,
}: EditCompanyModalProps) {
  const [affiliations, setAffiliations] = useState<Set<PropertyAffiliation>>(new Set())

  useEffect(() => {
    if (!open) return
    setAffiliations(new Set(initialAffiliations))
  }, [open, initialAffiliations])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open || !company) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-company-title"
    >
      <button type="button" className="absolute inset-0 bg-[#262527]/40" aria-label="Close dialog" onClick={onClose} />
      <div className="relative flex w-full max-w-[480px] flex-col rounded-xl border border-[#e6e6e7] bg-white p-6 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]">
        <div className="mb-4 flex w-full items-start gap-2 border-b border-[#e6e6e7] pb-4">
          <div className="min-w-0 flex-1">
            <h2 id="edit-company-title" className="text-xl font-bold leading-7 text-[#262527]">
              Edit Company
            </h2>
            <p className="mt-1 text-sm leading-5 text-[#6a6a70]">You can edit contact against different labels</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="relative size-6 shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={modalClose} />
          </button>
        </div>

        <div className="mb-5 rounded-lg bg-[#f5f5f6] px-4 py-3">
          <p className="text-sm font-medium leading-5 text-[#262527]">{companyRecordLabel(company)}</p>
          <p className="mt-0.5 text-sm leading-5 text-[#86868b]">{company.companyOwner}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-company-affiliation" className="text-sm font-medium leading-5 text-[#86868b]">
            Property Affiliation
          </label>
          <AffiliationChipSelect value={affiliations} onChange={setAffiliations} />
        </div>

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
            onClick={() => onSave([...affiliations])}
            className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm leading-5 text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
