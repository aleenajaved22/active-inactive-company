import logo from '../assets/logo.svg'
import navChecklist from '../assets/nav-checklist.svg'
import navCollapse from '../assets/nav-collapse.svg'
import navCompany from '../assets/nav-company.svg'
import navContact from '../assets/nav-contact.svg'
import navDashboard from '../assets/nav-dashboard.svg'
import navDeal from '../assets/nav-deal.svg'
import navMapPin from '../assets/nav-map-pin.svg'
import navScouting from '../assets/nav-scouting.svg'
import navSettings from '../assets/nav-settings.svg'
import navSignalMap from '../assets/nav-signal-map.svg'
import navTrello from '../assets/nav-trello.svg'

const navItems = [
  { icon: navDashboard, label: 'Dashboard', active: false },
  { icon: navCompany, label: 'Companies', active: false },
  { icon: navMapPin, label: 'Properties', active: true },
  { icon: navDeal, label: 'Deals', active: false },
  { icon: navContact, label: 'Contacts', active: false },
  { icon: navSignalMap, label: 'Signal map', active: false },
  { icon: navSignalMap, label: 'Map', active: false },
  { icon: navChecklist, label: 'Tasks', active: false },
  { icon: navTrello, label: 'Board', active: false },
  { icon: navScouting, label: 'Scouting', active: false },
  { icon: navSettings, label: 'Settings', active: false },
]

export function SidebarNavigation() {
  return (
    <aside className="relative flex h-full w-[76px] shrink-0 self-stretch bg-[#262527] px-2 py-4">
      <div className="flex w-full flex-col items-center gap-4">
        <div className="relative h-[54px] w-[72px] shrink-0">
          <img alt="Sales Web" className="absolute inset-0 block size-full max-w-none" src={logo} />
        </div>
        <nav className="flex flex-col items-center">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              aria-current={item.active ? 'page' : undefined}
              className={`flex items-center justify-center rounded-lg p-3 ${
                item.active ? 'bg-[#146dff]' : 'bg-[#262527] hover:bg-[#333335]'
              }`}
            >
              <span className="relative size-5 shrink-0">
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={item.icon} />
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="absolute left-[62px] top-[436px] flex size-7 items-center justify-center">
        <button type="button" aria-label="Expand navigation" className="relative size-7 rotate-180">
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={navCollapse} />
        </button>
      </div>
    </aside>
  )
}
