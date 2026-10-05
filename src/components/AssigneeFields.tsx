import questionsChevronDown from '../assets/questions-chevron-down.svg'
import { assigneeOptions, supervisorOptions } from '../data/propertyFormOptions'

type FieldSize = 'sm' | 'md'

const sizeStyles: Record<FieldSize, string> = {
  sm: 'h-10 text-sm leading-5',
  md: 'h-11 text-base leading-6',
}

/** The app's select control, matching the modal (sm) and drawer (md) field heights. */
export function FormSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  size = 'sm',
  invalid,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
  size?: FieldSize
  invalid?: boolean
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full appearance-none rounded-lg border bg-white px-3.5 pr-10 outline-none ${sizeStyles[size]} ${
          invalid ? 'border-[#b32318]' : 'border-[#e6e6e7] focus:border-primary'
        } ${value ? 'text-[#262527]' : 'text-[#ccc]'}`}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2" aria-hidden>
        <img alt="" className="block size-full max-w-none" src={questionsChevronDown} />
      </span>
    </div>
  )
}

export type AssigneeValue = {
  assignee: string
  assignSupervisor: boolean
  supervisor: string
}

export const emptyAssignee = (): AssigneeValue => ({
  assignee: '',
  assignSupervisor: false,
  supervisor: '',
})

/**
 * Assignee, with a checkbox that reveals Supervisor — the pattern established on
 * Create Property. Every property + company needs an assignee, so this appears
 * wherever a company is put on a property or its record is edited.
 */
export function AssigneeFields({
  idPrefix,
  value,
  onChange,
  size = 'sm',
  error,
}: {
  idPrefix: string
  value: AssigneeValue
  onChange: (next: AssigneeValue) => void
  size?: FieldSize
  error?: string | null
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <FormSelect
          id={`${idPrefix}-assignee`}
          value={value.assignee}
          onChange={(assignee) => onChange({ ...value, assignee })}
          options={assigneeOptions}
          placeholder="Select Assignee"
          size={size}
          invalid={Boolean(error)}
        />
        {error && (
          <p className="flex items-start gap-1.5 text-sm leading-5 text-[#b32318]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="mt-0.5 shrink-0">
              <path
                d="M8 5.33333V8M8 10.6667H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </div>
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={value.assignSupervisor}
          onChange={(event) =>
            onChange({
              ...value,
              assignSupervisor: event.target.checked,
              supervisor: event.target.checked ? value.supervisor : '',
            })
          }
          className="size-4 rounded border border-[#6a6a70] accent-primary"
        />
        <span className="text-sm leading-5 text-[#262527]">Assign Supervisor</span>
      </label>
      {value.assignSupervisor && (
        <FormSelect
          id={`${idPrefix}-supervisor`}
          value={value.supervisor}
          onChange={(supervisor) => onChange({ ...value, supervisor })}
          options={supervisorOptions}
          placeholder="Select Supervisor"
          size={size}
        />
      )}
    </div>
  )
}
