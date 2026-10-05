import type { ReactNode } from 'react'
import { MOBILE_FRAME } from './mobileTokens'

type MobileFrameProps = {
  children: ReactNode
  /** Label shown under the device on the prototype canvas. */
  caption?: string
}

/** iPhone X canvas — 375 x 812, matching the mobile Figma frame. */
export function MobileFrame({ children, caption }: MobileFrameProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-[#e9e9ed] p-8">
      <div
        className="relative shrink-0 overflow-hidden bg-[#f6f6f8] shadow-[0_24px_64px_rgba(16,24,40,0.22)]"
        style={{ width: MOBILE_FRAME.width, height: MOBILE_FRAME.height }}
      >
        {children}
      </div>
      {caption && <p className="text-sm leading-5 text-[#6a6a70]">{caption}</p>}
    </div>
  )
}
