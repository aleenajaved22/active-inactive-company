import { mobilePropertyRows } from '../data/mobileProperties'
import { MobileBottomNav } from '../mobile/MobileBottomNav'
import { MobileFrame } from '../mobile/MobileFrame'
import { MobilePropertyCard } from '../mobile/MobilePropertyCard'
import { MobileTopNav } from '../mobile/MobileTopNav'
import { MOBILE_FRAME } from '../mobile/mobileTokens'

type MobilePropertyListingPageProps = {
  onSelectProperty?: (index: number) => void
  onCreateProperty?: () => void
}

export function MobilePropertyListingPage({
  onSelectProperty,
  onCreateProperty,
}: MobilePropertyListingPageProps) {
  return (
    <MobileFrame caption="Mobile — Property listing">
      <div className="relative size-full overflow-hidden bg-[#f6f6f8]">
        <div
          className="no-scrollbar absolute inset-0 overflow-y-auto"
          style={{
            paddingTop: MOBILE_FRAME.topNavHeight + 16,
            paddingBottom: MOBILE_FRAME.bottomNavHeight + 16,
          }}
        >
          <div className="flex flex-col gap-3 px-4">
            {mobilePropertyRows.map((row) => (
              <MobilePropertyCard
                key={`${row.id}-${row.index}`}
                id={row.id}
                amount={row.amount}
                title={row.title}
                address={row.address}
                companies={row.companies}
                requiresSignature={row.requiresSignature}
                followUp={row.followUp}
                onOpen={() => onSelectProperty?.(row.index)}
              />
            ))}
          </div>
        </div>

        <MobileTopNav title="Properties" onAdd={onCreateProperty} />
        <MobileBottomNav active="properties" />
      </div>
    </MobileFrame>
  )
}
