import { useState } from 'react'
import type { StagePillStage } from '../components/StagePill'
import { initialReachedStages, propertyStageLabels } from './propertyStages'

/** The property's stage: how many it has reached, and the moves between them. */
export function usePropertyStages() {
  const [reached, setReached] = useState(initialReachedStages)
  const total = propertyStageLabels.length
  const stages: StagePillStage[] = propertyStageLabels.map((label, index) => ({
    label,
    reached: index < reached,
  }))

  return {
    stages,
    canGoBack: reached > 1,
    canGoNext: reached < total,
    goBack: () => setReached((count) => Math.max(1, count - 1)),
    goNext: () => setReached((count) => Math.min(total, count + 1)),
  }
}
