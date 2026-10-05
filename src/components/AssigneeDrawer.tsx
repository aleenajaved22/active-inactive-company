import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import modalClose from '../assets/modal-close.svg'
import { AssigneeFields, type AssigneeValue } from './AssigneeFields'

/**
 * Side drawer for changing who a company is assigned to at this property —
 * Assignee, and optionally a Supervisor. A drawer rather than a popup because
 * it is a record edit like Create Property and Edit Property, and those open
 * from the right.
 */
export function AssigneeDrawer({
  open,
  companyName,
  spaceLabel,
  initial,
  onClose,
  onSave,
}: {
  open: boolean
  companyName: string
  spaceLabel?: string
  initial: AssigneeValue
  onClose: () => void
  onSave: (value: { assignee: string; supervisor?: string }) => void
}) {
  const [value, setValue] = useState<AssigneeValue>(initial)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // Each opening starts from the saved values, not from an abandoned draft.
  useEffect(() => {
    if (!open) return
    setValue(initial)
    setSubmitAttempted(false)
  }, [open, initial])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const error = submitAttempted && !value.assignee ? 'Select an assignee.' : null

  const save = () => {
    setSubmitAttempted(true)
    if (!value.assignee) return
    onSave({
      assignee: value.assignee,
      supervisor: value.assignSupervisor && value.supervisor ? value.supervisor : undefined,
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-[#000000]/50"
        aria-label="Close assign drawer"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignee-drawer-title"
        className="relative flex h-full w-full max-w-[480px] flex-col bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]"
      >
        <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
          <div className="mb-8 flex shrink-0 items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 id="assignee-drawer-title" className="text-xl font-bold leading-7 text-[#262527]">
                Assign to
              </h2>
              <p className="mt-1 text-sm leading-5 text-[#6a6a70]">
                {companyName}
                {spaceLabel ? ` · ${spaceLabel}` : ''}
              </p>
            </div>
            <button type="button" aria-label="Close" onClick={onClose} className="size-6 shrink-0">
              <img alt="" className="block size-full max-w-none" src={modalClose} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <AssigneeFields idPrefix="assignee-drawer" size="md" showLabels value={value} onChange={setValue} error={error} />
          </div>
        </div>

        <div className="shrink-0 border-t border-[#e6e6e7] px-8 pb-6 pt-5">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2 text-sm font-medium leading-5 text-[#444446]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm font-medium leading-5 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
