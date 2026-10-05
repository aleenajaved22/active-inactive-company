import type { ReactNode } from 'react'

/** Rich Icon — 32px Basic/Blue disc with a white "i". */
function InfoDisc() {
  return (
    <span className="relative block size-8 shrink-0">
      <span className="absolute inset-0.5 rounded-full bg-[#004fe3]" />
      <span className="absolute left-1/2 top-[9px] size-1 -translate-x-1/2 rounded-full bg-white" />
      <span className="absolute left-1/2 top-[15px] h-2.5 w-[5px] -translate-x-1/2 bg-white" />
    </span>
  )
}

/** Light Blue note block — 343 x 102, 24px padding. */
export function MobileInfoNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#eff4fd] p-6">
      <InfoDisc />
      <p className="min-w-0 flex-1 text-sm leading-[18px] text-[#3c3c3d]">{children}</p>
    </div>
  )
}
