import type { RefObject } from 'react'
import {
  OCCUPANCY_DESCRIPTION,
  OCCUPANCY_LABEL,
  OCCUPANCY_PLACEHOLDERS,
  OCCUPANCY_TOOLTIPS,
} from '../data/companyAtPropertyCopy'
import { suiteUnitTypes } from '../data/propertySpaces'
import { MobileFieldHint, MobileSectionHeading, MobileSuiteUnitField, MobileTextField } from './MobileFields'

type MobileOccupancyValue = {
  floor: string
  suiteUnitType: string
  suiteUnitNumber: string
}

/**
 * Property Occupancy for the mobile forms. Floor and Suite / Unit / Apartment
 * each travel with the format hint that explains them — the web app shows that
 * hint in a tooltip, which touch has no hover for — so a hint sits tight under
 * its own field and the fields sit clearly apart from one another.
 */
export function MobileOccupancyFields({
  value,
  onChange,
  floorError,
  suiteUnitError,
  disabled,
  numberRef,
  hideHeading,
  children,
}: {
  value: MobileOccupancyValue
  onChange: (next: MobileOccupancyValue) => void
  floorError?: string | null
  suiteUnitError?: string | null
  disabled?: boolean
  numberRef?: RefObject<HTMLInputElement | null>
  /** Leaves out the heading and its subtext, for a form that shows just the fields. */
  hideHeading?: boolean
  /** Extra lines under the fields, e.g. a conflict message. */
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      {!hideHeading && (
        <div className="flex flex-col gap-1">
          <MobileSectionHeading>{OCCUPANCY_LABEL}</MobileSectionHeading>
          <p className="text-sm leading-5 text-[#6a6a70]">{OCCUPANCY_DESCRIPTION}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <MobileTextField
          label="Floor"
          value={value.floor}
          disabled={disabled}
          onChange={(floor) => onChange({ ...value, floor })}
          placeholder={OCCUPANCY_PLACEHOLDERS.floor}
          error={floorError}
        />
        <MobileFieldHint>{OCCUPANCY_TOOLTIPS.floor}</MobileFieldHint>
      </div>

      <div className="flex flex-col gap-1.5">
        <MobileSuiteUnitField
          typeValue={value.suiteUnitType || 'Suite'}
          onTypeChange={(suiteUnitType) => onChange({ ...value, suiteUnitType })}
          typeOptions={suiteUnitTypes}
          numberValue={value.suiteUnitNumber}
          onNumberChange={(suiteUnitNumber) => onChange({ ...value, suiteUnitNumber })}
          numberRef={numberRef}
          disabled={disabled}
          error={suiteUnitError}
        />
        <MobileFieldHint>{OCCUPANCY_TOOLTIPS.suiteUnit}</MobileFieldHint>
      </div>

      {children}
    </div>
  )
}
