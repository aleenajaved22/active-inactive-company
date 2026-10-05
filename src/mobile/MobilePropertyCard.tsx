import type { ComponentType, SVGProps } from 'react'
import { IconAlert, IconChevronRight, IconLocation, IconRepeat, IconStore } from './MobileIcons'
import { mobile } from './mobileTokens'

export type MobilePropertyCardProps = {
  id: string
  amountLabel?: string
  amount: string
  title: string
  address: string
  companies: string[]
  requiresSignature?: boolean
  followUp?: boolean
  onOpen?: () => void
}

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

type DetailRowProps = {
  icon: IconComponent
  label: string
  color?: string
}

function DetailRow({ icon: Icon, label, color = mobile.grey700 }: DetailRowProps) {
  const iconColor = color === mobile.grey700 ? mobile.grey500 : color
  return (
    <div className="flex w-full items-center gap-1.5">
      <Icon size={16} style={{ color: iconColor }} />
      <span className="min-w-0 flex-1 truncate text-sm leading-[17px]" style={{ color }}>
        {label}
      </span>
    </div>
  )
}

const MAX_VISIBLE_COMPANIES = 2

/** The web table shows two companies plus an overflow count; one line does the same here. */
function CompaniesRow({ companies }: { companies: string[] }) {
  const visible = companies.slice(0, MAX_VISIBLE_COMPANIES)
  const overflow = companies.length - visible.length
  return (
    <div className="flex w-full items-center gap-1.5">
      <IconStore size={16} style={{ color: mobile.grey500 }} />
      <span className="min-w-0 flex-1 truncate text-sm leading-[17px] text-[#4d4d51]">
        {visible.join(', ')}
      </span>
      {overflow > 0 && (
        <span className="shrink-0 rounded-2xl bg-[#f6f6f8] px-2 py-0.5 text-xs font-medium leading-[15px] text-[#5b5b5f]">
          +{overflow}
        </span>
      )}
    </div>
  )
}

/** Location listing card — 343 wide, 16px padding, 12px rhythm. */
export function MobilePropertyCard({
  id,
  amountLabel = 'Company Amount',
  amount,
  title,
  address,
  companies,
  requiresSignature,
  followUp,
  onOpen,
}: MobilePropertyCardProps) {
  return (
    <article
      onClick={onOpen}
      className="flex w-full cursor-pointer flex-col items-start justify-center gap-3 rounded-lg bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)]"
    >
      {/* Meta row */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-xs leading-[15px] text-[#4d4d51]">ID {id}</span>
          <span className="size-1 shrink-0 rounded-full bg-[#86868b]" />
          <div className="flex min-w-0 items-center gap-1">
            <span className="truncate text-xs leading-[15px] text-[#4d4d51]">{amountLabel}</span>
            <span className="shrink-0 text-xs leading-[15px] text-[#4d4d51]">{amount}</span>
          </div>
        </div>
        <IconChevronRight size={24} className="text-[#6a6a70]" />
      </div>

      {/* Body */}
      <div className="flex w-full flex-col items-start justify-center gap-3">
        <h2 className="w-full truncate text-base font-medium leading-5 text-black">{title}</h2>

        <DetailRow icon={IconLocation} label={address} />
        <CompaniesRow companies={companies} />

        {requiresSignature && (
          <DetailRow icon={IconAlert} label="Requires Signature" color={mobile.red} />
        )}

        {followUp && <DetailRow icon={IconRepeat} label="Follow Up" color={mobile.blue500} />}
      </div>
    </article>
  )
}
