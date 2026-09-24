import { AppHeader } from '../components/AppHeader'
import { LocationGraphs } from '../components/LocationGraphs'
import { PropertiesDataSection } from '../components/PropertiesDataSection'
import { SidebarNavigation } from '../components/SidebarNavigation'

type LocationListingPageProps = {
  onSelectProperty: (index: number) => void
}

export function LocationListingPage({ onSelectProperty }: LocationListingPageProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <SidebarNavigation />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto pl-0">
          <LocationGraphs />
          <PropertiesDataSection onSelectProperty={onSelectProperty} />
        </main>
      </div>
    </div>
  )
}
