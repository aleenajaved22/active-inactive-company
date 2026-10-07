import type { ReactNode } from 'react'
import { OCCUPANCY_DESCRIPTION, OCCUPANCY_LABEL } from '../data/companyAtPropertyCopy'
import { InfoTooltip } from './InfoTooltip'

/**
 * Heading (with its rule in a tooltip) and fields for Property Occupancy, for the places that
 * stack them in a single column (the Create Property drawer and Edit Company).
 *
 * The heading is set a step above the field labels inside it, with the rule that
 * explains it one hover away, so the group does not read as just another field.
 */
export function OccupancyGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-semibold leading-5 text-[#262527]">{OCCUPANCY_LABEL}</p>
        <InfoTooltip label={`${OCCUPANCY_LABEL} information`} text={OCCUPANCY_DESCRIPTION} />
      </div>
      {children}
    </div>
  )
}
