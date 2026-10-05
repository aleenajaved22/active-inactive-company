import { useState } from 'react'
import { marketVerticalOptions, partnershipStatusOptions } from '../data/companyAssociation'
import { MobileActionFooter, MOBILE_ACTION_FOOTER_HEIGHT } from './MobileActionFooter'
import { MobileSelectField, MobileTextField } from './MobileFields'
import { MobilePageHeader } from './MobilePageHeader'

/** The web app's Create Company modal as a full screen. */
export function MobileCreateCompanyScreen({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: () => void
}) {
  const [companyDomain, setCompanyDomain] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [marketVertical, setMarketVertical] = useState('')
  const [partnershipStatus, setPartnershipStatus] = useState('')
  const [employeeCount, setEmployeeCount] = useState('')
  const [revenue, setRevenue] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const nameError = submitAttempted && !companyName.trim() ? 'Add a company name.' : null
  const verticalError = submitAttempted && !marketVertical ? 'Select a market vertical.' : null

  const submit = () => {
    setSubmitAttempted(true)
    if (!companyName.trim() || !marketVertical) return
    onCreate()
  }

  return (
    <div className="absolute inset-0 z-[60] flex flex-col overflow-hidden bg-white">
      <div
        className="no-scrollbar absolute inset-0 overflow-y-auto"
        style={{ paddingTop: 100, paddingBottom: MOBILE_ACTION_FOOTER_HEIGHT + 24 }}
      >
        <div className="flex flex-col gap-3 px-4 pt-5">
          <MobileTextField
            label="Company Domain"
            value={companyDomain}
            onChange={setCompanyDomain}
            placeholder="e.g., www.teamsignal.com"
          />
          <MobileTextField
            label="Company Name"
            required
            value={companyName}
            onChange={setCompanyName}
            placeholder="Add company name"
            error={nameError}
          />
          <MobileSelectField
            label="Market Vertical"
            required
            value={marketVertical}
            onChange={setMarketVertical}
            options={marketVerticalOptions}
            placeholder="Select market vertical"
            error={verticalError}
          />
          <MobileSelectField
            label="Strategic Partnership Status"
            value={partnershipStatus}
            onChange={setPartnershipStatus}
            options={partnershipStatusOptions}
            placeholder="Select owner"
          />
          <MobileTextField
            label="No. of Employees"
            value={employeeCount}
            onChange={setEmployeeCount}
            placeholder="No. of employees"
            inputMode="numeric"
          />
          <MobileTextField
            label="Revenue"
            value={revenue}
            onChange={setRevenue}
            placeholder="Add revenue"
          />
        </div>
      </div>

      <MobilePageHeader title="Create Company" onBack={onClose} />
      <MobileActionFooter label="Create Company" onClick={submit} />
    </div>
  )
}
