import { useState } from 'react'
import detailPlus from '../assets/detail-plus.svg'
import { initialReachedStages, propertyStageLabels } from '../data/propertyStages'
import { StagePill } from './StagePill'

/**
 * Where the property is in its life. A stage belongs to the property, not to any
 * one company on it, so it sits in the property column under the address rather
 * than beside the company.
 */
export function PropertyStagesPanel() {
  const [reached, setReached] = useState(initialReachedStages)
  const stages = propertyStageLabels.map((label, index) => ({ label, reached: index < reached }))

  return (
    <section aria-label="Property stages" className="flex flex-col gap-2.5 px-5">
      <StagePill size="sm" stages={stages} />
      {reached < propertyStageLabels.length && (
        <button
          type="button"
          onClick={() => setReached((count) => count + 1)}
          className="flex w-fit items-center gap-1 text-sm font-medium leading-5 text-primary"
        >
          <span className="relative size-4">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={detailPlus} />
          </span>
          Mark stage as Completed
        </button>
      )}
    </section>
  )
}
