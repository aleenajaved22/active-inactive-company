import { MobileActionFooter } from '../mobile/MobileActionFooter'
import { MobileFrame } from '../mobile/MobileFrame'
import { IconArrowLeft } from '../mobile/MobileIcons'
import { MobileInfoNote } from '../mobile/MobileInfoNote'
import { MobileStatusBar } from '../mobile/MobileStatusBar'

/** Group 604 — 140px ring with a check, Green #3BCD54. */
function SuccessMark() {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none" aria-hidden="true">
      <circle cx="70" cy="70" r="65" stroke="#3BCD54" strokeWidth="10" />
      <path
        d="M45 73.5 61.5 89.5 95.5 52"
        stroke="#3BCD54"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type MobilePropertyRequestSentPageProps = {
  onBackToProperties?: () => void
}

/** Confirmation after Send Request — mobile only, no web counterpart. */
export function MobilePropertyRequestSentPage({
  onBackToProperties,
}: MobilePropertyRequestSentPageProps) {
  return (
    <MobileFrame caption="Mobile — Property request sent">
      <div className="relative size-full overflow-hidden bg-white">
        <MobileStatusBar />

        {/* Frame 241 — 373 wide, 24px gutters, pinned at 167.5 from the top */}
        <div
          className="absolute left-1/2 flex w-[373px] -translate-x-1/2 flex-col items-center gap-2 px-6"
          style={{ top: 167.5 }}
        >
          <div className="flex flex-col items-center gap-4">
            <SuccessMark />
            <h1 className="text-center text-2xl font-bold leading-[29px] tracking-[0.35px] text-black">
              Property Request Sent!
            </h1>
          </div>
          <p className="text-center text-base leading-5 tracking-[-0.24px] text-[#5b5b5f]">
            The location you created has been recorded.
          </p>
        </div>

        <div className="absolute left-4 w-[343px]" style={{ top: 612 }}>
          <MobileInfoNote>
            Note: Please be noted that the admin needs to approve this request before it shows in
            your assigned properies.
          </MobileInfoNote>
        </div>

        <MobileActionFooter
          label="Back to Properties"
          icon={<IconArrowLeft size={20} />}
          onClick={onBackToProperties}
        />
      </div>
    </MobileFrame>
  )
}
