type MobileTabsProps<T extends string> = {
  tabs: readonly T[]
  active: T
  onChange: (tab: T) => void
}

/** Scrollable underline tabs — 14px, active in #356DF4 with a 2px rule. */
export function MobileTabs<T extends string>({ tabs, active, onChange }: MobileTabsProps<T>) {
  return (
    <div
      role="tablist"
      className="no-scrollbar flex h-8 items-start gap-4 overflow-x-auto border-b border-[#e6e6e7] pr-4 pt-1"
    >
      {tabs.map((tab) => {
        const isActive = tab === active
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className={`flex h-7 shrink-0 flex-col justify-center whitespace-nowrap pb-2 ${
              isActive
                ? 'border-b-2 border-[#356df4] text-sm font-medium leading-5 text-[#356df4]'
                : 'text-sm leading-[22px] text-[#6a6a70]'
            }`}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
