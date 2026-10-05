import { IconAdd, IconChevronDown, IconSearch } from './MobileIcons'
import { MobileStatusBar } from './MobileStatusBar'
import { propertyFilters } from './mobileTokens'

type MobileTopNavProps = {
  title: string
  searchPlaceholder?: string
  filters?: string[]
  onAdd?: () => void
  addLabel?: string
}

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-[38px] shrink-0 items-center justify-center gap-1 rounded-[48px] bg-[#f6f6f8] py-3 pl-4 pr-3"
    >
      <span className="text-xs font-medium leading-[18px] text-black">{label}</span>
      <IconChevronDown size={20} className="text-[#86868b]" />
    </button>
  )
}

/** TopNavigation — 375 x 210, translucent so the list scrolls underneath. */
export function MobileTopNav({
  title,
  searchPlaceholder = 'Search',
  filters = propertyFilters,
  onAdd,
  addLabel = 'Add property',
}: MobileTopNavProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex h-[210px] flex-col items-start bg-white/70 backdrop-blur-[7px]">
      <MobileStatusBar />

      <div className="flex w-full flex-col items-start gap-2 pb-2">
        {/* Title */}
        <div className="flex h-[60px] w-full items-center px-4 py-0.5">
          <div className="flex h-12 flex-1 items-center justify-between gap-2 py-2">
            <h1 className="text-2xl font-semibold leading-8 text-black">{title}</h1>
            <button
              type="button"
              aria-label={addLabel}
              onClick={onAdd}
              className="flex size-8 items-center justify-center rounded-[28px] bg-[#004fe3] text-white"
            >
              <IconAdd size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex h-10 w-full items-center px-4 py-0.5">
          <label className="flex h-9 flex-1 items-center gap-2 rounded-[10px] bg-[#f6f6f8] px-4 py-[7px]">
            <IconSearch size={16} className="text-[#86868b]" />
            <input
              type="search"
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-base leading-6 text-black outline-none placeholder:text-[#86868b] [&::-webkit-search-cancel-button]:hidden"
            />
          </label>
        </div>

        {/* Filters */}
        <div className="flex h-[42px] w-full items-center px-4 py-0.5">
          <div className="no-scrollbar flex h-[38px] flex-1 items-start gap-2 overflow-x-auto">
            {filters.map((filter) => (
              <FilterChip key={filter} label={filter} />
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
