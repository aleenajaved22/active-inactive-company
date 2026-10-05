import { useState } from 'react'
import { propertyAffiliationOptions, type PropertyAffiliation } from '../components/switchCompanyTypes'
import { validateCompanyEndDate } from '../data/companyAssociation'
import { MobileChoiceChips, MobileDateField, MobileFieldHint } from './MobileFields'
import { MobileSheet } from './MobileSheet'

/** The web app's Edit Company modal: affiliations plus the association end date. */
export function MobileEditCompanySheet({
  open,
  companyName,
  initialAffiliations,
  initialEndDate,
  effectiveDate,
  nextCompany,
  onClose,
  onSave,
}: {
  open: boolean
  companyName: string
  initialAffiliations: PropertyAffiliation[]
  initialEndDate: string
  effectiveDate: string
  nextCompany?: { name: string; effectiveDate: string }
  onClose: () => void
  onSave: (values: { affiliations: PropertyAffiliation[]; endDate: string }) => void
}) {
  const [affiliations, setAffiliations] = useState<Set<string>>(new Set<string>(initialAffiliations))
  const [endDate, setEndDate] = useState(initialEndDate)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const endDateError = validateCompanyEndDate({ endDate, effectiveDate, nextCompany })

  const toggle = (label: string) => {
    setAffiliations((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const save = () => {
    setSubmitAttempted(true)
    if (endDateError) return
    onSave({ affiliations: [...affiliations] as PropertyAffiliation[], endDate: endDate.trim() })
    onClose()
  }

  return (
    <MobileSheet open={open} onClose={onClose} title={`Edit ${companyName}`}>
      <div className="no-scrollbar flex min-h-0 flex-col gap-4 overflow-y-auto px-4 pb-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium leading-5 text-[#262527]">Property Affiliation</p>
          <MobileChoiceChips
            options={propertyAffiliationOptions}
            selected={affiliations}
            onToggle={toggle}
          />
        </div>

        <div className="flex flex-col gap-1">
          <MobileDateField
            label="Company at property till date"
            value={endDate}
            onChange={setEndDate}
            error={submitAttempted ? endDateError : null}
          />
          <MobileFieldHint>
            Optional. The company stays at this property until this date, then is dissociated.
          </MobileFieldHint>
        </div>

        <button
          type="button"
          onClick={save}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-[#146dff] text-base font-medium leading-5 text-white"
        >
          Save
        </button>
      </div>
    </MobileSheet>
  )
}
