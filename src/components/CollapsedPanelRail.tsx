/** Width of a side panel in its collapsed state: a slim line. */
export const PANEL_RAIL_WIDTH = 4

type CollapsedPanelRailProps = {
  label: string
  onExpand: () => void
}

/**
 * Light-blue line shown when a side panel is collapsed.
 * The edge toggle (SidePanelToggle) is the visible control; the line itself also expands the panel.
 */
export function CollapsedPanelRail({ label, onExpand }: CollapsedPanelRailProps) {
  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label={`Expand ${label}`}
      title={`Expand ${label}`}
      className="h-full w-full bg-primary/25 transition-colors hover:bg-primary/40"
    />
  )
}
