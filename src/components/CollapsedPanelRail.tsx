/** Width of a side panel in its collapsed rail state. */
export const PANEL_RAIL_WIDTH = 60

export type CollapsedRailItem = {
  id: string
  name: string
  /** Secondary line for the tooltip, e.g. "Floor 2, Suite 210". */
  detail: string
  selected: boolean
}

type CollapsedPanelRailProps = {
  label: string
  onExpand: () => void
  items: CollapsedRailItem[]
  onSelect: (id: string) => void
}

/** Up to two letters: first letters of the first two words, or the first two letters of a single word. */
export function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
  const word = words[0] ?? ''
  return word.charAt(0).toUpperCase() + word.slice(1, 2).toLowerCase()
}

/** Briefcase glyph (no background), drawn in the current text colour. */
function CompanyGlyph() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.33366 1.79167H11.6667C12.0914 1.79167 12.4522 1.94153 12.7555 2.24479C13.059 2.54822 13.2092 2.90943 13.2087 3.33366V5.12467H16.6667C17.0916 5.12467 17.4521 5.27534 17.7555 5.57877C18.0589 5.88219 18.2092 6.24247 18.2087 6.66667V15.8337C18.2086 16.2584 18.0579 16.6192 17.7546 16.9225C17.4512 17.2258 17.0908 17.3752 16.6667 17.3747H3.33366C2.90877 17.3747 2.54725 17.225 2.24381 16.9215C1.94058 16.6182 1.79119 16.2577 1.79167 15.8337V6.66667C1.79167 6.2419 1.94153 5.88118 2.24479 5.5778C2.54822 5.27437 2.90943 5.12416 3.33366 5.12467H6.79167V3.33366C6.79167 2.90877 6.94136 2.54725 7.24479 2.24381C7.5482 1.94043 7.90946 1.79115 8.33366 1.79167ZM3.20866 15.9587H16.7917V12.3747H12.3747V14.0417H7.62467V12.3747H3.20866V15.9587ZM9.04167 12.6247H10.9587V10.7087H9.04167V12.6247ZM3.20866 10.9587H7.62467V9.29167H12.3747V10.9587H16.7917V6.54167H3.20866V10.9587ZM8.20866 5.12467H11.7917V3.20866H8.20866V5.12467Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.25"
      />
    </svg>
  )
}

const itemClass =
  'flex size-11 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/40'

/**
 * Slim rail shown when a side panel is collapsed, laid out like the left nav bar:
 * a company icon on top (expands the panel), then one initials row per company.
 * The selected company is a full-width light-blue row with a primary left border, like the expanded list. Clicking a button selects that company.
 */
export function CollapsedPanelRail({ label, onExpand, items, onSelect }: CollapsedPanelRailProps) {
  return (
    <div className="flex h-full w-full flex-col items-center pt-3">
      <button
        type="button"
        onClick={onExpand}
        aria-label={`Expand ${label} (${items.length})`}
        title={`Expand ${label} (${items.length})`}
        className={`${itemClass} shrink-0 text-[#444446] hover:bg-[#f5f5f6]`}
      >
        <CompanyGlyph />
      </button>
      <span
        className="mt-3 shrink-0 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-[#6a6a70] [writing-mode:vertical-rl]"
      >
        {label} ({items.length})
      </span>
      <ul className="mt-3 flex min-h-0 w-full flex-1 flex-col overflow-y-auto pb-4">
        {items.map((item) => (
          <li key={item.id} className="relative">
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={item.selected || undefined}
              aria-label={`Show ${item.name}, ${item.detail}`}
              title={`${item.name} · ${item.detail}`}
              className={`flex h-12 w-full items-center justify-center text-sm font-semibold leading-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 ${
                item.selected ? 'bg-blue-50 text-primary' : 'text-[#444446] hover:bg-[#f5f5f6]'
              }`}
            >
              {initialsOf(item.name)}
            </button>
            {item.selected && (
              <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-primary" />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
