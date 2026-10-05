import type { ReactNode } from 'react'
import { OCCUPANCY_DESCRIPTION, OCCUPANCY_LABEL } from '../data/companyAtPropertyCopy'

/**
 * Heading, one-line rule and fields for Property Occupancy, for the places that
 * stack them in a single column (the Create Property drawer and Edit Company).
 *
 * Three tiers, each one step quieter than the last: the group heading, the rule
 * that explains it, then the field labels inside. The heading was previously
 * set exactly like a field label, so the group read as just another field.
 */
export function OccupancyGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold leading-5 text-[#262527]">{OCCUPANCY_LABEL}</p>
        <p className="text-sm leading-5 text-[#6a6a70]">{OCCUPANCY_DESCRIPTION}</p>
      </div>
      {children}
    </div>
  )
}
