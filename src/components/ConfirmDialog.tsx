import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Confirmation for something that cannot be taken back: a tinted trash icon, a
 * bold heading, a sentence of grey body text, and Cancel beside a red confirm.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <button type="button" className="absolute inset-0 bg-[#262527]/50" aria-label="Dismiss" onClick={onCancel} />
      <div className="relative w-full max-w-[500px] rounded-2xl bg-white p-6 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#fee4e2]" aria-hidden>
          <span className="flex size-10 items-center justify-center rounded-full bg-[#fecdca] text-[#b42318]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" />
              <path d="M5.5 6l.9 13.2A2 2 0 0 0 8.4 21h7.2a2 2 0 0 0 2-1.8L18.5 6" />
              <path d="M10 10.5v6M14 10.5v6" />
            </svg>
          </span>
        </span>
        <h3 id="confirm-dialog-title" className="mt-4 text-lg font-bold leading-7 text-[#262527]">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-5 text-[#6a6a70]">{children}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#aeaeb2] bg-white px-4 py-2 text-sm font-medium leading-5 text-[#444446]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#e43f32] px-4 py-2 text-sm font-medium leading-5 text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
