import { useEffect, useRef, useState } from 'react'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import { propertyAffiliationOptions, type PropertyAffiliation } from './switchCompanyTypes'

/**
 * Property Affiliation as a plain multi-select dropdown: ordinary text options
 * with a check against each one chosen, and the choices listed as text in the
 * field. The affiliations wear their coloured pills where they are displayed;
 * the control used to pick them stays quiet. Wherever a company's affiliation is
 * chosen it is chosen here, so it reads the same in the Add / Switch / Edit
 * company modals and the Create Property drawer.
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
        className={`flex w-full items-center gap-2 rounded-lg border bg-white px-3.5 text-left outline-none ${
          size === 'md' ? 'h-11' : 'h-10'
        } ${invalid ? 'border-[#b32318]' : open ? 'border-primary' : 'border-[#e6e6e7]'}`}
      >
        <span
          className={`min-w-0 flex-1 truncate ${text} ${
            selectedList.length === 0 ? (size === 'md' ? 'text-[#ccc]' : 'text-[#6a6a70]') : 'text-[#262527]'
          }`}
        >
          {selectedList.length === 0 ? 'Select Option' : selectedList.join(', ')}
        </span>
        <span className="relative size-5 shrink-0">
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
                  className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left ${text} hover:bg-[#f5f5f6] ${
                    selected ? 'font-medium text-primary' : 'text-[#262527]'
                  }`}
                >
                  {label}
                  {selected && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
