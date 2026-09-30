import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import { suiteUnitTypes, type SpaceType } from '../data/propertySpaces'

export type SpaceFieldsValue = {
  floor: string
  apartment: string
  suiteUnitType: SpaceType | ''
  suiteUnitNumber: string
}

export const emptySpaceFields = (): SpaceFieldsValue => ({
  floor: '',
  apartment: '',
  suiteUnitType: 'Suite',
  suiteUnitNumber: '',
})

export type SpaceFieldsErrors = {
  floor?: string | null
  apartment?: string | null
  suiteUnit?: string | null
}

type FieldSize = 'sm' | 'md'

const fieldHeight: Record<FieldSize, string> = { sm: 'h-10', md: 'h-11' }

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium leading-5 text-[#86868b]">{children}</span>
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

/** Suite/Unit type picker: a small listbox limited to Suite and Unit. */
function SuiteUnitTypeMenu({
  id,
  value,
  onChange,
  invalid,
  disabled,
}: {
  id: string
  value: SpaceType | ''
  onChange: (value: SpaceType) => void
  invalid?: boolean
  disabled?: boolean
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
    <div ref={rootRef} className="relative w-[124px] shrink-0">
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
        className={`flex h-full w-full items-center justify-between gap-2 rounded-l-lg bg-transparent pl-3.5 pr-3 text-left text-base leading-6 outline-none ${
          value ? 'text-[#262527]' : 'text-[#ccc]'
        }`}
      >
        {value || 'Type'}
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
  disabled,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  size: FieldSize
  error?: string | null
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id}>
        <FieldLabel>{label}</FieldLabel>
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        disabled={disabled}
        className={`${fieldHeight[size]} w-full rounded-lg border ${disabled ? 'bg-[#f5f5f6]' : 'bg-white'} px-3.5 text-base leading-6 text-[#262527] outline-none placeholder:text-[#ccc] ${
          error ? 'border-[#d92d20]' : 'border-[#e6e6e7] focus:border-primary'
        }`}
      />
      {error && <FieldError>{error}</FieldError>}
    </div>
  )
}

/** Floor, Apartment and a joined Suite / Unit field — the space inputs shared by the create and switch flows. */
const columnsClass: Record<1 | 2 | 3, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
}

export function SpaceFields({
  value,
  onChange,
  idPrefix = 'space',
  size = 'md',
  columns = 3,
  errors,
  suiteUnitNumberRef,
  disabled,
}: {
  value: SpaceFieldsValue
  onChange: (next: SpaceFieldsValue) => void
  idPrefix?: string
  size?: FieldSize
  columns?: 1 | 2 | 3
  errors?: SpaceFieldsErrors
  suiteUnitNumberRef?: RefObject<HTMLInputElement | null>
  /** Read-only display, e.g. when the space is locked to an existing one. */
  disabled?: boolean
}) {
  const suiteUnitInvalid = Boolean(errors?.suiteUnit)
  return (
    <div className={`grid ${columnsClass[columns]} items-start gap-4`}>
      <TextField
        id={`${idPrefix}-floor`}
        label="Floor"
        value={value.floor}
        onChange={(floor) => onChange({ ...value, floor })}
        placeholder="5"
        size={size}
        error={errors?.floor}
        disabled={disabled}
      />
      <TextField
        id={`${idPrefix}-apartment`}
        label="Apartment"
        value={value.apartment}
        onChange={(apartment) => onChange({ ...value, apartment })}
        placeholder="12B"
        size={size}
        error={errors?.apartment}
        disabled={disabled}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-suite-unit-type`}>
          <FieldLabel>Suite / Unit</FieldLabel>
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
            placeholder="210B"
            className="min-w-0 flex-1 rounded-r-lg bg-transparent px-3.5 text-base leading-6 text-[#262527] outline-none placeholder:text-[#ccc]"
          />
        </div>
        {errors?.suiteUnit && <FieldError>{errors.suiteUnit}</FieldError>}
      </div>
    </div>
  )
}
