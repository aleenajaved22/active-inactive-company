import type { ReactNode } from 'react'

/** 20px ring, sized to sit on the 20px name line. */
function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
        checked ? 'border-[#146dff]' : 'border-[#d0cfd2]'
      }`}
    >
      {checked && <span className="size-2.5 rounded-full bg-[#146dff]" />}
    </span>
  )
}

type MobileSelectRowProps = {
  label: string
  /** Secondary line under the name, e.g. the space and parent company. */
  detail?: string
  checked: boolean
  onSelect: () => void
  /** Status pill, on the name line at the end of the row. */
  status?: ReactNode
  /** Opens the row's action drawer. */
  onMore?: () => void
  moreLabel?: string
}

/** Single-select row: radio, name over detail, status, and an actions button. */
export function MobileSelectRow({
  label,
  detail,
  checked,
  onSelect,
  status,
  onMore,
  moreLabel,
}: MobileSelectRowProps) {
  return (
    <li className="flex items-center gap-2">
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 py-2.5 text-left"
      >
        <Radio checked={checked} />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          {/*
            The pill shares the name line rather than sitting beside the whole
            column, so the detail underneath keeps the full width.
          */}
          <span className="flex h-5 min-w-0 items-center gap-2">
            <span className="min-w-0 flex-1 truncate text-sm leading-5 text-black">{label}</span>
            {status}
          </span>
          {detail && (
            <span className="truncate text-xs leading-[18px] text-[#86868b]">{detail}</span>
          )}
        </span>
      </button>
      {onMore && (
        <button
          type="button"
          aria-label={moreLabel}
          onClick={onMore}
          className="-mr-1.5 flex h-11 w-8 shrink-0 items-center justify-center rounded-lg text-[#6a6a70]"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <circle cx="4" cy="10" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="16" cy="10" r="1.5" />
          </svg>
        </button>
      )}
    </li>
  )
}
