import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import {
  OCCUPANCY_PLACEHOLDERS,
  OCCUPANCY_TOOLTIPS,
  SUITE_UNIT_LABEL,
} from '../data/companyAtPropertyCopy'
import { suiteUnitTypes, type SpaceType } from '../data/propertySpaces'
import { InfoTooltip } from './InfoTooltip'

export type SpaceFieldsValue = {
  floor: string
  suiteUnitType: SpaceType | ''
  suiteUnitNumber: string
}

export const emptySpaceFields = (): SpaceFieldsValue => ({
  floor: '',
  suiteUnitType: 'Suite',
  suiteUnitNumber: '',
})

export type SpaceFieldsErrors = {
  floor?: string | null
  suiteUnit?: string | null
}

type FieldSize = 'sm' | 'md'

const fieldHeight: Record<FieldSize, string> = { sm: 'h-10', md: 'h-11' }

/**
 * Modals (sm) set field text at 14px with a darker placeholder; the drawer (md)
 * sets it at 16px with a light one. The occupancy fields follow whichever they
 * sit in, instead of carrying the drawer's scale into a modal.
 */
const fieldText: Record<FieldSize, string> = {
  sm: 'text-sm leading-5 placeholder:text-[#6a6a70]',
  md: 'text-base leading-6 placeholder:text-[#ccc]',
}
const menuText: Record<FieldSize, string> = {
  sm: 'text-sm leading-5',
  md: 'text-base leading-6',
}

/** How the two fields share their row. */
export type SpaceFieldsLayout =
  /** Floor narrow, Suite / Unit / Apartment wide — for a single full-width column. */
  | 'weighted'
  /** Two equal columns, to line up with a two-column grid above or beside it. */
  | 'even'
  /** One above the other, each at the full width of the column it sits in. */
  | 'stacked'
  /**
   * Side by side in a single column, Floor just wide enough for its hint, for a
   * row shared with another field. Messages go below both so they get the full
   * width, instead of wrapping inside the narrow Floor field.
   */
  | 'compact'

const layoutClass: Record<SpaceFieldsLayout, string> = {
  weighted: 'grid-cols-[minmax(0,0.7fr)_minmax(0,1.6fr)] gap-4',
  even: 'grid-cols-2 gap-6',
  stacked: 'grid-cols-1 gap-4',
  compact: 'grid-cols-[7rem_minmax(0,1fr)] gap-3',
}

function FieldLabel({ children, tooltip, tooltipLabel }: { children: ReactNode; tooltip?: string; tooltipLabel?: string }) {
  if (!tooltip) {
    return <span className="text-sm font-medium leading-5 text-[#86868b]">{children}</span>
  }
  return (
    <span className="flex items-center gap-1">
      <span className="text-sm font-medium leading-5 text-[#86868b]">{children}</span>
      <InfoTooltip label={tooltipLabel ?? `${children} information`} text={tooltip} />
    </span>
  )
}

function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1 flex items-start gap-1.5 text-sm leading-5 text-[#d92d20]">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="mt-0.5 shrink-0">
        <path
          d="M8 5.33333V8M8 10.6667H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{children}</span>
    </p>
  )
}

