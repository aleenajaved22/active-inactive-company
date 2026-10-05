import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import modalClose from '../assets/modal-close.svg'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import { contactRoles } from '../data/propertyFormOptions'

type AddContactModalProps = {
  open: boolean
  onClose: () => void
}

/** Adds contacts by label, mirroring the Associated Contacts grid from property creation. */
export function AddContactModal({ open, onClose }: AddContactModalProps) {
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

        <div>
          <div className="grid grid-cols-[180px_1fr] gap-4 border-y border-[#e6e6e7] bg-white py-3">
            <span className="text-xs font-medium leading-[18px] text-[#5b5b5f]">Contact Title</span>
            <span className="text-xs font-medium leading-[18px] text-[#5b5b5f]">Users</span>
          </div>
          <div className="divide-y divide-[#e6e6e7] border-b border-[#e6e6e7]">
            {contactRoles.map((role, index) => (
              <div key={role.label} className="grid grid-cols-[180px_1fr] items-center gap-4 py-3">
                <span
                  className="w-fit rounded-full px-2.5 py-1 text-xs font-medium leading-[18px]"
                  style={{ backgroundColor: role.bg, color: role.text }}
                >
                  {role.label}
                </span>
                <div className="relative">
                  <select
                    defaultValue={index === 0 ? 'Henry Micheal' : ''}
                    className={`h-10 w-full appearance-none rounded-lg border border-[#e6e6e7] bg-white pl-3.5 pr-10 text-sm leading-5 outline-none focus:border-primary ${
                      index === 0 ? 'text-[#262527]' : 'text-[#ccc]'
                    }`}
                  >
                    <option value="">Select Contact</option>
                    <option value="Henry Micheal">Henry Micheal henrymicheal23@signal.com</option>
                    <option value="Jerome Bell">Jerome Bell</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2" aria-hidden>
                    <img alt="" className="block size-full max-w-none" src={questionsChevronDown} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            onClick={() => {
              window.alert('Contact added (prototype)')
              onClose()
            }}
            className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm font-medium leading-5 text-white"
          >
            Add Contact
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
