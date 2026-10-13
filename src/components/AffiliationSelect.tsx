import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import {
  affiliationBadgeStyles,
  propertyAffiliationOptions,
  type PropertyAffiliation,
} from './switchCompanyTypes'

const MAX_VISIBLE_PILLS = 4

function AffiliationPill({ label }: { label: PropertyAffiliation }) {
  const { bg, text } = affiliationBadgeStyles[label]
  return (
    <span
      className="inline-flex max-w-[140px] shrink-0 items-center truncate rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px]"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  )
}

function MoreAffiliationsPill({ labels }: { labels: PropertyAffiliation[] }) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const tooltipId = useId()
  const [visible, setVisible] = useState(false)
  const [style, setStyle] = useState<CSSProperties>({})

  useLayoutEffect(() => {
    if (!visible || !triggerRef.current) return

    const updatePosition = () => {
      const trigger = triggerRef.current
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      setStyle({
        position: 'fixed',
        left: rect.left + rect.width / 2,
        top: rect.top - 6,
        transform: 'translate(-50%, -100%)',
        maxWidth: Math.min(320, window.innerWidth - 24),
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

  const hiddenLabel = labels.join(', ')

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-describedby={visible ? tooltipId : undefined}
        aria-label={`${labels.length} more affiliations: ${hiddenLabel}`}
        className="inline-flex shrink-0 items-center rounded-2xl bg-[#f5f5f6] px-2 py-0.5 text-xs font-medium leading-[18px] text-[#5b5b5f] hover:bg-[#ececed]"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={(event) => {
          event.stopPropagation()
          event.preventDefault()
        }}
      >
        +{labels.length} more
      </button>
      {visible &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            style={style}
            className="pointer-events-none w-max max-w-[min(320px,calc(100vw-24px))] rounded-lg bg-[#262527] p-3 text-sm leading-5 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          >
            <div className="flex flex-wrap gap-1.5">
              {labels.map((label) => (
                <AffiliationPill key={label} label={label} />
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

function CheckboxMark({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex size-4 shrink-0 items-center justify-center rounded border ${
        checked ? 'border-primary bg-primary' : 'border-[#d0d0d4] bg-white'
      }`}
      aria-hidden
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  )
}

/**
 * Property Affiliation multi-select: checkbox list in the dropdown; selected
 * affiliations appear as coloured pills in the field, with "+N more" and a
 * tooltip when they do not all fit.
 */
export function AffiliationSelect({
  id,
  value,
  onChange,
  size = 'sm',
  invalid,
}: {
  id?: string
  value: Set<PropertyAffiliation>
  onChange: (next: Set<PropertyAffiliation>) => void
  /** Modals (sm) and the creation drawer (md) differ in field height and text size. */
  size?: 'sm' | 'md'
  invalid?: boolean
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) listRef.current?.scrollIntoView({ block: 'nearest' })
  }, [open])

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape, true)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape, true)
    }
  }, [open])

  const selectedList = propertyAffiliationOptions.filter((label) => value.has(label))
  const visiblePills = selectedList.slice(0, MAX_VISIBLE_PILLS)
  const hiddenPills = selectedList.slice(MAX_VISIBLE_PILLS)
  const text = size === 'md' ? 'text-base leading-6' : 'text-sm leading-5'

  const toggle = (label: PropertyAffiliation) => {
    const next = new Set(value)
    if (next.has(label)) next.delete(label)
    else next.add(label)
    onChange(next)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-invalid={invalid || undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full min-h-10 items-center gap-2 rounded-lg border bg-white px-3.5 py-1.5 text-left outline-none ${
          size === 'md' ? 'min-h-11' : ''
        } ${invalid ? 'border-[#b32318]' : open ? 'border-primary' : 'border-[#e6e6e7]'}`}
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selectedList.length === 0 ? (
            <span className={`${text} ${size === 'md' ? 'text-[#ccc]' : 'text-[#6a6a70]'}`}>Select Option</span>
          ) : (
            <>
              {visiblePills.map((label) => (
                <AffiliationPill key={label} label={label} />
              ))}
              {hiddenPills.length > 0 && <MoreAffiliationsPill labels={hiddenPills} />}
            </>
          )}
        </span>
        <span className="relative size-5 shrink-0 self-center">
          <img
            alt=""
            className={`absolute inset-0 block size-full max-w-none transition-transform ${open ? 'rotate-180' : ''}`}
            src={questionsChevronDown}
          />
        </span>
      </button>
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-multiselectable
          className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[240px] overflow-y-auto rounded-lg border border-[#e6e6e7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          {propertyAffiliationOptions.map((label) => {
            const selected = value.has(label)
            return (
              <li key={label} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => toggle(label)}
                  className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left ${text} hover:bg-[#f5f5f6] ${
                    selected ? 'text-[#262527]' : 'text-[#262527]'
                  }`}
                >
                  <CheckboxMark checked={selected} />
                  <span className="min-w-0 flex-1">{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
