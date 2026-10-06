import { useState, type ReactNode } from 'react'
import { mergeContacts } from '../data/contactDirectory'
import type { PropertyContactItem } from '../data/leadActivities'
import { AddContactModal } from './AddContactModal'
import { ConfirmDialog } from './ConfirmDialog'
import { EditContactModal } from './EditContactModal'

/**
 * The state and dialogs behind a contacts table: adding, editing labels, and
 * removing a contact after a confirmation. Render `dialogs` once beside the table.
 */
export function useContactsEditor(initial: PropertyContactItem[]): {
  contacts: PropertyContactItem[]
  setContacts: (next: PropertyContactItem[]) => void
  openAdd: () => void
  onEdit: (contact: PropertyContactItem) => void
  onRemove: (contact: PropertyContactItem) => void
  dialogs: ReactNode
  reset: () => void
} {
  const [contacts, setContacts] = useState(initial)
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<PropertyContactItem | null>(null)
  const [removing, setRemoving] = useState<PropertyContactItem | null>(null)

  const dialogs = (
    <>
      <AddContactModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(additions) => setContacts((prev) => mergeContacts(prev, additions))}
      />
      <EditContactModal
        contact={editing}
        onClose={() => setEditing(null)}
        onSave={(roles) => {
          setContacts((prev) => prev.map((item) => (item.id === editing?.id ? { ...item, roles } : item)))
          setEditing(null)
        }}
      />
      <ConfirmDialog
        open={removing !== null}
        title="Remove Association!"
        confirmLabel="Remove"
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          setContacts((prev) => prev.filter((item) => item.id !== removing?.id))
          setRemoving(null)
        }}
      >
        Do you want to remove {removing?.name} from this property? This action cannot be undone.
      </ConfirmDialog>
    </>
  )

  return {
    contacts,
    setContacts,
    openAdd: () => setAddOpen(true),
    onEdit: setEditing,
    onRemove: setRemoving,
    dialogs,
    reset: () => setContacts(initial),
  }
}
