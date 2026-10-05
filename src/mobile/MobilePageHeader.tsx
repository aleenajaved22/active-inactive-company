import { IconChevronLeft } from './MobileIcons'
import { MobileStatusBar } from './MobileStatusBar'

type MobilePageHeaderProps = {
  title: string
  onBack?: () => void
}

/** Status bar + back row for a sub-page, 44 + 56. */
export function MobilePageHeader({ title, onBack }: MobilePageHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex flex-col items-start bg-white">
      <MobileStatusBar />
      <div className="flex h-14 w-full items-center gap-3 border-b-[0.5px] border-[#e6e6e7] px-4">
        <button type="button" aria-label="Back" onClick={onBack} className="-ml-1 text-black">
          <IconChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold leading-7 text-black">{title}</h1>
      </div>
    </header>
  )
}
