import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { formatShortDate } from '../data/dateFormat'

function PendingEffectiveDateInfo({
  effectiveDate,
  tooltipId = 'pending-effective-date-tooltip',
}: {
  effectiveDate: string
  tooltipId?: string
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)
  const [style, setStyle] = useState<CSSProperties>({})
  const displayDate = effectiveDate.trim() ? formatShortDate(effectiveDate) : '—'

  useLayoutEffect(() => {
    if (!visible || !triggerRef.current) return

    const updatePosition = () => {
      const trigger = triggerRef.current
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      const width = Math.min(240, window.innerWidth - 24)
      let left = rect.left + rect.width / 2 - width / 2
      left = Math.max(12, Math.min(left, window.innerWidth - width - 12))
      setStyle({
        position: 'fixed',
        left,
        top: rect.top - 6,
        width,
        transform: 'translateY(-100%)',
        zIndex: 80,
      })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [visible])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Pending effective date"
        aria-describedby={visible ? tooltipId : undefined}
        className="relative size-3.5 shrink-0 text-[#f6a300]"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={(event) => event.stopPropagation()}
      >
        <svg
          aria-hidden
          className="block size-full"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 8V6M6 4H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {visible &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            style={style}
            className="pointer-events-none w-max rounded-lg bg-[#262527] px-3 py-2 text-sm leading-5 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          >
            <p className="whitespace-nowrap">
              <span className="font-medium">Effective Date:</span> <span className="text-[#e6e6e7]">{displayDate}</span>
            </p>
          </div>,
          document.body,
        )}
    </>
  )
}

export function PendingStatusBadge({
  effectiveDate,
  tooltipId,
  size = 'sm',
}: {
  effectiveDate: string
  tooltipId: string
  size?: 'sm' | 'lg'
}) {
  // Pill carries only the "Pending" label; the date lives behind the info icon inside it.
  const pillClassName =
    size === 'lg'
      ? 'inline-flex h-[26px] items-center gap-1 rounded-2xl bg-[#fff4d8] px-2.5 text-xs font-medium leading-[18px] text-[#f6a300]'
      : 'inline-flex items-center gap-1 rounded-2xl bg-[#fff4d8] px-2 py-0.5 text-xs font-medium leading-[18px] text-[#f6a300]'

  return (
    <span className={`w-fit shrink-0 ${pillClassName}`}>
      Pending
      <PendingEffectiveDateInfo effectiveDate={effectiveDate} tooltipId={tooltipId} />
    </span>
  )
}
