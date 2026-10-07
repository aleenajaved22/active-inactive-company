import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import {
  affiliationBadgeStyles,
  propertyAffiliationOptions,
  type PropertyAffiliation,
} from './switchCompanyTypes'

/**
 * Property Affiliation as a multi-select dropdown whose options are the same
 * coloured pills the affiliations wear everywhere else. Wherever a company's
 * affiliation is chosen it is chosen here, so the control reads the same in the
 * Add / Switch / Edit company modals and the Create Property drawer.
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

  // Opened near the bottom of a scrolling form, bring the whole list into view.
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
    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [open])

  const selectedList = propertyAffiliationOptions.filter((label) => value.has(label))

  const toggle = (label: PropertyAffiliation) => {
    const next = new Set(value)
    if (next.has(label)) next.delete(label)
    else next.add(label)
    onChange(next)
  }

  const remove = (label: PropertyAffiliation, event: ReactMouseEvent) => {
    event.stopPropagation()
    const next = new Set(value)
    next.delete(label)
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
        className={`flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2 text-left outline-none ${
          size === 'md' ? 'min-h-11' : 'min-h-10'
        } ${invalid ? 'border-[#b32318]' : open ? 'border-primary' : 'border-[#e6e6e7]'}`}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selectedList.length === 0 ? (
            <span className={size === 'md' ? 'text-base leading-6 text-[#ccc]' : 'text-sm leading-5 text-[#6a6a70]'}>Select Option</span>
          ) : (
            selectedList.map((label) => {
              const style = affiliationBadgeStyles[label]
              return (
                <span
                  key={label}
                  className="inline-flex max-w-full items-center gap-1 rounded-2xl px-2 py-0.5 text-sm leading-5"
                  style={{ backgroundColor: style.bg, color: style.text }}
                >
                  <span className="truncate">{label}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove ${label}`}
                    className="shrink-0 text-base leading-none opacity-70 hover:opacity-100"
                    onClick={(event) => remove(label, event)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        remove(label, event as unknown as ReactMouseEvent)
                      }
                    }}
                  >
                    ×
                  </span>
                </span>
              )
            })
          )}
        </div>
        <span className="relative size-4 shrink-0">
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
          className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[220px] overflow-y-auto rounded-lg border border-[#e6e6e7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          {propertyAffiliationOptions.map((label) => {
            const selected = value.has(label)
            const style = affiliationBadgeStyles[label]
            return (
              <li key={label} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => toggle(label)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm leading-5 hover:bg-[#f5f5f6] ${
                    selected ? 'bg-[#f5f5f6]' : ''
                  }`}
                >
                  <span
                    className="inline-flex rounded-2xl px-2 py-0.5 text-sm leading-5"
                    style={{ backgroundColor: style.bg, color: style.text }}
                  >
                    {label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
