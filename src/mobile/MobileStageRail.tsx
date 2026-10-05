export type MobileStage = {
  label: string
  state: 'complete' | 'current' | 'upcoming'
}

const stageBackground: Record<MobileStage['state'], string> = {
  complete: '#5cb85c',
  current: '#1b71fe',
  upcoming: '#c4c4c4',
}

/**
 * Stage chevron geometry, taken from the exported shapes:
 *   first  — 156 x 36, rounded 8px left edge, body 0..140, point 140..156
 *   middle — 163 x 36, notch 0..16, body 16..147, point 147..163
 *   last   — mirrors the first: notch on the left, rounded 8px right edge
 * Each segment's point sits inside its own box, so the next segment overlaps it
 * by GAP and the leftover is the white chevron between them.
 */
const ARROW = 16
const GAP = 8
const RADIUS = 8

/** Label insets measured from the full segment width. */
const padding = {
  first: { left: 12, right: 22 },
  middle: { left: 29, right: 16 },
  last: { left: 25, right: 12 },
  only: { left: 12, right: 12 },
}

function clipFor(index: number, total: number) {
  const point = `calc(100% - ${ARROW}px) 0, 100% 50%, calc(100% - ${ARROW}px) 100%`
  const notch = `${ARROW}px 50%`
  if (total === 1) return undefined
  if (index === 0) return `polygon(0 0, ${point}, 0 100%)`
  if (index === total - 1) return `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${notch})`
  return `polygon(0 0, ${point}, 0 100%, ${notch})`
}

function radiusFor(index: number, total: number) {
  if (total === 1) return `${RADIUS}px`
  if (index === 0) return `${RADIUS}px 0 0 ${RADIUS}px`
  if (index === total - 1) return `0 ${RADIUS}px ${RADIUS}px 0`
  return undefined
}

/** Property stages as chevrons — horizontally scrollable on a phone. */
export function MobileStageRail({ stages }: { stages: MobileStage[] }) {
  const total = stages.length

  return (
    <div className="no-scrollbar flex h-9 items-start overflow-x-auto">
      {stages.map((stage, index) => {
        const inset =
          total === 1
            ? padding.only
            : index === 0
              ? padding.first
              : index === total - 1
                ? padding.last
                : padding.middle

        return (
          <div
            key={stage.label}
            className="flex h-9 shrink-0 items-center justify-center"
            style={{
              backgroundColor: stageBackground[stage.state],
              clipPath: clipFor(index, total),
              borderRadius: radiusFor(index, total),
              paddingLeft: inset.left,
              paddingRight: inset.right,
              marginLeft: index === 0 ? 0 : -GAP,
            }}
          >
            <span className="whitespace-nowrap text-center text-sm font-medium leading-5 text-white">
              {stage.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
