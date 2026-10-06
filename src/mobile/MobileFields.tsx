import type { ReactNode } from 'react'
import { OCCUPANCY_PLACEHOLDERS, SUITE_UNIT_LABEL } from '../data/companyAtPropertyCopy'
import { IconAlert, IconChevronDown } from './MobileIcons'

/** A quiet label over a group of fields, for forms where a full heading would outweigh the fields. */
export function MobileGroupLabel({ children }: { children: ReactNode }) {
  return <h2 className="px-1 text-sm font-semibold leading-5 text-[#262527]">{children}</h2>
}

/** Section heading inside a mobile form. */
export function MobileSectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold leading-6 text-black">{children}</h2>
}

function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="w-full truncate text-xs leading-4 text-[#4d4d51]">
      {children}
      {required && <span className="text-[#b32318]"> *</span>}
    </span>
  )
}

/** Helper line under a field, for the hints the web app shows in a tooltip. */
export function MobileFieldHint({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-4 text-[#86868b]">{children}</p>
}

/** Validation message, matching the web app's field error. */
export function MobileFieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-xs leading-4 text-[#d92d20]">
      <IconAlert size={14} className="mt-px shrink-0" />
      <span>{children}</span>
    </p>
  )
}

type ShellProps = {
  children: ReactNode
  trailing?: ReactNode
  /** Grows past 62px for multi-line fields. */
  auto?: boolean
  invalid?: boolean
  disabled?: boolean
}

/** Component 30 — 343 x 62, Light Grey, 8px radius. */
function FieldShell({ children, trailing, auto, invalid, disabled }: ShellProps) {
  return (
    <div
      className={`relative flex w-full items-center justify-center gap-0.5 rounded-lg px-4 py-3 ${
        disabled ? 'bg-[#ececed]' : 'bg-[#f6f6f8]'
      } ${auto ? 'min-h-[62px]' : 'h-[62px]'} ${invalid ? 'border border-[#d92d20]' : ''}`}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">{children}</div>
      {trailing}
    </div>
  )
}

function Chevron() {
  return <IconChevronDown size={24} className="text-[#5b5b5f]" />
}

type FieldBaseProps = {
  id?: string
  label: string
  required?: boolean
  error?: string | null
  /** Red border with no message under the field, when the message is shown elsewhere. */
  invalid?: boolean
}

type SelectFieldProps = FieldBaseProps & {
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
}

/** Native picker under a Component 30 shell, so the prototype is operable on device. */
export function MobileSelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: SelectFieldProps) {
  const empty = value === ''
  return (
    <div className="flex w-full flex-col gap-1">
      <FieldShell trailing={<Chevron />} invalid={Boolean(error)}>
        <FieldLabel required={required}>{label}</FieldLabel>
        <span
          className={`w-full truncate text-[15px] font-medium leading-5 ${
            empty ? 'text-[#86868b]' : 'text-black'
          }`}
        >
          {empty ? (placeholder ?? 'Select') : value}
        </span>
        <select
          id={id}
          aria-label={label}
          aria-invalid={error ? true : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        >
          {empty && <option value="">{placeholder ?? 'Select'}</option>}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FieldShell>
      {error && <MobileFieldError>{error}</MobileFieldError>}
    </div>
  )
}

type TextFieldProps = FieldBaseProps & {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  inputMode?: 'text' | 'numeric'
  disabled?: boolean
}

export function MobileTextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  inputMode = 'text',
  disabled,
  invalid,
}: TextFieldProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <FieldShell invalid={Boolean(error) || invalid} disabled={disabled}>
        <FieldLabel required={required}>{label}</FieldLabel>
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          aria-label={label}
          aria-invalid={error ? true : undefined}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] font-medium leading-5 text-black outline-none placeholder:font-medium placeholder:text-[#86868b] disabled:text-[#6a6a70]"
        />
      </FieldShell>
      {error && <MobileFieldError>{error}</MobileFieldError>}
    </div>
  )
}

