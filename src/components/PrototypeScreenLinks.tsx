import { useEffect, useState } from 'react'
import {
  prototypeScreenCatalog,
  prototypeScreenToHash,
  readPrototypeScreenFromLocation,
  type PrototypeScreen,
} from '../prototype/screenLinks'

function isSameScreen(a: PrototypeScreen, b: PrototypeScreen): boolean {
  return prototypeScreenToHash(a) === prototypeScreenToHash(b)
}

export function PrototypeScreenLinks() {
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState<PrototypeScreen>(() => readPrototypeScreenFromLocation())

  useEffect(() => {
    const sync = () => setActive(readPrototypeScreenFromLocation())
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  return (
    <nav
      aria-label="Prototype screens"
      className="fixed bottom-4 left-4 z-[100] max-w-[min(100vw-2rem,320px)] rounded-xl border border-[#e6e6e7] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.12)]"
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-[#262527] hover:bg-[#f5f5f6]"
        aria-expanded={expanded}
      >
        Screens
        <span className="text-xs font-normal text-[#86868b]">{expanded ? 'Hide' : 'Show'}</span>
      </button>
      {expanded && (
        <ul className="border-t border-[#e6e6e7] py-1">
          {prototypeScreenCatalog.map(({ label, screen }) => {
            const hash = prototypeScreenToHash(screen)
            const current = isSameScreen(active, screen)
            return (
              <li key={hash}>
                <a
                  href={hash}
                  className={`block px-3 py-2 text-sm leading-5 hover:bg-[#f5f5f6] ${
                    current ? 'bg-primary-subtle font-medium text-primary' : 'text-[#444446]'
                  }`}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}
