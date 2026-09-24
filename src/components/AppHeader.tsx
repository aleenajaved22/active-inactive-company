import avatarJeff from '../assets/avatar-jeff.png'
import headerBell from '../assets/header-bell.svg'
import headerChevronDown from '../assets/header-chevron-down.svg'
import headerChevronDownSm from '../assets/header-chevron-down-sm.svg'
import headerMapPin from '../assets/header-map-pin.svg'
import { formatPropertyTitle } from '../data/properties'

type AppHeaderProps = {
  propertyName?: string
  onNavigateProperties?: () => void
}

export function AppHeader({ propertyName, onNavigateProperties }: AppHeaderProps) {
  const breadcrumbTitle = propertyName ? formatPropertyTitle(propertyName) : null

  return (
    <header className="flex h-[50px] shrink-0 items-center gap-8 border-b border-[#e6e6e7] bg-white px-8 py-[9px]">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded p-2.5">
            <span className="relative size-5 shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={headerMapPin} />
            </span>
          </span>
          {breadcrumbTitle ? (
            <div className="flex min-w-0 items-center gap-2 text-sm leading-5">
              <button
                type="button"
                onClick={onNavigateProperties}
                className="shrink-0 font-bold text-[#262527] hover:text-[#146dff]"
              >
                Properties
              </button>
              <span className="shrink-0 text-[#86868b]">//</span>
              <span className="truncate font-normal text-[#86868b]">{breadcrumbTitle}</span>
            </div>
          ) : (
            <p className="text-sm font-bold leading-5 text-[#262527]">Properties</p>
          )}
        </div>
      </div>
      <button
        type="button"
        className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2"
      >
        <span className="text-sm font-medium leading-5 text-[#444446]">United States</span>
        <span className="relative size-5 shrink-0">
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={headerChevronDown} />
        </span>
      </button>
      <div className="flex shrink-0 items-center gap-4">
        <button type="button" aria-label="Notifications" className="relative size-5 shrink-0">
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={headerBell} />
        </button>
        <button type="button" className="flex items-center gap-2">
          <img alt="Jeff Zolos" className="size-8 shrink-0 rounded-full" height={32} src={avatarJeff} width={32} />
          <span className="text-left">
            <span className="block text-sm font-medium leading-5 text-[#444446]">Jeff Zolos</span>
            <span className="block text-xs leading-[18px] text-[#86868b]">BD Executive</span>
          </span>
          <span className="relative size-3.5 shrink-0 pt-1">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={headerChevronDownSm} />
          </span>
        </button>
      </div>
    </header>
  )
}
