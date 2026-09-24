import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import modalClose from '../assets/modal-close.svg'
import questionsChevronDown from '../assets/questions-chevron-down.svg'

const marketVerticalOptions = [
  'Retail',
  'Food & Beverage',
  'Healthcare',
  'Technology',
  'Real Estate',
  'Other',
] as const

const partnershipStatusOptions = ['Active', 'Prospective', 'Inactive', 'None'] as const

type CreateCompanyModalProps = {
  open: boolean
  onClose: () => void
  onCancel: () => void
  onCreate?: () => void
}

function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <p className="text-sm font-medium leading-5 text-[#86868b]">
      {children}
      {required && <span className="text-[#b32318]"> *</span>}
    </p>
  )
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-[#aeaeb2] bg-white px-3.5 py-2.5 text-base leading-6 text-[#262527] outline-none placeholder:text-[#ccc]"
    />
  )
}

function SelectField({
  id,
  value,
  onChange,
  placeholder,
  options,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: readonly string[]
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full appearance-none rounded-lg border border-[#aeaeb2] bg-white px-3.5 py-2.5 text-base leading-6 outline-none ${
          value ? 'text-[#262527]' : 'text-[#ccc]'
        }`}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-[#262527]">
            {option}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" aria-hidden>
        <img alt="" className="block size-full max-w-none" src={questionsChevronDown} />
      </span>
    </div>
  )
}

export function CreateCompanyModal({ open, onClose, onCancel, onCreate }: CreateCompanyModalProps) {
  const [companyDomain, setCompanyDomain] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [marketVertical, setMarketVertical] = useState('')
  const [partnershipStatus, setPartnershipStatus] = useState('')
  const [employeeCount, setEmployeeCount] = useState('')
  const [revenue, setRevenue] = useState('')

  useEffect(() => {
    if (!open) return
    setCompanyDomain('')
    setCompanyName('')
    setMarketVertical('')
    setPartnershipStatus('')
    setEmployeeCount('')
    setRevenue('')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-company-title"
    >
      <button type="button" className="absolute inset-0 bg-[#262527]/40" aria-label="Close dialog" onClick={onClose} />
      <div className="relative flex w-full max-w-[780px] flex-col rounded-xl border border-[#e6e6e7] bg-white p-6 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]">
        <div className="relative mb-5 w-full pr-8">
          <h2 id="create-company-title" className="text-base font-bold leading-6 text-[#262527]">
            Create a New Company
          </h2>
          <p className="mt-1 text-sm leading-5 text-[#6a6a70]">Add the following information to create a new company</p>
          <button type="button" aria-label="Close" onClick={onClose} className="absolute right-0 top-0 size-6">
            <img alt="" className="block size-full max-w-none" src={modalClose} />
          </button>
        </div>

        <div className="h-px w-full bg-[#e6e6e7]" />

        <div className="flex flex-col gap-5 pt-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Company Domain</FieldLabel>
              <TextInput
                id="create-company-domain"
                value={companyDomain}
                onChange={setCompanyDomain}
                placeholder="e.g., www.teamsignal.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Company Name</FieldLabel>
              <TextInput
                id="create-company-name"
                value={companyName}
                onChange={setCompanyName}
                placeholder="Add company name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Market Vertical</FieldLabel>
              <SelectField
                id="create-company-vertical"
                value={marketVertical}
                onChange={setMarketVertical}
                placeholder="Select market vertical"
                options={marketVerticalOptions}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Strategic Partnership Status</FieldLabel>
              <SelectField
                id="create-company-partnership"
                value={partnershipStatus}
                onChange={setPartnershipStatus}
                placeholder="Select owner"
                options={partnershipStatusOptions}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>No. of Employees</FieldLabel>
              <TextInput
                id="create-company-employees"
                value={employeeCount}
                onChange={setEmployeeCount}
                placeholder="No. of employees"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Revenue</FieldLabel>
              <TextInput
                id="create-company-revenue"
                value={revenue}
                onChange={setRevenue}
                placeholder="Add revenue"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 h-px w-full bg-[#e6e6e7]" />

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#aeaeb2] bg-white px-3.5 py-2 text-sm leading-5 text-[#444446]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onCreate?.()
              onCancel()
            }}
            className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm leading-5 text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
          >
            Create Company
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
