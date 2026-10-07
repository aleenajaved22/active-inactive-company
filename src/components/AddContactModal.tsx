import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import modalClose from '../assets/modal-close.svg'
import { toContactRole } from '../data/contactDirectory'
import type { PropertyContactRole } from '../data/leadActivities'
import { contactRoles } from '../data/propertyFormOptions'
import { ContactTitleGrid } from './ContactTitleGrid'

type AddContactModalProps = {
  open: boolean
  onClose: () => void
  /** Called with each label that has someone chosen against it. */
  onAdd: (additions: { role: PropertyContactRole; user: string }[]) => void
}

/** Adds contacts by label, mirroring the Associated Contacts grid from property creation. */
export function AddContactModal({ open, onClose, onAdd }: AddContactModalProps) {
  const [chosen, setChosen] = useState<Record<string, string>>({})

  // Each opening starts clean rather than from the last attempt.
  useEffect(() => {
    if (open) setChosen({})
  }, [open])

  const additions = contactRoles
    .filter((role) => chosen[role.label])
    .map((role) => ({ role: toContactRole(role.label), user: chosen[role.label] }))

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-contact-title"
    >
      <button type="button" className="absolute inset-0 bg-[#262527]/40" aria-label="Close dialog" onClick={onClose} />
      <div className="relative flex w-full max-w-[640px] flex-col rounded-xl border border-[#e6e6e7] bg-white p-6 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]">
        <div className="mb-5 flex items-start justify-between gap-2">
          <div>
            <h2 id="add-contact-title" className="text-xl font-bold leading-7 text-[#262527]">
              Add Contact
            </h2>
            <p className="mt-1 text-sm leading-5 text-[#6a6a70]">Please add the contact against following label</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="relative size-6 shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={modalClose} />
          </button>
        </div>

        <ContactTitleGrid chosen={chosen} onChange={setChosen} />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2 text-sm font-medium leading-5 text-[#444446]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={additions.length === 0}
            onClick={() => {
              onAdd(additions)
              onClose()
            }}
            className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm font-medium leading-5 text-white disabled:cursor-not-allowed disabled:border-[#e6e6e7] disabled:bg-[#e6e6e7] disabled:text-[#86868b]"
          >
            Add Contact
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
