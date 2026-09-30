import contactAvatarAleena from '../assets/contacts/avatar-aleena.png'
import contactAvatarDarrell from '../assets/contacts/avatar-darrell.png'
import contactAvatarJohn from '../assets/contacts/avatar-john.png'
import type { CompanyAffiliationBadge } from '../data/propertyDetailSidePanel'
import type { PropertyCompanyListStatus } from '../data/propertyCompanies'
import { PendingStatusBadge } from './PendingStatusBadge'
import { CompanyListStatusBadge } from './PropertyLeadActivities'
import { ActionMenu, type ActionMenuItem } from './companyActions'
import type { ReactNode } from 'react'

type PropertyDetailCompanyHeaderProps = {
  companyName: string
  /** Same ⋮ actions as this company's row in the Companies panel. */
  actions?: ActionMenuItem[]
  /** Opens the company detail page when set. */
  companyHref?: string
  /** The suite, unit or floor this company holds on the property. */
  spaceLabel?: string
  listStatus: PropertyCompanyListStatus
  ownerName: string
  parentCompany?: string
  parentCompanyHref?: string
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

function HeaderLabeledBlock({
  label,
  children,
  className = 'shrink-0',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex min-w-0 flex-col items-start gap-1 ${className}`}>
      <span className="text-xs leading-[18px] text-[#86868b]">{label}</span>
      {children}
    </div>
  )
}

export function PropertyDetailCompanyHeader({
  companyName,
  actions = [],
  companyHref,
  spaceLabel,
  listStatus,
  ownerName,
  parentCompany,
  parentCompanyHref,
  affiliations,
  pendingEffectiveDate,
  pendingTooltipId,
}: PropertyDetailCompanyHeaderProps) {
  return (
    <div className="shrink-0 border-b border-[#e6e6e7] bg-[rgb(245_245_246/0.5)]">
      <div className="flex items-start px-8 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <div className="flex min-w-[180px] flex-1 items-center gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {companyHref ? (
                <a
                  href={companyHref}
                  title={`Open ${companyName}`}
                  className="group flex min-w-0 items-center gap-1 text-xl font-bold leading-7 text-[#262527] hover:text-primary"
                >
                  <span className="truncate group-hover:underline">{companyName}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                    className="shrink-0 text-[#86868b] group-hover:text-primary"
                  >
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ) : (
                <p className="truncate text-xl font-bold leading-7 text-[#262527]">{companyName}</p>
              )}
              <p className="flex min-w-0 items-center gap-1 whitespace-nowrap text-xs leading-[18px] text-[#86868b]">
                {spaceLabel && (
                  <>
                    <span className="shrink-0 font-medium text-[#262527]">{spaceLabel}</span>
                    <span className="shrink-0" aria-hidden>
                      ·
                    </span>
                  </>
                )}
                <button
                  type="button"
                  title={`Owner: ${ownerName}`}
                  aria-label={`Owner: ${ownerName}`}
                  onClick={() => window.alert(`Owner: ${ownerName} (prototype)`)}
                  className="group/owner relative inline-flex shrink-0 items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <img
                    alt=""
                    className="size-[18px] shrink-0 rounded-full object-cover ring-primary/40 transition group-hover/owner:ring-2"
                    src={ownerAvatarSrc(ownerName)}
                  />
                  <span className="text-[#262527]">{ownerName}</span>
                  {/* Role label appears below on hover/focus. */}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute left-0 top-full z-10 mt-1 rounded bg-[#262527] px-2 py-1 text-xs leading-4 text-white opacity-0 transition-opacity duration-150 group-hover/owner:opacity-100 group-focus-visible/owner:opacity-100"
                  >
                    Owner
                  </span>
                </button>
              </p>
            </div>
          </div>

          <div className="flex min-w-0 shrink items-stretch gap-4">
            {parentCompany && (
              <>
                <HeaderLabeledBlock label="Parent Company" className="min-w-[72px] max-w-[180px] shrink">
                  {parentCompanyHref ? (
                    <a
                      href={parentCompanyHref}
                      title={`Open ${parentCompany}`}
                      className="group flex h-[22px] max-w-full items-center gap-0.5 text-sm font-medium leading-[22px] text-[#262527] hover:text-primary"
                    >
                      <span className="truncate group-hover:underline">{parentCompany}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                        className="shrink-0 text-[#86868b] group-hover:text-primary"
                      >
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ) : (
                    <span
                      className="block h-[22px] max-w-full truncate text-sm font-medium leading-[22px] text-[#262527]"
                      title={parentCompany}
                    >
                      {parentCompany}
                    </span>
                  )}
                </HeaderLabeledBlock>
                <div className="w-px shrink-0 self-stretch bg-[#e6e6e7]" aria-hidden />
              </>
            )}
            <HeaderLabeledBlock label="Affiliation" className="min-w-[96px] shrink">
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
            <div className="flex shrink-0 items-start gap-1">
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
              <div className="flex h-[48px] items-end">
                <ActionMenu label={`Actions for ${companyName}`} items={actions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
