import { useState } from 'react'
import logo from '../assets/logo.svg'
import {
  emailTenants,
  foEmailBody,
  foEmailHeadline,
  foEmailSendingRules,
  foEmailSubject,
  sampleFoEmail,
  tenantBranding,
  type EmailTenant,
} from '../data/foEmailTemplate'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#e6e6e7] py-2.5 last:border-b-0">
      <span className="shrink-0 text-sm leading-5 text-[#86868b]">{label}</span>
      <span className="min-w-0 text-right text-sm font-medium leading-5 text-[#262527]">{value}</span>
    </div>
  )
}

/**
 * The Franchise Owner email template, rendered at email width so the layout and
 * copy can be reviewed. Signal and Filtergo swap the branding; the structure —
 * headline, button, body, detail block, contracts table, footer — is shared.
 */
export function FranchiseOwnerEmailPage() {
  const [tenant, setTenant] = useState<EmailTenant>('Signal')
  const brand = tenantBranding[tenant]
  const data = sampleFoEmail

  return (
    <div className="min-h-screen w-full bg-[#f5f5f6] py-10">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5 px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold leading-7 text-[#262527]">Franchise Owner email</h1>
            <p className="mt-1 text-sm leading-5 text-[#6a6a70]">
              Company leaving a property with active contracts running past the till date.
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-[#e6e6e7] bg-white p-1">
            {emailTenants.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={tenant === option}
                onClick={() => setTenant(option)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium leading-5 ${
                  tenant === option ? 'text-white' : 'text-[#5b5b5f] hover:bg-[#f5f5f6]'
                }`}
                style={tenant === option ? { backgroundColor: brand.accent } : undefined}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#e6e6e7] bg-white px-4 py-3">
          <p className="text-xs leading-[18px] text-[#86868b]">Subject</p>
          <p className="mt-0.5 text-sm font-medium leading-5 text-[#262527]">{foEmailSubject(data)}</p>
        </div>

        {/* The email itself, at the width a mail client renders it. */}
        <div className="overflow-hidden rounded-xl border border-[#e6e6e7] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 px-8 py-5" style={{ backgroundColor: brand.accentSoft }}>
            <img alt="" className="h-6 max-w-none" src={logo} />
            <span className="text-base font-bold leading-6" style={{ color: brand.accent }}>
              {brand.name}
            </span>
          </div>

          <div className="flex flex-col gap-5 px-8 py-7">
            <h2 className="text-xl font-bold leading-7 text-[#262527]">{foEmailHeadline(data)}</h2>

            <a
              href="#/property/0"
              className="w-fit rounded-lg px-4 py-2.5 text-sm font-medium leading-5 text-white"
              style={{ backgroundColor: brand.accent }}
            >
              View Property
            </a>
            <p className="-mt-3 text-xs leading-[18px] text-[#86868b]">
              Opens the property with this company selected.
            </p>

            <div className="flex flex-col gap-3">
              {foEmailBody(data).map((paragraph) => (
                <p key={paragraph} className="text-sm leading-6 text-[#444446]">
                  {paragraph}
                </p>
              ))}
              <p className="text-sm leading-6 text-[#444446]">
                Regards,
                <br />
                {brand.name}
              </p>
            </div>

            <div className="rounded-lg border border-[#e6e6e7] px-4 py-1">
              <DetailRow label="Address" value={data.propertyAddress} />
              <DetailRow label="Company" value={data.companyName} />
              <DetailRow label="Company at Property - Till Date" value={data.tillDate} />
            </div>

            <div>
              <p className="mb-2 text-sm font-bold leading-5 text-[#262527]">Active contracts</p>
              <div className="overflow-x-auto rounded-lg border border-[#e6e6e7]">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="bg-[#f5f5f6]">
                    <tr>
                      {['Deal Name', 'Type', 'Date'].map((heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-4 py-2.5 text-xs font-medium leading-[18px] text-[#5b5b5f]"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.contracts.map((contract) => (
                      <tr key={contract.dealName} className="border-t border-[#e6e6e7]">
                        <td className="px-4 py-2.5 font-medium text-[#262527]">{contract.dealName}</td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-[#86868b]">{contract.type}</td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-[#86868b]">{contract.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs leading-[18px] text-[#86868b]">
                Contracts have no names of their own, so each row names the deal it came from.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-[#e6e6e7] bg-[#f5f5f6] px-8 py-6">
            <div className="flex flex-wrap gap-4">
              {brand.social.map((channel) => (
                <span key={channel} className="text-sm leading-5" style={{ color: brand.accent }}>
                  {channel}
                </span>
              ))}
            </div>
            <p className="text-xs leading-[18px] text-[#86868b]">
              {brand.name} · {brand.address}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[#e6e6e7] bg-white px-6 py-5">
          <p className="text-sm font-bold leading-5 text-[#262527]">Sending rules</p>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
            {foEmailSendingRules.map((rule) => (
              <li key={rule} className="text-sm leading-6 text-[#6a6a70]">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
