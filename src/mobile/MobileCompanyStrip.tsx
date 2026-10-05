import type { PropertyCompanyListStatus } from '../data/propertyCompanies'
import { IconStore, IconUnfold } from './MobileIcons'
import { MobileListStatusBadge } from './MobileStatusPills'

type MobileCompanyStripProps = {
  companyName: string
  status: PropertyCompanyListStatus
  /** The floor, suite or unit this company holds, e.g. "Floor 1, Suite 104". */
  spaceLabel: string
  assignee: string
  /** 1-based position among the companies currently on the property, if it is one of them. */
  position: number | null
  /** How many companies are currently on the property. */
  total: number
  onClick: () => void
}

/**
 * The company in context, sitting between the stage rail and the tabs.
 *
 * Every tab below belongs to one company, so that company has to be named where
 * the tabs are — the web app does the same with its company header. It replaces
 * the floating pill that used to carry this at the bottom right, which sat apart
 * from the tabs it governed, hid the company's status, and covered content.
 *
 * It is also the switcher: tapping it opens the companies list. The count rides
 * on the company icon, which keeps it attached to "companies" rather than to
 * this company's name.
 */
export function MobileCompanyStrip({
  companyName,
  status,
  spaceLabel,
  assignee,
  position,
  total,
  onClick,
}: MobileCompanyStripProps) {
  const context =
    position !== null
      ? `${position} of ${total} ${total === 1 ? 'company' : 'companies'}`
      : `a past company; ${total} currently on this property`

  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-label={`Switch company — currently ${companyName}, ${status}, ${context}`}
      className="flex w-full items-center gap-3 rounded-lg bg-[#f6f6f8] px-3 py-2.5 text-left"
    >
      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6a6a70]">
        <IconStore size={18} />
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -left-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#ececed] px-[3px] text-[9px] font-semibold leading-none text-[#5b5b5f] ring-[1.5px] ring-[#f6f6f8]"
        >
          {total}
        </span>
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 truncate text-[15px] font-semibold leading-5 text-black">
            {companyName}
          </span>
          <MobileListStatusBadge status={status} />
        </span>
        <span className="truncate text-xs leading-[18px] text-[#6a6a70]">
          {spaceLabel} · {assignee}
        </span>
      </span>

      <IconUnfold size={18} className="shrink-0 text-[#86868b]" />
    </button>
  )
}
