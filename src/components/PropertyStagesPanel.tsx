import type { StagePillStage } from './StagePill'
import { StagePill } from './StagePill'

/**
 * Where the property is in its life. A stage belongs to the property, not to any
 * one company on it, so it sits in the property column under the address rather
 * than beside the company. Moving between stages is done from the Back and Action
 * buttons at the top of the column.
 */
export function PropertyStagesPanel({ stages }: { stages: StagePillStage[] }) {
  return (
    <section aria-label="Property stages" className="px-5">
      <StagePill size="sm" stages={stages} />
    </section>
  )
}
