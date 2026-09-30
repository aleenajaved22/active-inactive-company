/** Width of a side panel in its collapsed rail state. */
export const PANEL_RAIL_WIDTH = 44

type CollapsedPanelRailProps = {
  label: string
  onExpand: () => void
  /** Optional short badge shown under the icon (e.g. a count). */
  badge?: string
}

/**
 * Narrow, always-visible rail shown when a side panel is collapsed.
 * Keeps the panel discoverable — the label stays readable and the whole rail expands it.
 */
export function CollapsedPanelRail({ label, onExpand, badge }: CollapsedPanelRailProps) {
  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label={`Expand ${label}`}
      title={`Expand ${label}`}
      className="group flex h-full w-full flex-col items-center gap-3 py-4 hover:bg-[#f5f5f6]"
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#e6e6e7] bg-white text-[#6a6a70] shadow-[0_1px_3px_rgba(16,24,40,0.08)] group-hover:border-[#ccc] group-hover:text-[#262527]">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M12.5 4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4.5 4.5L8 8L4.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {badge && (
        <span className="shrink-0 rounded-full bg-[#ececed] px-1.5 py-0.5 text-[10px] font-medium leading-none text-[#5b5b5f]">
          {badge}
        </span>
      )}
      <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-[#6a6a70] [writing-mode:vertical-rl] group-hover:text-[#262527]">
        {label}
      </span>
    </button>
  )
}
