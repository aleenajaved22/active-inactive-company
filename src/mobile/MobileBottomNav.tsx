import type { ComponentType, SVGProps } from 'react'
import { IconDeal, IconHome, IconMapPin, IconRoute } from './MobileIcons'
import { mobile } from './mobileTokens'

export type MobileTab = 'home' | 'properties' | 'deals' | 'routes'

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

const tabs: { id: MobileTab; label: string; icon: IconComponent; iconSize: number }[] = [
  { id: 'home', label: 'Home', icon: IconHome, iconSize: 24 },
  { id: 'properties', label: 'Properties', icon: IconMapPin, iconSize: 20 },
  { id: 'deals', label: 'Deals', icon: IconDeal, iconSize: 24 },
  { id: 'routes', label: 'Routes', icon: IconRoute, iconSize: 24 },
]

type MobileBottomNavProps = {
  active?: MobileTab
  onSelect?: (tab: MobileTab) => void
}

/** Bottom Nav + home indicator — 375 x 80 */
export function MobileBottomNav({ active = 'properties', onSelect }: MobileBottomNavProps) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 flex h-20 flex-col items-start border-t-[0.5px] border-[#e6e6e7] bg-white shadow-[0px_-24px_32px_rgba(0,0,0,0.08)]">
      <div className="flex h-[46px] w-full items-end justify-center">
        <div className="flex h-[38px] w-full items-center">
          {tabs.map(({ id, label, icon: Icon, iconSize }) => {
            const isActive = id === active
            const color = isActive ? mobile.blue : mobile.grey400
            return (
              <button
                key={id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelect?.(id)}
                className="flex h-[38px] flex-1 flex-col items-center justify-between"
                style={{ color }}
              >
                <Icon size={iconSize} />
                <span className="text-center text-xs font-medium leading-[14px]">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative h-[34px] w-full bg-white">
        <span className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </nav>
  )
}
