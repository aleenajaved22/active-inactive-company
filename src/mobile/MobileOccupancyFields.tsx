import { useState, type RefObject } from 'react'
import {
  OCCUPANCY_DESCRIPTION,
  OCCUPANCY_LABEL,
  OCCUPANCY_PLACEHOLDERS,
  OCCUPANCY_TOOLTIPS,
} from '../data/companyAtPropertyCopy'
import { suiteUnitTypes } from '../data/propertySpaces'
import { IconAlert } from './MobileIcons'
import {
  MobileFieldError,
  MobileFieldHint,
  MobileGroupLabel,
  MobileSectionHeading,
  MobileSuiteUnitField,
  MobileTextField,
} from './MobileFields'

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
  compact,
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
  /**
   * Floor and Suite / Unit / Apartment on one row under a quiet label, with the
   * agreed description kept. The two format explanations, which the web app shows
   * in tooltips, wait behind a tap on an ⓘ instead of sitting under every field.
   * Any message goes beneath both fields. For forms that are already long.
   */
  compact?: boolean
  /** Extra lines under the fields, e.g. a conflict message. */
  children?: React.ReactNode
}) {
  if (compact) {
    return <CompactOccupancy {...{ value, onChange, floorError, suiteUnitError, disabled, numberRef }}>{children}</CompactOccupancy>
  }

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

type CompactProps = {
  value: MobileOccupancyValue
  onChange: (next: MobileOccupancyValue) => void
  floorError?: string | null
  suiteUnitError?: string | null
  disabled?: boolean
  numberRef?: RefObject<HTMLInputElement | null>
  children?: React.ReactNode
}

function CompactOccupancy({ value, onChange, floorError, suiteUnitError, disabled, numberRef, children }: CompactProps) {
  const [showFormats, setShowFormats] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <MobileGroupLabel>{OCCUPANCY_LABEL}</MobileGroupLabel>
        <button
          type="button"
          aria-label="Accepted formats"
          aria-expanded={showFormats}
          onClick={() => setShowFormats((open) => !open)}
          className={`flex size-5 items-center justify-center rounded-full ${showFormats ? 'text-[#146dff]' : 'text-[#86868b]'}`}
        >
          <IconAlert size={16} />
        </button>
      </div>
      <p className="px-1 text-xs leading-4 text-[#86868b]">{OCCUPANCY_DESCRIPTION}</p>

      {showFormats && (
        <div className="flex flex-col gap-2 rounded-lg bg-[#eff4fd] p-3 text-xs leading-4 text-[#3c3c3d]">
          <p>
            <span className="font-semibold text-[#262527]">Floor. </span>
            {OCCUPANCY_TOOLTIPS.floor}
          </p>
          <p>
            <span className="font-semibold text-[#262527]">Suite / Unit / Apartment. </span>
            {OCCUPANCY_TOOLTIPS.suiteUnit}
          </p>
        </div>
      )}

      <div className="mt-1 grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-2">
        <MobileTextField
          label="Floor"
          value={value.floor}
          disabled={disabled}
          onChange={(floor) => onChange({ ...value, floor })}
          placeholder={OCCUPANCY_PLACEHOLDERS.floor}
          invalid={Boolean(floorError)}
        />
        <MobileSuiteUnitField
          typeValue={value.suiteUnitType || 'Suite'}
          onTypeChange={(suiteUnitType) => onChange({ ...value, suiteUnitType })}
          typeOptions={suiteUnitTypes}
          numberValue={value.suiteUnitNumber}
          onNumberChange={(suiteUnitNumber) => onChange({ ...value, suiteUnitNumber })}
          numberRef={numberRef}
          disabled={disabled}
          invalid={Boolean(suiteUnitError)}
        />
      </div>
      {floorError && <MobileFieldError>{floorError}</MobileFieldError>}
      {suiteUnitError && <MobileFieldError>{suiteUnitError}</MobileFieldError>}
      {children}
    </div>
  )
}
