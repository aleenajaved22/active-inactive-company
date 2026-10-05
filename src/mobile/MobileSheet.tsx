import type { ReactNode } from 'react'

type MobileSheetProps = {
  open: boolean
  onClose: () => void
  title?: string
  /** Rendered to the right of the title. */
  action?: ReactNode
  /** Back control shown before the title, for a drill-down view. */
  onBack?: () => void
  children: ReactNode
  /** Fraction of the frame the sheet may fill. */
  maxHeight?: string
  /** Lifts this sheet above another one, for a drawer opened on top of a drawer. */
  layer?: number
}

/** Bottom drawer with a grabber and a ruled header. */
export function MobileSheet({
  open,
  onClose,
  title,
  action,
  onBack,
  children,
  maxHeight = '80%',
  layer = 40,
}: MobileSheetProps) {
  if (!open) return null

  return (
    <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: layer }}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="mobile-scrim absolute inset-0 bg-black/40"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="mobile-sheet relative flex flex-col rounded-t-2xl bg-white"
        style={{ maxHeight }}
      >
        <div className="flex justify-center pb-1 pt-2">
          <span className="h-1 w-9 rounded-full bg-[#d9d9de]" />
        </div>
        {title && (
          <header className="flex items-center gap-2 border-b border-[#e6e6e7] px-[18px] pb-3.5 pt-2">
            {onBack && (
              <button
                type="button"
                aria-label="Back"
                onClick={onBack}
                className="-ml-1 text-[#6a6a70]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M14.4 6.5 8.9 12l5.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            <h2 className="min-w-0 flex-1 truncate text-base font-semibold leading-5 text-black">
              {title}
            </h2>
            {action}
          </header>
        )}
        {children}
      </section>
    </div>
  )
}

export type MobileActionItem = {
  label: string
  onSelect: () => void
  destructive?: boolean
}

/**
 * Action drawer, opened on top of another drawer. Replaces the web app's ⋮
 * popup menu, which is too small a target and positions badly inside a sheet.
 */
export function MobileActionSheet({
  open,
  title,
  items,
  onClose,
}: {
  open: boolean
  title?: string
  items: MobileActionItem[]
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end p-3">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="mobile-scrim absolute inset-0 bg-black/40"
      />
      <div role="menu" className="mobile-sheet relative flex flex-col gap-2">
        <div className="overflow-hidden rounded-2xl bg-white">
          {title && (
            <p className="border-b border-[#e6e6e7] px-4 py-3 text-center text-xs leading-[18px] text-[#86868b]">
              {title}
            </p>
          )}
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                onClose()
                item.onSelect()
              }}
              className={`w-full border-b border-[#e6e6e7] px-4 py-3.5 text-center text-base leading-5 last:border-b-0 ${
                item.destructive ? 'text-[#b32318]' : 'text-[#146dff]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl bg-white px-4 py-3.5 text-center text-base font-medium leading-5 text-[#146dff]"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
