import { useState } from 'react'
import type { StagePillStage } from '../components/StagePill'
import { initialReachedStages, propertyStageLabels } from './propertyStages'

/** The property's stage: how many it has reached, and the move to the next one. */
export function usePropertyStages() {
  const [reached, setReached] = useState(initialReachedStages)
  const total = propertyStageLabels.length
  const stages: StagePillStage[] = propertyStageLabels.map((label, index) => ({
    label,
    reached: index < reached,
  }))

  return {
    stages,
    /** The stage the property would move to, for labelling the action. */
    nextStageLabel: propertyStageLabels[reached],
    goNext: () => setReached((count) => Math.min(total, count + 1)),
  }
}
