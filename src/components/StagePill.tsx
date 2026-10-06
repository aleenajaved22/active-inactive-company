export type StagePillStage = { label: string; reached: boolean }

type StagePillSize = 'sm' | 'md'

const dimensions: Record<StagePillSize, { height: number; arrow: number; font: string; edge: number }> = {
  sm: { height: 28, arrow: 8, font: 'text-[11px] leading-4', edge: 8 },
  md: { height: 32, arrow: 10, font: 'text-xs leading-[18px]', edge: 12 },
}

/** Width of the thin gap left between one segment's point and the next one's notch. */
const SEAM = 3

/**
 * Property stages as a single rounded pill cut into chevrons. Stages the property
 * has reached are green with white labels; the ones still ahead are grey. The
 * segments size to their labels and share any spare width, so the pill always
 * fills its row.
 */
export function StagePill({
  stages,
  size = 'md',
  onSelect,
}: {
  stages: StagePillStage[]
  size?: StagePillSize
  /** Makes each stage pickable, for editing which stage the property is at. */
  onSelect?: (index: number) => void
}) {
  const { height, arrow, font, edge } = dimensions[size]
  const radius = height / 2
  const total = stages.length

  const clip = (index: number) => {
    const point = `calc(100% - ${arrow}px) 0, 100% 50%, calc(100% - ${arrow}px) 100%`
    const notch = `${arrow}px 50%`
    if (total === 1) return undefined
    if (index === 0) return `polygon(0 0, ${point}, 0 100%)`
    if (index === total - 1) return `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${notch})`
    return `polygon(0 0, ${point}, 0 100%, ${notch})`
  }

  const corners = (index: number) => {
    if (total === 1) return `${radius}px`
    if (index === 0) return `${radius}px 0 0 ${radius}px`
    if (index === total - 1) return `0 ${radius}px ${radius}px 0`
    return undefined
  }

  return (
    <ol className="flex w-full overflow-hidden" style={{ height }} aria-label="Property stages">
      {stages.map((stage, index) => {
        const first = index === 0
        const last = index === total - 1
        return (
          <li
            key={stage.label}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
            onClick={onSelect ? () => onSelect(index) : undefined}
            onKeyDown={
              onSelect
                ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect(index)
                    }
                  }
                : undefined
            }
            aria-current={stage.reached && !stages[index + 1]?.reached ? 'step' : undefined}
            className={`flex min-w-0 flex-auto items-center justify-center whitespace-nowrap font-semibold ${font} ${
              onSelect ? 'cursor-pointer hover:brightness-95' : ''
            } ${
              stage.reached ? 'bg-[#4c9f5b] text-white' : 'bg-[#e9eaef] text-[#6a6a70]'
            }`}
            style={{
              height,
              clipPath: clip(index),
              borderRadius: corners(index),
              marginLeft: first ? 0 : -(arrow - SEAM),
              paddingLeft: first ? edge : arrow + edge - 4,
              paddingRight: last ? edge : arrow + 2,
            }}
          >
            <span className="truncate">{stage.label}</span>
          </li>
        )
      })}
    </ol>
  )
}
