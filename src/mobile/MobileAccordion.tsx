import { useState, type ReactNode } from 'react'
import { IconChevronDown } from './MobileIcons'

type MobileAccordionProps = {
  title: string
  /** Shown in place of the body while collapsed. */
  summary?: string
  defaultOpen?: boolean
  children: ReactNode
}

/** Card that collapses to a title plus one summary line. */
export function MobileAccordion({ title, summary, defaultOpen = false, children }: MobileAccordionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section
      className={`flex w-full flex-col items-start rounded-lg bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] ${
        open ? 'gap-2' : ''
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-8 w-full items-center justify-between gap-2"
      >
        <span className="min-w-0 truncate text-sm font-semibold leading-5 text-[#262527]">
          {title}
        </span>
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
            open ? 'bg-[#146dff] text-white' : 'bg-[#f6f6f8] text-[#86868b]'
          }`}
        >
          <IconChevronDown size={16} className={open ? 'rotate-180' : ''} />
        </span>
      </button>

      {open ? (
        <>
          <span className="h-px w-full shrink-0 bg-[#eeeeee]" aria-hidden />
          <div className="no-scrollbar max-h-[307px] w-full overflow-y-auto">{children}</div>
        </>
      ) : (
        summary && (
          <p className="w-full truncate text-sm leading-5 text-[#6a6a70]">{summary}</p>
        )
      )}
    </section>
  )
}

/** Label / value pair inside an expanded accordion. */
export function MobileDetailRow({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex w-full items-start gap-3 py-0.5">
      {/*
        The design's 153px label + 175px value overflows the 311px card. At 14px
        only one of the two can stay on one line, so the label wraps and the
        value keeps its width — a wrapped label reads better than a split email.
      */}
      <span className="w-[136px] shrink-0 text-sm leading-6 text-[#262527]">{label}</span>
      <span className="min-w-0 flex-1 break-words text-sm leading-6 tracking-[0.25px] text-[#86868b]">
        {value}
      </span>
    </div>
  )
}
