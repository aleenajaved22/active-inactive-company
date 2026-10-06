import { OCCUPANCY_DESCRIPTION, OCCUPANCY_LABEL, OCCUPANCY_TOOLTIPS } from '../data/companyAtPropertyCopy'
import type { GuideStep } from './MobileFieldGuide'

/** The occupancy steps for a form's hint strip, in the order the fields appear. */
export const occupancyGuideSteps: GuideStep[] = [
  { id: 'occupancy', title: OCCUPANCY_LABEL, text: OCCUPANCY_DESCRIPTION },
  { id: 'floor', title: 'Floor', text: OCCUPANCY_TOOLTIPS.floor },
  { id: 'suite', title: 'Suite / Unit / Apartment', text: OCCUPANCY_TOOLTIPS.suiteUnit },
]
