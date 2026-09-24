import { useEffect, useRef, useState } from 'react'
import modalCalendar from '../assets/modal-calendar.svg'

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

function formatDateMMDDYYYY(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

function parseDateMMDDYYYY(value: string): Date | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim())
  if (!match) return null
  const month = Number(match[1])
  const day = Number(match[2])
  const year = Number(match[3])
  const parsed = new Date(year, month - 1, day)
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return null
  }
  return parsed
}

function getCalendarDays(viewMonth: Date): (Date | null)[] {
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDay; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

type ModalDateInputProps = {
  id: string
  value: string
  onChange: (value: string) => void
  variant?: 'modal' | 'drawer'
}

export function ModalDateInput({ id, value, onChange, variant = 'modal' }: ModalDateInputProps) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(() => new Date())
  const rootRef = useRef<HTMLDivElement>(null)

  const isDrawer = variant === 'drawer'

  useEffect(() => {
    if (!calendarOpen) return
    const parsed = parseDateMMDDYYYY(value)
    setViewMonth(parsed ?? new Date())
  }, [calendarOpen, value])

  useEffect(() => {
    if (!calendarOpen) return
    const closeOnOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [calendarOpen])

  useEffect(() => {
    if (!calendarOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCalendarOpen(false)
        event.stopImmediatePropagation()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [calendarOpen])

  const selectedDate = parseDateMMDDYYYY(value)
  const today = new Date()
  const calendarDays = getCalendarDays(viewMonth)

  return (
    <div ref={rootRef} className="relative max-w-full">
      <div
        className={`flex items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5 ${
          isDrawer ? 'h-11' : 'h-10'
        }`}
      >
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="MM/DD/YYYY"
          className={`min-w-0 flex-1 bg-transparent text-[#262527] outline-none ${
            isDrawer
              ? 'text-base leading-6 placeholder:text-[#ccc]'
              : 'text-sm leading-5 placeholder:text-[#6a6a70]'
          }`}
        />
        <button
          type="button"
          aria-label={calendarOpen ? 'Close calendar' : 'Open calendar'}
          aria-expanded={calendarOpen}
          onClick={() => setCalendarOpen((prev) => !prev)}
          className="relative size-4 shrink-0"
        >
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={modalCalendar} />
        </button>
      </div>
      {calendarOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-[#e6e6e7] bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              className="rounded-md px-2 py-1 text-sm text-[#444446] hover:bg-[#f5f5f6]"
            >
              ‹
            </button>
            <p className="text-sm font-medium leading-5 text-[#262527]">
              {MONTH_LABELS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              className="rounded-md px-2 py-1 text-sm text-[#444446] hover:bg-[#f5f5f6]"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className="py-1 text-center text-xs font-medium text-[#86868b]">
                {label}
              </span>
            ))}
            {calendarDays.map((day, index) => {
              if (!day) {
                return <span key={`empty-${index}`} className="size-8" aria-hidden />
              }
              const selected = selectedDate ? isSameDay(day, selectedDate) : false
              const isToday = isSameDay(day, today)
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => {
                    onChange(formatDateMMDDYYYY(day))
                    setCalendarOpen(false)
                  }}
                  className={`size-8 rounded-md text-sm leading-5 ${
                    selected
                      ? 'bg-primary font-medium text-white'
                      : isToday
                        ? 'font-medium text-primary ring-1 ring-primary ring-inset'
                        : 'text-[#262527] hover:bg-[#f5f5f6]'
                  }`}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
