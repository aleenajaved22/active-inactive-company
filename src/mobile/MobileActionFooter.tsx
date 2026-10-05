import type { ReactNode } from 'react'

type MobileActionFooterProps = {
  label: string
  onClick?: () => void
  icon?: ReactNode
  disabled?: boolean
}

/** Sticky primary action over the home indicator — 343 x 48, Blue/500. */
export function MobileActionFooter({ label, onClick, icon, disabled }: MobileActionFooterProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 bg-white pt-4 shadow-[0px_-24px_32px_rgba(0,0,0,0.08)]">
      <div className="flex h-12 items-end justify-center px-4">
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-[#146dff] px-5 text-base font-medium leading-5 text-white disabled:opacity-50"
        >
          {icon}
          {label}
        </button>
      </div>
      <div className="relative h-[34px] w-full">
        <span className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  )
}

/** Height of the footer above, for scroll padding. */
export const MOBILE_ACTION_FOOTER_HEIGHT = 98
