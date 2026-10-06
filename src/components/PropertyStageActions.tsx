import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ActionMenuIcon, type ActionMenuIconName } from './ActionMenuIcon'

type StageAction = { label: string; icon: ActionMenuIconName; disabled?: boolean; onSelect: () => void }

/** "Action ⌄" with the stage actions under it, portalled so the scrolling column cannot clip it. */
function StageActionMenu({ items }: { items: StageAction[] }) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null)
  const open = position !== null

  const openMenu = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) setPosition({ top: rect.bottom + 6, right: window.innerWidth - rect.right })
  }
  const close = () => setPosition(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return
      close()
    }
    const closeOnKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnKey)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      document.removeEventListener('keydown', closeOnKey)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? close() : openMenu())}
        className="flex items-center gap-1 text-sm font-semibold leading-5 text-[#262527]"
      >
        Action
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M4 6L8 10L12 6" />
        </svg>
      </button>
      {position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ position: 'fixed', top: position.top, right: position.right, zIndex: 70 }}
            className="min-w-[200px] rounded-xl border border-[#e6e6e7] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  close()
                  item.onSelect()
                }}
                className="flex w-full items-center gap-2.5 whitespace-nowrap px-4 py-2.5 text-left text-sm font-medium leading-5 text-primary hover:bg-[#f5f5f6] disabled:cursor-not-allowed disabled:text-[#b5b5ba] disabled:hover:bg-transparent"
              >
                <ActionMenuIcon icon={item.icon} size={18} />
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}

/**
 * The property column's toolbar: Back to the property list on the left, Action on
 * the right. Action moves the property to its next stage, or edits it.
 */
export function PropertyStageActions({
  nextStageLabel,
  onBack,
  onNext,
  onEdit,
}: {
  /** The stage the property moves to; none once it has reached the last. */
  nextStageLabel?: string
  onBack: () => void
  onNext: () => void
  onEdit: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-0.5 text-sm font-semibold leading-5 text-[#6a6a70] hover:text-[#262527]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M10 4L6 8L10 12" />
        </svg>
        Back
      </button>
      <StageActionMenu
        items={[
          ...(nextStageLabel
            ? [{ label: `Mark as ${nextStageLabel}`, icon: 'activate' as const, onSelect: onNext }]
            : []),
          { label: 'Edit', icon: 'edit' as const, onSelect: onEdit },
        ]}
      />
    </div>
  )
}