export function MobileTextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: TextFieldProps & { rows?: number }) {
  return (
    <FieldShell auto>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        aria-label={label}
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent text-[15px] font-medium leading-5 text-black outline-none placeholder:font-medium placeholder:text-[#86868b]"
      />
    </FieldShell>
  )
}

/** Field with a custom control on the right, e.g. a date picker. */
export function MobileFieldWithTrailing({
  label,
  trailing,
  children,
}: {
  label: string
  trailing: ReactNode
  children: ReactNode
}) {
  return (
    <FieldShell trailing={trailing}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </FieldShell>
  )
}

/**
 * The web app's joined Suite / Unit / Apartment control: one field holding a
 * space type and its number.
 */
export function MobileSuiteUnitField({
  typeValue,
  onTypeChange,
  typeOptions,
  numberValue,
  onNumberChange,
  numberRef,
  error,
  disabled,
  invalid,
}: {
  typeValue: string
  onTypeChange: (value: string) => void
  typeOptions: readonly string[]
  numberValue: string
  onNumberChange: (value: string) => void
  numberRef?: React.RefObject<HTMLInputElement | null>
  error?: string | null
  disabled?: boolean
  invalid?: boolean
}) {
  return (
    <div className="flex w-full flex-col gap-1">
      <FieldShell invalid={Boolean(error) || invalid} disabled={disabled}>
        <FieldLabel>{SUITE_UNIT_LABEL}</FieldLabel>
        <div className="flex w-full items-center gap-3">
          <div className="relative flex shrink-0 items-center gap-1">
            <span className="text-[15px] font-medium leading-5 text-black">{typeValue}</span>
            <IconChevronDown size={18} className="text-[#5b5b5f]" />
            <select
              aria-label="Space type"
              value={typeValue}
              disabled={disabled}
              onChange={(event) => onTypeChange(event.target.value)}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <span className="h-5 w-px shrink-0 bg-[#d9d9de]" aria-hidden />
          <input
            ref={numberRef}
            id="mobile-create-property-suite-unit-number"
            type="text"
            aria-label={`${typeValue} number`}
            aria-invalid={error ? true : undefined}
            value={numberValue}
            disabled={disabled}
            onChange={(event) => onNumberChange(event.target.value)}
            placeholder={OCCUPANCY_PLACEHOLDERS.suiteUnit}
            className="min-w-0 flex-1 text-ellipsis bg-transparent text-[15px] font-medium leading-5 text-black outline-none placeholder:font-medium placeholder:text-[#86868b]"
          />
        </div>
      </FieldShell>
      {error && <MobileFieldError>{error}</MobileFieldError>}
    </div>
  )
}

export function MobileCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 px-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-5 rounded border border-[#6a6a70] accent-[#146dff]"
      />
      <span className="text-[15px] leading-5 text-black">{children}</span>
    </label>
  )
}

/** Multi-select pills — the web app's Affiliation control in the mobile chip language. */
export function MobileChoiceChips({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[]
  selected: Set<string>
  onToggle: (option: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isOn = selected.has(option)
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isOn}
            onClick={() => onToggle(option)}
            className={`flex h-[38px] items-center rounded-[48px] px-4 text-xs font-medium leading-[18px] text-black ${
              isOn ? 'border-[1.5px] border-[#146dff] bg-white' : 'bg-[#f6f6f8]'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

/** Date in MM/DD/YYYY, matching the web app's date input and its error copy. */
export function MobileDateField({
  label,
  value,
  onChange,
  required,
  error,
}: FieldBaseProps & { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <FieldShell invalid={Boolean(error)} trailing={<CalendarGlyph />}>
        <FieldLabel required={required}>{label}</FieldLabel>
        <input
          type="text"
          inputMode="numeric"
          aria-label={label}
          aria-invalid={error ? true : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="MM/DD/YYYY"
          className="w-full bg-transparent text-[15px] font-medium leading-5 text-black outline-none placeholder:font-medium placeholder:text-[#86868b]"
        />
      </FieldShell>
      {error && <MobileFieldError>{error}</MobileFieldError>}
    </div>
  )
}

function CalendarGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <rect x="3.6" y="5.4" width="16.8" height="15" rx="2" stroke="#5b5b5f" strokeWidth="1.5" />
      <path d="M3.6 9.8h16.8M8.2 3.6v3.4M15.8 3.6v3.4" stroke="#5b5b5f" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** Read-only row that opens a picker, e.g. the company combobox. */
export function MobilePickerField({
  label,
  value,
  placeholder,
  onOpen,
  required,
  error,
}: FieldBaseProps & { value: string; placeholder: string; onOpen: () => void }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <button type="button" onClick={onOpen} className="w-full text-left">
        <FieldShell invalid={Boolean(error)} trailing={<Chevron />}>
          <FieldLabel required={required}>{label}</FieldLabel>
          <span
            className={`w-full truncate text-[15px] font-medium leading-5 ${
              value ? 'text-black' : 'text-[#86868b]'
            }`}
          >
            {value || placeholder}
          </span>
        </FieldShell>
      </button>
      {error && <MobileFieldError>{error}</MobileFieldError>}
    </div>
  )
}
