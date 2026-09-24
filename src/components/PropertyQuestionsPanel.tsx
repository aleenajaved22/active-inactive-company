import { useMemo, useState } from 'react'
import questionsCheckboxChecked from '../assets/questions-checkbox-checked.svg'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import { propertyQuestions, type PropertyQuestion } from '../data/propertyQuestions'

const DISABLED_CONTROL = '#86868b'

function PointsColumn({ points }: { points: string }) {
  return (
    <div className="flex w-[60px] shrink-0 items-center justify-center self-stretch bg-[#f5f5f6]">
      <span className="text-sm font-medium leading-5 text-[#262527]">{points}</span>
    </div>
  )
}

function RadioControl({
  options,
  selected,
  onSelect,
  readOnly = false,
}: {
  options: { id: string; label: string }[]
  selected: string
  onSelect: (id: string) => void
  readOnly?: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => {
        const isSelected = selected === option.id
        const ringColor = readOnly
          ? DISABLED_CONTROL
          : isSelected
            ? 'border-primary'
            : 'border-[#6a6a70]'
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className="flex w-[120px] items-center gap-2 text-left"
          >
            <span className="relative flex size-4 items-center justify-center">
              <span className={`size-4 rounded-full border ${ringColor} bg-white`} />
              {isSelected && (
                <span className={`absolute size-2 rounded-full ${readOnly ? 'bg-[#86868b]' : 'bg-primary'}`} />
              )}
            </span>
            <span className={`text-sm leading-5 ${readOnly ? 'text-[#86868b]' : 'text-[#262527]'}`}>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function CheckboxControl({
  options,
  selected,
  onToggle,
  readOnly = false,
}: {
  options: { id: string; label: string }[]
  selected: string[]
  onToggle: (id: string) => void
  readOnly?: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => {
        const isChecked = selected.includes(option.id)
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onToggle(option.id)}
            className="flex max-w-full items-center gap-2 text-left"
          >
            {isChecked && !readOnly ? (
              <span className="relative size-4 shrink-0">
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={questionsCheckboxChecked} />
              </span>
            ) : isChecked && readOnly ? (
              <span className="size-4 shrink-0 rounded border border-[#86868b] bg-[#e6e6e7]" />
            ) : (
              <span
                className={`size-4 shrink-0 rounded border bg-white ${
                  readOnly ? 'border-[#86868b]' : 'border-[#6a6a70]'
                }`}
              />
            )}
            <span className={`text-sm leading-5 ${readOnly ? 'text-[#86868b]' : 'text-[#262527]'}`}>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function SelectControl({ value, readOnly = false }: { value: string; readOnly?: boolean }) {
  return (
    <button
      type="button"
      className={`flex h-8 w-full max-w-[420px] items-center gap-2 rounded-lg border border-[#d0cfd2] bg-white px-3.5 py-2.5 text-left ${
        readOnly ? 'text-[#86868b]' : 'text-[#262527]'
      }`}
    >
      <span className="min-w-0 flex-1 truncate text-sm leading-5 text-inherit">{value}</span>
      <span className="relative size-5 shrink-0">
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={questionsChevronDown} />
      </span>
    </button>
  )
}

function QuestionRow({
  question,
  radioValue,
  checkboxValue,
  onRadioChange,
  onCheckboxToggle,
  readOnly,
}: {
  question: PropertyQuestion
  radioValue?: string
  checkboxValue?: string[]
  onRadioChange?: (id: string) => void
  onCheckboxToggle?: (id: string) => void
  readOnly?: boolean
}) {
  return (
    <>
      <div className="h-px w-full bg-[#e6e6e7]" />
      <div className="flex w-full items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4 px-6 py-4">
          <p className="text-sm font-medium leading-5 text-[#262527]">{question.label}</p>
          {question.type === 'radio' && radioValue && onRadioChange && (
            <RadioControl options={question.options} selected={radioValue} onSelect={onRadioChange} readOnly={readOnly} />
          )}
          {question.type === 'checkbox' && checkboxValue && onCheckboxToggle && (
            <CheckboxControl
              options={question.options}
              selected={checkboxValue}
              onToggle={onCheckboxToggle}
              readOnly={readOnly}
            />
          )}
          {question.type === 'select' && <SelectControl value={question.value} readOnly={readOnly} />}
        </div>
        <PointsColumn points={question.points} />
      </div>
    </>
  )
}

export function PropertyQuestionsPanel({ readOnly = false }: { readOnly?: boolean }) {
  const initialRadio = useMemo(() => {
    const map: Record<string, string> = {}
    for (const q of propertyQuestions) {
      if (q.type === 'radio') map[q.id] = q.defaultSelected
    }
    return map
  }, [])

  const initialCheckbox = useMemo(() => {
    const map: Record<string, string[]> = {}
    for (const q of propertyQuestions) {
      if (q.type === 'checkbox') map[q.id] = [...q.defaultSelected]
    }
    return map
  }, [])

  const [radioAnswers, setRadioAnswers] = useState(initialRadio)
  const [checkboxAnswers, setCheckboxAnswers] = useState(initialCheckbox)

  return (
    <div className="mt-8 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pb-6">
      <div className="flex gap-5 pr-0 text-sm font-medium leading-5 text-[#262527]">
        <p className="min-w-0 flex-1">Calculate location score by answering these questions</p>
        <p className="w-[60px] shrink-0 text-center">Points</p>
      </div>
      <div className="w-full">
        <div className="h-px w-full bg-[#e6e6e7]" />
        {propertyQuestions.map((question) => (
          <QuestionRow
            key={question.id}
            question={question}
            readOnly={readOnly}
            radioValue={question.type === 'radio' ? radioAnswers[question.id] : undefined}
            checkboxValue={question.type === 'checkbox' ? checkboxAnswers[question.id] : undefined}
            onRadioChange={
              question.type === 'radio'
                ? (id) => setRadioAnswers((prev) => ({ ...prev, [question.id]: id }))
                : undefined
            }
            onCheckboxToggle={
              question.type === 'checkbox'
                ? (id) =>
                    setCheckboxAnswers((prev) => {
                      const current = prev[question.id] ?? []
                      const next = current.includes(id)
                        ? current.filter((item) => item !== id)
                        : [...current, id]
                      return { ...prev, [question.id]: next }
                    })
                : undefined
            }
          />
        ))}
        <div className="h-px w-full bg-[#e6e6e7]" />
      </div>
    </div>
  )
}
