/** iPhone X / Bars / Status / Default — 375 x 44 */
export function MobileStatusBar() {
  return (
    <div className="relative h-11 w-[375px] shrink-0">
      <span className="absolute left-5 top-1/2 w-[54px] -translate-y-1/2 text-center text-[15px] font-semibold leading-[18px] tracking-[-0.165px] text-black">
        9:41
      </span>
      <div className="absolute right-3.5 top-1/2 flex h-3.5 -translate-y-1/2 items-center gap-[5px]">
        {/* Cellular */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none" aria-hidden="true">
          <rect y="7.5" width="3" height="3.5" rx="1" fill="#000000" />
          <rect x="4.6" y="5.2" width="3" height="5.8" rx="1" fill="#000000" />
          <rect x="9.2" y="2.6" width="3" height="8.4" rx="1" fill="#000000" />
          <rect x="13.8" width="3" height="11" rx="1" fill="#000000" />
        </svg>
        {/* Wi-Fi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden="true">
          <path
            d="M1.15 3.5a9.8 9.8 0 0 1 13.7 0M3.8 6.3a6.1 6.1 0 0 1 8.4 0M6.45 9.05a2.5 2.5 0 0 1 3.1 0"
            stroke="#000000"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.3" stroke="#000000" strokeOpacity="0.36" />
          <path
            d="M23 4.15v3.7a2 2 0 0 0 1.2-1.85A2 2 0 0 0 23 4.15Z"
            fill="#000000"
            fillOpacity="0.4"
          />
          <rect x="2" y="2" width="18" height="8" rx="2.1" fill="#000000" />
        </svg>
      </div>
    </div>
  )
}
