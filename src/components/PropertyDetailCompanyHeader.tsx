import contactAvatarAleena from '../assets/contacts/avatar-aleena.png'
import contactAvatarDarrell from '../assets/contacts/avatar-darrell.png'
import contactAvatarJohn from '../assets/contacts/avatar-john.png'
import type { CompanyAffiliationBadge } from '../data/propertyDetailSidePanel'
import type { PropertyCompanyListStatus } from '../data/propertyCompanies'
import { PendingStatusBadge } from './PendingStatusBadge'
import { CompanyListStatusBadge } from './PropertyLeadActivities'
import type { ReactNode } from 'react'

type PropertyDetailCompanyHeaderProps = {
  companyName: string
  listStatus: PropertyCompanyListStatus
  ownerName: string
  affiliations: CompanyAffiliationBadge[]
  pendingEffectiveDate?: string
  pendingTooltipId?: string
}

const ownerAvatarByName: Record<string, string> = {
  'John Doe': contactAvatarJohn,
  'Mike Smith': contactAvatarJohn,
  'Trachise Withrow': contactAvatarDarrell,
  'Augustus Waters': contactAvatarAleena,
}

function ownerAvatarSrc(ownerName: string) {
  return ownerAvatarByName[ownerName] ?? contactAvatarJohn
}

function HeaderLabeledBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex w-fit flex-col items-start gap-1">
      <span className="text-xs leading-[18px] text-[#86868b]">{label}</span>
      {children}
    </div>
  )
}

function CompanySitePlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="24" fill="#E6E6E7" />
      <path
        d="M8.33366 1.79167H11.6667C12.0914 1.79167 12.4522 1.94153 12.7555 2.24479C13.059 2.54822 13.2092 2.90943 13.2087 3.33366V5.12467H16.6667C17.0916 5.12467 17.4521 5.27534 17.7555 5.57877C18.0589 5.88219 18.2092 6.24247 18.2087 6.66667V15.8337C18.2086 16.2584 18.0579 16.6192 17.7546 16.9225C17.4512 17.2258 17.0908 17.3752 16.6667 17.3747H3.33366C2.90877 17.3747 2.54725 17.225 2.24381 16.9215C1.94058 16.6182 1.79119 16.2577 1.79167 15.8337V6.66667C1.79167 6.2419 1.94153 5.88118 2.24479 5.5778C2.54822 5.27437 2.90943 5.12416 3.33366 5.12467H6.79167V3.33366C6.79167 2.90877 6.94136 2.54725 7.24479 2.24381C7.5482 1.94043 7.90946 1.79115 8.33366 1.79167ZM3.20866 15.9587H16.7917V12.3747H12.3747V14.0417H7.62467V12.3747H3.20866V15.9587ZM9.04167 12.6247H10.9587V10.7087H9.04167V12.6247ZM3.20866 10.9587H7.62467V9.29167H12.3747V10.9587H16.7917V6.54167H3.20866V10.9587ZM8.20866 5.12467H11.7917V3.20866H8.20866V5.12467Z"
        fill="#86868B"
        stroke="#86868B"
        strokeWidth="0.25"
        transform="translate(14 14)"
      />
    </svg>
  )
}

export function PropertyDetailCompanyHeader({
  companyName,
  listStatus,
  ownerName,
  affiliations,
  pendingEffectiveDate,
  pendingTooltipId,
}: PropertyDetailCompanyHeaderProps) {
  return (
    <div className="shrink-0 border-b border-[#e6e6e7] bg-[rgb(245_245_246/0.5)]">
      <div className="flex items-start px-8 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <CompanySitePlaceholderIcon className="size-12 shrink-0" />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate text-xl font-bold leading-7 text-[#262527]">{companyName}</p>
              <p className="flex min-w-0 items-center gap-1 text-xs leading-[18px] text-[#86868b]">
                <span className="shrink-0">Owner :</span>
                <span className="inline-flex min-w-0 items-center gap-1">
                  <img
                    alt=""
                    className="size-[18px] shrink-0 rounded-full object-cover"
                    src={ownerAvatarSrc(ownerName)}
                  />
                  <span className="truncate text-[#262527]">{ownerName}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-stretch gap-4">
            <HeaderLabeledBlock label="Affiliation">
              <div className="flex max-w-[320px] flex-wrap gap-1.5">
                {affiliations.map((badge) => (
                  <span
                    key={badge.label}
                    className="rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px]"
                    style={{ backgroundColor: badge.bg, color: badge.text }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </HeaderLabeledBlock>
            <div className="w-px shrink-0 self-stretch bg-[#e6e6e7]" aria-hidden />
            <HeaderLabeledBlock label="Association Status">
              {listStatus === 'Pending' && pendingEffectiveDate !== undefined ? (
                <PendingStatusBadge
                  size="lg"
                  effectiveDate={pendingEffectiveDate}
                  tooltipId={pendingTooltipId ?? 'pending-effective-date-header'}
                />
              ) : (
                <CompanyListStatusBadge status={listStatus} size="lg" />
              )}
            </HeaderLabeledBlock>
          </div>
        </div>
      </div>
    </div>
  )
}
