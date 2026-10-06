import { contactRoleBadgeStyles } from '../data/contactDirectory'
import type { PropertyContactItem } from '../data/leadActivities'
import { ActionMenu } from './companyActions'

/**
 * The contacts table used on a property's Contacts tab and on Create Property.
 * Each row's ⋮ offers Edit and Remove association.
 */
export function ContactsTable({
  contacts,
  onEdit,
  onRemove,
  dense,
  emptyText = 'No contacts added yet',
}: {
  contacts: PropertyContactItem[]
  onEdit: (contact: PropertyContactItem) => void
  onRemove: (contact: PropertyContactItem) => void
  /** Tighter cell padding, for a narrower container such as the creation drawer. */
  dense?: boolean
  emptyText?: string
}) {
  const cell = dense ? 'px-3' : 'px-6'
  return (
    <table className="min-w-full border-collapse text-left text-sm">
      <thead className="bg-white">
        <tr className="border-b border-[#e6e6e7]">
          {['Name', 'Email', 'Phone no.', 'Labels', ''].map((header) => (
            <th
              key={header || 'actions'}
              className={`whitespace-nowrap ${cell} py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {contacts.length === 0 && (
          <tr>
            <td colSpan={5} className="px-6 py-8 text-center text-sm leading-5 text-[#86868b]">
              {emptyText}
            </td>
          </tr>
        )}
        {contacts.map((contact) => (
          <tr key={contact.id} className="border-b border-[#e6e6e7] last:border-b-0">
            <td className={`whitespace-nowrap ${cell} py-3.5`}>
              <div className="flex items-center gap-3">
                <img
                  alt=""
                  className="size-6 shrink-0 rounded-full object-cover"
                  src={contact.avatarSrc}
                  width={24}
                  height={24}
                />
                <span className="font-medium leading-5 text-[#444446]">{contact.name}</span>
              </div>
            </td>
            <td className={`max-w-[220px] truncate ${cell} py-3.5 font-medium leading-5 text-[#86868b]`} title={contact.email}>
              {contact.email}
            </td>
            <td className={`whitespace-nowrap ${cell} py-3.5 font-medium leading-5 text-[#86868b]`}>{contact.phone}</td>
            <td className={`${cell} py-3.5`}>
              <div className="flex max-w-md flex-wrap gap-1">
                {contact.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px]"
                    style={{ backgroundColor: contactRoleBadgeStyles[role].bg, color: contactRoleBadgeStyles[role].text }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-2 py-3.5 text-right">
              <div className="flex justify-end">
                <ActionMenu
                  label={`Actions for ${contact.name}`}
                  items={[
                    { label: 'Edit', icon: 'edit', onSelect: () => onEdit(contact) },
                    { label: 'Remove association', icon: 'remove', destructive: true, onSelect: () => onRemove(contact) },
                  ]}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
