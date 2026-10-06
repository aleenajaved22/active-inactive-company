import contactAvatarDarrell from '../assets/contacts/avatar-darrell.png'
import contactAvatarSavannah from '../assets/contacts/avatar-savannah.png'
import type { PropertyContactItem, PropertyContactRole } from './leadActivities'

/** Badge colours per contact label, shared wherever contacts are listed. */
export const contactRoleBadgeStyles: Record<PropertyContactRole, { bg: string; text: string }> = {
  'Decision Maker': { bg: '#f4edfd', text: '#9747ff' },
  'End user': { bg: '#e5f6ff', text: '#146dff' },
  Billing: { bg: '#eff8ef', text: '#2e964b' },
  Blocker: { bg: '#fef0c7', text: '#f4780b' },
  Influencer: { bg: '#ffeed4', text: '#ef5c07' },
}

export const contactRoleOrder: PropertyContactRole[] = [
  'Decision Maker',
  'End user',
  'Billing',
  'Blocker',
  'Influencer',
]

/** The Add Contact grid writes "End User"; the table's label is "End user". */
export function toContactRole(label: string): PropertyContactRole {
  return label === 'End User' ? 'End user' : (label as PropertyContactRole)
}

/** The people who can be attached to a property as a contact. */
export const contactDirectory: Record<string, { email: string; phone: string; avatarSrc: string }> = {
  'Henry Micheal': { email: 'henrymicheal23@signal.com', phone: '773-402-1188', avatarSrc: contactAvatarDarrell },
  'Jerome Bell': { email: 'jerome.bell@signal.com', phone: '773-555-0142', avatarSrc: contactAvatarSavannah },
}

/** Adds each chosen person against their label, merging labels onto a contact already listed. */
export function mergeContacts(
  existing: PropertyContactItem[],
  additions: { role: PropertyContactRole; user: string }[],
): PropertyContactItem[] {
  const next = existing.map((contact) => ({ ...contact, roles: [...contact.roles] }))
  for (const { role, user } of additions) {
    const found = next.find((contact) => contact.name === user)
    if (found) {
      if (!found.roles.includes(role)) found.roles.push(role)
      continue
    }
    const person = contactDirectory[user]
    if (!person) continue
    next.push({ id: `contact-${user}`, name: user, ...person, roles: [role] })
  }
  return next
}
