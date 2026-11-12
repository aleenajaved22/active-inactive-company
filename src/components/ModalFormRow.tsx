import type { ReactNode } from 'react'

export function ModalFormRow({
  label,
  description,
  required,
  children,
}: {
  label: string
  description: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-2 items-start gap-x-8 gap-y-3 py-5">
      <div className="min-w-0">
        <p className="text-sm font-bold leading-5 text-[#262527]">
          {label}
          {required && <span className="text-[#b32318]"> *</span>}
        </p>
        <p className="mt-1 text-sm leading-5 text-[#86868b]">{description}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
