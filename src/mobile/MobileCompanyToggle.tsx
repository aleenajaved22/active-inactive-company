import { IconStore, IconUnfold } from './MobileIcons'

type MobileCompanyToggleProps = {
  companyName: string
  /** 1-based position among the companies currently on the property, if it is one of them. */
  position: number | null
  /** How many companies are currently on the property. */
  total: number
  onClick: () => void
  /** Distance from the bottom of the frame, to clear the nav or action footer. */
  bottom?: number
}

/**
 * Floating company switcher. Mobile has no room for the web app's companies
 * side panel, so the company in context sits in a pill at the bottom right and
 * opens the full list on tap. The count rides on the company icon, which keeps
 * it attached to "companies" rather than to the company's name.
 *
 * Deliberately neutral: it is persistent chrome, not a call to action, so it
 * reads as a floating control through its shadow rather than through colour.
 */
export function MobileCompanyToggle({
  companyName,
  position,
  total,
  onClick,
  bottom = 96,
}: MobileCompanyToggleProps) {
  const context =
    position !== null
      ? `${position} of ${total} ${total === 1 ? 'company' : 'companies'}`
      : `a past company; ${total} currently on this property`

  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-label={`Switch company — currently ${companyName}, ${context}`}
      className="absolute right-4 z-30 flex h-10 max-w-[220px] items-center gap-2 rounded-[20px] border border-[#d9d9de] bg-white pl-3 pr-2.5 shadow-[0px_4px_12px_rgba(16,24,40,0.12)]"
      style={{ bottom }}
    >
      <span className="relative shrink-0">
        <IconStore size={18} className="text-[#6a6a70]" />
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -left-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#ececed] px-[3px] text-[9px] font-semibold leading-none text-[#5b5b5f] ring-[1.5px] ring-white"
        >
          {total}
        </span>
      </span>
      <span className="min-w-0 truncate text-sm font-medium leading-5 text-[#262527]">
        {companyName}
      </span>
      <IconUnfold size={16} className="shrink-0 text-[#86868b]" />
    </button>
  )
}
