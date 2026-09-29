type CompaniesPanelToggleProps = {
  open: boolean
  onToggle: () => void
}

/** Round edge toggle on the divider between the companies panel and the company view. */
export function CompaniesPanelToggle({ open, onToggle }: CompaniesPanelToggleProps) {
  return (
    <div className="relative z-10 w-0 shrink-0">
      <button
        type="button"
        aria-label={open ? 'Collapse companies panel' : 'Expand companies panel'}
        aria-expanded={open}
        aria-controls="company-listing-panel"
        title={open ? 'Collapse companies' : 'Expand companies'}
        onClick={onToggle}
        className="absolute left-0 top-[27px] flex size-7 -translate-x-1/2 items-center justify-center rounded-full border border-[#e6e6e7] bg-white text-[#6a6a70] shadow-[0_1px_3px_rgba(16,24,40,0.1)] hover:border-[#ccc] hover:text-[#262527]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={open ? '' : 'rotate-180'}>
          <path d="M3.5 4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M11.5 4.5L8 8L11.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
