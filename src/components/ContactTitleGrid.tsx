import questionsChevronDown from '../assets/questions-chevron-down.svg'
import { contactOptions, contactRoles } from '../data/propertyFormOptions'

/**
 * The Contact Title / Users grid: each label a property can be associated
 * against, with the person chosen for it. The same grid sits in the Add Contact
 * modal and in the Create Property drawer, so a contact is picked the same way in both.
 */
export function ContactTitleGrid({
  chosen,
  onChange,
}: {
  /** The person chosen against each label. */
  chosen: Record<string, string>
  onChange: (next: Record<string, string>) => void
}) {
  return (
    <div>
      <div className="grid grid-cols-[180px_1fr] gap-4 border-y border-[#e6e6e7] bg-white py-3">
        <span className="text-xs font-medium leading-[18px] text-[#5b5b5f]">Contact Title</span>
        <span className="text-xs font-medium leading-[18px] text-[#5b5b5f]">Users</span>
      </div>
      <div className="divide-y divide-[#e6e6e7] border-b border-[#e6e6e7]">
        {contactRoles.map((role) => (
          <div key={role.label} className="grid grid-cols-[180px_1fr] items-center gap-4 py-3">
            <span
              className="w-fit rounded-full px-2.5 py-1 text-xs font-medium leading-[18px]"
              style={{ backgroundColor: role.bg, color: role.text }}
            >
              {role.label}
            </span>
            <div className="relative">
              <select
                aria-label={`${role.label} contact`}
                value={chosen[role.label] ?? ''}
                onChange={(event) => onChange({ ...chosen, [role.label]: event.target.value })}
                className={`h-10 w-full appearance-none rounded-lg border border-[#e6e6e7] bg-white pl-3.5 pr-10 text-sm leading-5 outline-none focus:border-primary ${
                  chosen[role.label] ? 'text-[#262527]' : 'text-[#ccc]'
                }`}
              >
                <option value="">Select Contact</option>
                {contactOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2" aria-hidden>
                <img alt="" className="block size-full max-w-none" src={questionsChevronDown} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
