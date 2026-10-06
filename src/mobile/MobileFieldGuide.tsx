import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { IconAlert, IconChevronLeft, IconChevronRight } from './MobileIcons'

/**
 * A coach strip for the long mobile forms.
 *
 * The form itself stays a clean stack of fields. Each field keeps its agreed
 * description, but the descriptions live in one strip pinned above the action
 * button, which follows the field being used: touch or focus a field and the
 * strip shows that field's copy. The arrows step through all of it in form
 * order, so nothing is hidden, only held until it is relevant.
 */

export type GuideStep = {
  id: string
  title: string
  text: ReactNode
}

type GuideState = {
  steps: GuideStep[]
  index: number
  select: (id: string) => void
  step: (delta: number) => void
}

const GuideContext = createContext<GuideState | null>(null)

export function GuideProvider({ steps, children }: { steps: GuideStep[]; children: ReactNode }) {
  const [index, setIndex] = useState(0)
  const safeIndex = Math.min(index, steps.length - 1)

  const select = useCallback(
    (id: string) => {
      const next = steps.findIndex((item) => item.id === id)
      if (next >= 0) setIndex(next)
    },
    [steps],
  )
  const step = useCallback(
    (delta: number) => setIndex((current) => (current + delta + steps.length) % steps.length),
    [steps.length],
  )

  const value = useMemo(() => ({ steps, index: safeIndex, select, step }), [steps, safeIndex, select, step])
  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
}

/**
 * Marks the part of the form a step describes. Touching or focusing anything
 * inside it brings that step up in the strip; the wrapper adds no layout of its own.
 */
export function GuideTarget({ id, children }: { id: string; children: ReactNode }) {
  const guide = useContext(GuideContext)
  if (!guide) return <>{children}</>
  return (
    <div onFocusCapture={() => guide.select(id)} onPointerDownCapture={() => guide.select(id)}>
      {children}
    </div>
  )
}

/** The strip. Rendered by the screen, above its action button. */
export function GuideBar({ className = '', style }: { className?: string; style?: CSSProperties }) {
  const guide = useContext(GuideContext)
  if (!guide) return null
  const current = guide.steps[guide.index]

  return (
    <div
      role="status"
      aria-live="polite"
      style={style}
      className={`flex items-start gap-2.5 rounded-xl bg-[#eff4fd] py-2.5 pl-3 pr-1.5 ${className}`}
    >
      <IconAlert size={16} className="mt-0.5 shrink-0 text-[#146dff]" />
      <div className="min-w-0 flex-1 text-xs leading-4 text-[#3c3c3d]">
        <p className="font-semibold text-[#262527]">{current.title}</p>
        <div className="mt-0.5">{current.text}</div>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Previous hint"
            onClick={() => guide.step(-1)}
            className="flex size-7 items-center justify-center rounded-full text-[#5b5b5f]"
          >
            <IconChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next hint"
            onClick={() => guide.step(1)}
            className="flex size-7 items-center justify-center rounded-full text-[#5b5b5f]"
          >
            <IconChevronRight size={16} />
          </button>
        </div>
        <span className="text-[10px] font-medium leading-3 text-[#86868b]">
          {guide.index + 1} / {guide.steps.length}
        </span>
      </div>
    </div>
  )
}
