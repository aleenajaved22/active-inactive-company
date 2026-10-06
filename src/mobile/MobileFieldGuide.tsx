import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { IconAlert } from './MobileIcons'

/**
 * Progressive disclosure for the descriptions on a long mobile form.
 *
 * Every field keeps its agreed description, but the description waits behind a
 * small ⓘ beside the field's label instead of sitting under every field. One
 * "Show all hints" control opens every description at once, for a first read of
 * the form, and remembers the choice. Each ⓘ still overrides it for its own field.
 */

const STORAGE_KEY = 'mobile-form-hints'

function readStored(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'all'
  } catch {
    return false
  }
}

function writeStored(all: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, all ? 'all' : 'none')
  } catch {
    // The preference is a convenience; the form works without it.
  }
}

type GuideState = {
  all: boolean
  isOpen: (id: string) => boolean
  toggle: (id: string) => void
  toggleAll: () => void
}

const GuideContext = createContext<GuideState | null>(null)

export function GuideProvider({ children }: { children: ReactNode }) {
  const [all, setAll] = useState(readStored)
  // Fields the user opened or closed by hand, which win over the "all" setting.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})

  const isOpen = useCallback((id: string) => overrides[id] ?? all, [overrides, all])
  const toggle = useCallback(
    (id: string) => setOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? all) })),
    [all],
  )
  const toggleAll = useCallback(() => {
    const next = !all
    setAll(next)
    setOverrides({})
    writeStored(next)
  }, [all])

  return <GuideContext.Provider value={{ all, isOpen, toggle, toggleAll }}>{children}</GuideContext.Provider>
}

/** The one control that opens or closes every description on the form. */
export function GuideToggle() {
  const guide = useContext(GuideContext)
  if (!guide) return null
  return (
    <div className="flex justify-end px-1">
      <button
        type="button"
        onClick={guide.toggleAll}
        aria-pressed={guide.all}
        className="flex items-center gap-1 text-xs font-medium leading-4 text-[#146dff]"
      >
        <IconAlert size={14} />
        {guide.all ? 'Hide all hints' : 'Show all hints'}
      </button>
    </div>
  )
}

/** Open state for one description; falls back to local state outside a provider. */
function useGuideItem(id: string) {
  const guide = useContext(GuideContext)
  const [local, setLocal] = useState(false)
  return guide
    ? { open: guide.isOpen(id), toggle: () => guide.toggle(id) }
    : { open: local, toggle: () => setLocal((value) => !value) }
}

function InfoButton({
  open,
  onToggle,
  label,
  className = '',
}: {
  open: boolean
  onToggle: () => void
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={`${open ? 'Hide' : 'Show'} hint: ${label}`}
      aria-expanded={open}
      onClick={onToggle}
      className={`flex size-7 items-center justify-center rounded-full ${
        open ? 'text-[#146dff]' : 'text-[#86868b]'
      } ${className}`}
    >
      <IconAlert size={16} />
    </button>
  )
}

/** The description itself: slides open under its field in the form's soft-blue note. */
function GuideNote({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="overflow-hidden">
        <div className="mt-1.5 flex flex-col gap-2 rounded-lg bg-[#eff4fd] px-3 py-2.5 text-xs leading-4 text-[#3c3c3d]">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * A field with its description on demand. The ⓘ sits on the field's label line,
 * clear of the chevron or calendar at its right edge.
 */
export function GuidedField({
  id,
  label,
  hint,
  hasTrailingIcon = true,
  children,
}: {
  id: string
  label: string
  hint: ReactNode
  /** Pickers and date fields end in an icon; the ⓘ steps in from it. */
  hasTrailingIcon?: boolean
  children: ReactNode
}) {
  const { open, toggle } = useGuideItem(id)
  return (
    <div>
      <div className="relative">
        {children}
        <InfoButton
          open={open}
          onToggle={toggle}
          label={label}
          className={`absolute top-1 ${hasTrailingIcon ? 'right-11' : 'right-2'}`}
        />
      </div>
      <GuideNote open={open}>{hint}</GuideNote>
    </div>
  )
}

/** A labelled group (occupancy, affiliation, assignee) with its description on demand. */
export function GuidedGroup({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: ReactNode
  hint: ReactNode
  children: ReactNode
}) {
  const { open, toggle } = useGuideItem(id)
  return (
    <div>
      <div className="flex items-center gap-0.5">
        <h2 className="pl-1 text-sm font-semibold leading-5 text-[#262527]">{label}</h2>
        <InfoButton open={open} onToggle={toggle} label={typeof label === 'string' ? label : id} />
      </div>
      <GuideNote open={open}>{hint}</GuideNote>
      <div className="mt-1.5 flex flex-col gap-1.5">{children}</div>
    </div>
  )
}
