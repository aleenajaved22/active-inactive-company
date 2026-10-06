import type { ReactNode } from 'react'

export type ActionMenuIconName = 'switch' | 'edit' | 'activate' | 'remove'

const iconPaths: Record<ActionMenuIconName, ReactNode> = {
  // Two arrows chasing each other: swap the company on a space.
  switch: (
    <>
      <path d="M2 6.5H12.5L10 4" />
      <path d="M14 9.5H3.5L6 12" />
    </>
  ),
  edit: <path d="M11.3333 2L14 4.66667L5 13.6667L1.66667 14.3333L2.33333 11L11.3333 2Z" />,
  activate: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M5.5 8.25L7.25 10L10.5 6.5" />
    </>
  ),
  // A person with a minus: take someone off this property.
  remove: (
    <>
      <circle cx="6" cy="5" r="2.5" />
      <path d="M1.5 13.5C1.5 11 3.5 9.5 6 9.5C8.5 9.5 10.5 11 10.5 13.5" />
      <path d="M11.5 6H14.5" />
    </>
  ),
}

/** The glyph beside an action in the web ⋮ menu and the mobile action drawer. */
export function ActionMenuIcon({ icon, size = 16, className = '' }: { icon: ActionMenuIconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.33"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {iconPaths[icon]}
    </svg>
  )
}
