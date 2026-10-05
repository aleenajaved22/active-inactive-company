import type { PropertyCompanyListStatus } from '../data/propertyCompanies'
import { formatShortDate } from '../data/dateFormat'

const listStatusStyles: Record<PropertyCompanyListStatus, { bg: string; text: string }> = {
  Active: { bg: '#eff8ef', text: '#2e964b' },
  Pending: { bg: '#fff4d8', text: '#b54708' },
  Inactive: { bg: '#ececed', text: '#5b5b5f' },
}

export function MobileListStatusBadge({ status }: { status: PropertyCompanyListStatus }) {
  const style = listStatusStyles[status]
  return (
    <span
      className="w-fit shrink-0 rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px]"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {status}
    </span>
  )
}

/**
 * Pending association. The web app hides the effective date behind a hover
 * tooltip; touch has no hover, so the date is shown inline.
 */
export function MobilePendingBadge({ effectiveDate }: { effectiveDate: string }) {
  const date = effectiveDate.trim() ? formatShortDate(effectiveDate) : '—'
  return (
    <span className="flex w-fit shrink-0 items-center gap-1 rounded-2xl bg-[#fff4d8] px-2 py-0.5 text-xs font-medium leading-[18px] text-[#b54708]">
      Pending
      <span className="font-normal text-[#b54708]/80">· from {date}</span>
    </span>
  )
}

export function MobileAffiliationBadges({
  badges,
}: {
  badges: { label: string; bg: string; text: string }[]
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className="rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px]"
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {badge.label}
        </span>
      ))}
    </div>
  )
}
