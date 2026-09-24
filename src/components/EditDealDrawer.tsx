import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import modalClose from '../assets/modal-close.svg'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import { ModalDateInput } from './ModalDateInput'

type EditDealDrawerProps = {
  open: boolean
  onClose: () => void
}

function DrawerLabel({ children, required, variant = 'medium' }: { children: ReactNode; required?: boolean; variant?: 'medium' | 'regular' }) {
  return (
    <p
      className={`text-sm leading-5 ${variant === 'regular' ? 'font-normal text-[#444446]' : 'font-medium text-[#86868b]'}`}
    >
      {children}
      {required && <span className="text-[#b32318]"> *</span>}
    </p>
  )
}

function DrawerSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full appearance-none rounded-lg border border-[#e6e6e7] bg-white px-3.5 text-base leading-6 outline-none ${
          value ? 'text-[#262527]' : 'text-[#ccc]'
        }`}
      >
        {placeholder ? (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option} value={option}>
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

function DrawerTextInput({
  id,
  value,
  onChange,
  placeholder,
  readOnly,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      onChange={(event) => onChange(event.target.value)}
      className={`h-11 w-full rounded-lg border border-[#e6e6e7] bg-white px-3.5 text-base leading-6 outline-none placeholder:text-[#ccc] ${
        readOnly ? 'text-[#aeaeb2]' : 'text-[#262527]'
      }`}
    />
  )
}

function MetricField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <DrawerLabel variant="regular">{label}</DrawerLabel>
      <DrawerTextInput id={id} value={value} onChange={onChange} placeholder={label} />
    </div>
  )
}

export function EditDealDrawer({ open, onClose }: EditDealDrawerProps) {
  const [propertyName, setPropertyName] = useState('TK-PAT-Property_855606')
  const [propertySource, setPropertySource] = useState('ALN')
  const [associatedFranchise, setAssociatedFranchise] = useState('420 - Automation')
  const [tenancy, setTenancy] = useState('')
  const [occupancyRate, setOccupancyRate] = useState('')
  const [annualRevenue, setAnnualRevenue] = useState('')
  const [squareFootage, setSquareFootage] = useState('')
  const [numUnits, setNumUnits] = useState('')
  const [amenities, setAmenities] = useState('')
  const [numberOfBuildings, setNumberOfBuildings] = useState('')
  const [parkingSpaces, setParkingSpaces] = useState('')
  const [avgRent, setAvgRent] = useState('')
  const [buildingClass, setBuildingClass] = useState('')
  const [companyAssociationEndDate, setCompanyAssociationEndDate] = useState('')

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-[#000000]/50"
        aria-label="Close edit property drawer"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-deal-title"
        className="relative flex h-full w-full max-w-[796px] flex-col bg-white p-6 shadow-[0px_20px_12px_rgba(16,24,40,0.1),0px_8px_4px_rgba(16,24,40,0.04)]"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-8 flex shrink-0 items-start justify-between gap-2">
            <div>
              <h2 id="edit-deal-title" className="text-xl font-bold leading-7 text-[#262527]">
                Edit Property
              </h2>
              <p className="mt-1 text-sm leading-5 text-[#6a6a70]">You can edit following information</p>
            </div>
            <button type="button" aria-label="Close" onClick={onClose} className="size-6 shrink-0">
              <img alt="" className="block size-full max-w-none" src={modalClose} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex max-w-[748px] flex-col gap-5">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <DrawerLabel required variant="regular">
                    Property / Property Name
                  </DrawerLabel>
                  <DrawerTextInput id="edit-property-name" value={propertyName} onChange={setPropertyName} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <DrawerLabel required variant="regular">
                    Property Source
                  </DrawerLabel>
                  <DrawerSelect
                    id="edit-property-source"
                    value={propertySource}
                    onChange={setPropertySource}
                    options={['ALN', 'Organic', 'Manual']}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <DrawerLabel variant="regular">Associated Franchise</DrawerLabel>
                <DrawerSelect
                  id="edit-property-franchise"
                  value={associatedFranchise}
                  onChange={setAssociatedFranchise}
                  options={['420 - Automation', '204 - Central Valencia']}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <DrawerLabel variant="regular">Tenancy</DrawerLabel>
                <DrawerSelect
                  id="edit-property-tenancy"
                  value={tenancy}
                  onChange={setTenancy}
                  options={['Single Tenant', 'Multi Tenant', 'Owner Occupied']}
                  placeholder="Tenancy"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <MetricField id="edit-property-occupancy-rate" label="Occupancy Rate" value={occupancyRate} onChange={setOccupancyRate} />
                <MetricField id="edit-property-annual-revenue" label="Annual Revenue" value={annualRevenue} onChange={setAnnualRevenue} />
                <MetricField id="edit-property-square-footage" label="Square Footage" value={squareFootage} onChange={setSquareFootage} />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <MetricField id="edit-property-num-units" label="No. of Units" value={numUnits} onChange={setNumUnits} />
                <MetricField id="edit-property-amenities" label="Amenities" value={amenities} onChange={setAmenities} />
                <MetricField
                  id="edit-property-num-buildings"
                  label="Number of Buildings"
                  value={numberOfBuildings}
                  onChange={setNumberOfBuildings}
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <MetricField id="edit-property-parking-spaces" label="Parking Spaces" value={parkingSpaces} onChange={setParkingSpaces} />
                <MetricField id="edit-property-avg-rent" label="Avg. Rent" value={avgRent} onChange={setAvgRent} />
                <MetricField id="edit-property-building-class" label="Building Class" value={buildingClass} onChange={setBuildingClass} />
              </div>

              <div className="flex flex-col gap-1.5">
                <DrawerLabel variant="regular">Company Association End Date</DrawerLabel>
                <ModalDateInput
                  id="edit-deal-company-association-end-date"
                  value={companyAssociationEndDate}
                  onChange={setCompanyAssociationEndDate}
                  variant="drawer"
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-[#e6e6e7] pt-6">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2 text-sm font-medium leading-5 text-[#444446]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  window.alert('Property updated (prototype)')
                  onClose()
                }}
                className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm font-medium leading-5 text-white"
              >
                Update Property
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
