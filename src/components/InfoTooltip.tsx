import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

/**
 * The small ⓘ beside a field label. One implementation for every tooltip in the
 * app, so the trigger, the dark bubble and the way it tracks the field on scroll
 * stay identical wherever a field needs explaining.
 */
export function InfoTooltip({
  label,
  text,
  id,
}: {
  /** Named for screen readers, e.g. "Floor information". */
  label: string
  text: string
  id?: string
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const generatedId = useId()
  const tooltipId = id ?? `tooltip-${generatedId}`
  const [visible, setVisible] = useState(false)
  const [style, setStyle] = useState<CSSProperties>({})

  useLayoutEffect(() => {
    if (!visible || !triggerRef.current) return

    const updatePosition = () => {
      const trigger = triggerRef.current
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      const width = Math.min(320, window.innerWidth - 24)
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
        className="flex size-4 shrink-0 items-center justify-center rounded-full text-[#86868b] outline-none hover:text-[#6a6a70] focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={label}
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={(event) => event.preventDefault()}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M8 5.33333V8M8 10.6667H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z"
            stroke="currentColor"
            strokeWidth="1.5"
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
            className="pointer-events-none rounded-lg bg-[#262527] p-3 text-sm leading-5 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  )
}
