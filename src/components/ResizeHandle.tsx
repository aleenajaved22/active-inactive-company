import { useRef, type PointerEvent as ReactPointerEvent } from 'react'

type ResizeHandleProps = {
  ariaLabel: string
  /** Called with the horizontal pointer delta (px) from where the drag began. */
  onResize: (deltaX: number) => void
  onResizeStart?: () => void
  onResizeEnd?: () => void
}

/** Thin draggable strip sitting on a panel's edge; widens the panel it belongs to. */
export function ResizeHandle({ ariaLabel, onResize, onResizeStart, onResizeEnd }: ResizeHandleProps) {
  const startX = useRef(0)

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    startX.current = event.clientX
    onResizeStart?.()
    const handleMove = (moveEvent: PointerEvent) => onResize(moveEvent.clientX - startX.current)
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      onResizeEnd?.()
    }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  return (
    <div className="relative z-10 w-0 shrink-0">
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={ariaLabel}
        onPointerDown={onPointerDown}
        className="group absolute inset-y-0 left-0 flex w-3 -translate-x-1/2 cursor-col-resize items-stretch justify-center"
      >
        <span className="w-0.5 bg-transparent transition-colors group-hover:bg-primary" />
      </div>
    </div>
  )
}
