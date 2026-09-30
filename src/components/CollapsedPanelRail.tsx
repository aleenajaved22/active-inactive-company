/** Width of a side panel in its collapsed rail state. */
export const PANEL_RAIL_WIDTH = 44

type CollapsedPanelRailProps = {
  label: string
  count: number
  onExpand: () => void
}

/** Collapsed rail: just the panel name and count written vertically; clicking it expands the panel. */
export function CollapsedPanelRail({ label, count, onExpand }: CollapsedPanelRailProps) {
  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label={`Expand ${label} (${count})`}
      title={`Expand ${label} (${count})`}
      className="flex h-full w-full justify-center pt-6 text-start text-sm font-semibold text-[#6a6a70] outline-none hover:bg-[#f5f5f6] hover:text-[#262527] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
    >
      <span className="whitespace-nowrap [writing-mode:vertical-rl]">
        {label} ({count})
      </span>
    </button>
  )
}