/** Suite / Unit / Apartment type picker: a small listbox. */
function SuiteUnitTypeMenu({
  id,
  value,
  onChange,
  invalid,
  disabled,
  size,
}: {
  id: string
  value: SpaceType | ''
  onChange: (value: SpaceType) => void
  invalid?: boolean
  disabled?: boolean
  size: FieldSize
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [open])

  const openMenu = () => {
    setActiveIndex(value ? Math.max(0, suiteUnitTypes.indexOf(value as (typeof suiteUnitTypes)[number])) : 0)
    setOpen(true)
  }

  const choose = (option: SpaceType) => {
    onChange(option)
    setOpen(false)
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape' && open) {
      event.stopPropagation()
      setOpen(false)
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) return openMenu()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + step + suiteUnitTypes.length) % suiteUnitTypes.length)
      return
    }
    if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault()
      choose(suiteUnitTypes[activeIndex])
    }
  }

  return (
    <div ref={rootRef} className="relative w-[112px] shrink-0">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        aria-label={value ? `Property occupancy type: ${value}` : 'Property occupancy type'}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`flex h-full w-full items-center justify-between gap-2 rounded-l-lg bg-transparent pl-3.5 pr-2 text-left text-[#262527] outline-none ${menuText[size]}`}
      >
        {value || 'Suite'}
        <span className="relative size-5 shrink-0" aria-hidden>
          <img
            alt=""
            className={`absolute inset-0 block size-full max-w-none transition-transform ${open ? 'rotate-180' : ''}`}
            src={questionsChevronDown}
          />
        </span>
      </button>
      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          aria-label="Property occupancy type"
          className="absolute -left-px top-full z-10 mt-1 w-[calc(100%+2px)] overflow-y-auto rounded-lg border border-[#e6e6e7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          {suiteUnitTypes.map((option, index) => {
            const selected = value === option
            return (
              <li
                key={option}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={selected}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option)}
                className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm leading-5 text-[#262527] ${
                  index === activeIndex ? 'bg-[#f5f5f6]' : ''
                } ${selected ? 'font-medium' : ''}`}
              >
                {option}
                {selected && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="text-primary">
                    <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  size,
  error,
  invalid,
  disabled,
  tooltip,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  size: FieldSize
  error?: string | null
  /** Accepted-format help, shown behind an ⓘ beside the label. */
  tooltip?: string
  /** Red border without an inline message, when the message is shown elsewhere. */
  invalid?: boolean
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id}>
        <FieldLabel tooltip={tooltip} tooltipLabel={`${label} format`}>
          {label}
        </FieldLabel>
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={error || invalid ? true : undefined}
        disabled={disabled}
        className={`${fieldHeight[size]} w-full rounded-lg border ${disabled ? 'bg-[#f5f5f6]' : 'bg-white'} px-3.5 text-[#262527] outline-none text-ellipsis ${fieldText[size]} ${
          error || invalid ? 'border-[#d92d20]' : 'border-[#e6e6e7] focus:border-primary'
        }`}
      />
      {error && <FieldError>{error}</FieldError>}
    </div>
  )
}

/** Floor and a joined Suite / Unit / Apartment field — the space inputs shared by the create and switch flows. */
export function SpaceFields({
  value,
  onChange,
  idPrefix = 'space',
  size = 'md',
  errors,
  invalidField,
  suiteUnitNumberRef,
  disabled,
  layout = 'weighted',
}: {
  value: SpaceFieldsValue
  onChange: (next: SpaceFieldsValue) => void
  idPrefix?: string
  size?: FieldSize
  layout?: SpaceFieldsLayout
  errors?: SpaceFieldsErrors
  /** Marks one field red when its message is rendered outside this component. */
  invalidField?: 'floor' | 'suiteUnit'
  suiteUnitNumberRef?: RefObject<HTMLInputElement | null>
  /** Read-only display, e.g. when the space is locked to an existing one. */
  disabled?: boolean
}) {
  const suiteUnitInvalid = Boolean(errors?.suiteUnit) || invalidField === 'suiteUnit'
  // In a shared row the messages go beneath both fields, not inside each one.
  const messagesBelow = layout === 'compact'
  return (
    <div>
    <div className={`grid items-start ${layoutClass[layout]}`}>
      <TextField
        id={`${idPrefix}-floor`}
        label="Floor"
        value={value.floor}
        onChange={(floor) => onChange({ ...value, floor })}
        placeholder={OCCUPANCY_PLACEHOLDERS.floor}
        tooltip={OCCUPANCY_TOOLTIPS.floor}
        size={size}
        error={messagesBelow ? undefined : errors?.floor}
        invalid={invalidField === 'floor' || (messagesBelow && Boolean(errors?.floor))}
        disabled={disabled}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-suite-unit-type`}>
          <FieldLabel tooltip={OCCUPANCY_TOOLTIPS.suiteUnit} tooltipLabel={`${SUITE_UNIT_LABEL} format`}>
            {SUITE_UNIT_LABEL}
          </FieldLabel>
        </label>
        <div
          className={`flex ${fieldHeight[size]} rounded-lg border ${disabled ? 'bg-[#f5f5f6]' : 'bg-white'} ${
            suiteUnitInvalid ? 'border-[#d92d20]' : 'border-[#e6e6e7] focus-within:border-primary'
          }`}
        >
          <SuiteUnitTypeMenu
            id={`${idPrefix}-suite-unit-type`}
            value={value.suiteUnitType}
            onChange={(suiteUnitType) => onChange({ ...value, suiteUnitType })}
            invalid={suiteUnitInvalid}
            disabled={disabled}
            size={size}
          />
          <div className="my-2.5 w-px shrink-0 bg-[#e6e6e7]" aria-hidden />
          <input
            ref={suiteUnitNumberRef}
            id={`${idPrefix}-suite-unit-number`}
            type="text"
            aria-label={value.suiteUnitType ? `${value.suiteUnitType} number` : 'Suite or unit number'}
            aria-invalid={suiteUnitInvalid || undefined}
            value={value.suiteUnitNumber}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, suiteUnitNumber: event.target.value })}
            placeholder={OCCUPANCY_PLACEHOLDERS.suiteUnit}
            className={`min-w-0 flex-1 rounded-r-lg bg-transparent px-3.5 text-[#262527] outline-none text-ellipsis ${fieldText[size]}`}
          />
        </div>
        {!messagesBelow && errors?.suiteUnit && <FieldError>{errors.suiteUnit}</FieldError>}
      </div>
    </div>
    {messagesBelow && (errors?.floor || errors?.suiteUnit) && (
      <div className="mt-1.5 flex flex-col gap-1">
        {errors?.floor && <FieldError>{errors.floor}</FieldError>}
        {errors?.suiteUnit && <FieldError>{errors.suiteUnit}</FieldError>}
      </div>
    )}
    </div>
  )
}
