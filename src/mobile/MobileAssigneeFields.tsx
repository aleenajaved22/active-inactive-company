import { assigneeOptions, supervisorOptions } from '../data/propertyFormOptions'
import { MobileCheckbox, MobileFieldError, MobileSelectField } from './MobileFields'

export type MobileAssigneeValue = {
  assignee: string
  assignSupervisor: boolean
  supervisor: string
}

export const emptyMobileAssignee = (): MobileAssigneeValue => ({
  assignee: '',
  assignSupervisor: false,
  supervisor: '',
})

/**
 * The web app's Assignee + "Assign Supervisor" pattern in the mobile field
 * language. Every property + company needs an assignee, so this appears wherever
 * a company is put on a property or its record is edited.
 */
export function MobileAssigneeFields({
  value,
  onChange,
  error,
}: {
  value: MobileAssigneeValue
  onChange: (next: MobileAssigneeValue) => void
  error?: string | null
}) {
  return (
    <div className="flex flex-col gap-3">
      <MobileSelectField
        label="Assignee"
        required
        value={value.assignee}
        onChange={(assignee) => onChange({ ...value, assignee })}
        options={assigneeOptions}
        placeholder="Select Assignee"
      />
      {error && <MobileFieldError>{error}</MobileFieldError>}
      <MobileCheckbox
        checked={value.assignSupervisor}
        onChange={(checked) =>
          onChange({
            ...value,
            assignSupervisor: checked,
            supervisor: checked ? value.supervisor : '',
          })
        }
      >
        Assign Supervisor
      </MobileCheckbox>
      {value.assignSupervisor && (
        <MobileSelectField
          label="Supervisor"
          value={value.supervisor}
          onChange={(supervisor) => onChange({ ...value, supervisor })}
          options={supervisorOptions}
          placeholder="Select Supervisor"
        />
      )}
    </div>
  )
}
