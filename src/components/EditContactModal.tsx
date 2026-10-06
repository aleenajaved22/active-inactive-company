import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import modalClose from '../assets/modal-close.svg'
import { contactRoleBadgeStyles, contactRoleOrder } from '../data/contactDirectory'
import type { PropertyContactItem, PropertyContactRole } from '../data/leadActivities'

/** Changes which labels a contact carries on this property. */
export function EditContactModal({
  contact,
  onClose,
  onSave,
}: {
  contact: PropertyContactItem | null
  onClose: () => void
  onSave: (roles: PropertyContactRole[]) => void
}) {
  const [roles, setRoles] = useState<Set<PropertyContactRole>>(new Set())

  useEffect(() => {
    if (contact) setRoles(new Set(contact.roles))
  }, [contact])

  useEffect(() => {
    if (!contact) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [contact, onClose])

  if (!contact) return null

  const toggle = (role: PropertyContactRole) =>
    setRoles((prev) => {
      const next = new Set(prev)
      if (next.has(role)) next.delete(role)
      else next.add(role)
      return next
    })

  return createPortal(
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="edit-contact-title">
      <button type="button" className="absolute inset-0 bg-[#262527]/40" aria-label="Close dialog" onClick={onClose} />
      <div className="relative w-full max-w-[480px] rounded-xl border border-[#e6e6e7] bg-white p-6 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.04)]">
        <div className="mb-4 flex items-start gap-2 border-b border-[#e6e6e7] pb-4">
          <h2 id="edit-contact-title" className="min-w-0 flex-1 text-xl font-bold leading-7 text-[#262527]">
            Edit Contact
          </h2>
          <button type="button" aria-label="Close" onClick={onClose} className="relative size-6 shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={modalClose} />
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-[#f5f5f6] px-4 py-3">
          <img alt="" className="size-8 shrink-0 rounded-full object-cover" src={contact.avatarSrc} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-5 text-[#262527]">{contact.name}</p>
            <p className="truncate text-xs leading-[18px] text-[#86868b]">{contact.email}</p>
          </div>
        </div>

        <p className="mt-5 text-sm font-medium leading-5 text-[#86868b]">Labels</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {contactRoleOrder.map((role) => {
            const on = roles.has(role)
            const style = contactRoleBadgeStyles[role]
            return (
              <button
                key={role}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(role)}
                className="rounded-full border px-3 py-1 text-xs font-medium leading-[18px]"
                style={on ? { backgroundColor: style.bg, color: style.text, borderColor: style.text } : { borderColor: '#e6e6e7', color: '#6a6a70', backgroundColor: '#fff' }}
              >
                {role}
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[#e6e6e7] pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2 text-sm leading-5 text-[#444446]">
            Cancel
          </button>
          <button
            type="button"
            disabled={roles.size === 0}
            onClick={() => onSave(contactRoleOrder.filter((role) => roles.has(role)))}
            className="rounded-lg border border-primary bg-primary px-3.5 py-2 text-sm font-medium leading-5 text-white disabled:cursor-not-allowed disabled:border-[#e6e6e7] disabled:bg-[#e6e6e7] disabled:text-[#86868b]"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
