import { useCallback, useEffect } from 'react'
import type { PropertyModal } from './prototype/screenLinks'
import { PrototypeScreenLinks } from './components/PrototypeScreenLinks'
import { propertyRows } from './data/properties'
import { usePrototypeScreen } from './hooks/usePrototypeScreen'
import { prototypeScreenToHash, writePrototypeScreenToLocation } from './prototype/screenLinks'
import { CompanyDetailPage } from './pages/CompanyDetailPage'
import { LocationListingPage } from './pages/LocationListingPage'
import { PropertyDetailPage } from './pages/PropertyDetailPage'

function App() {
  const { screen, openListing, openProperty, setPropertyModal } = usePrototypeScreen()

  useEffect(() => {
    if (!window.location.hash) {
      writePrototypeScreenToLocation({ screen: 'listing' }, true)
    }
  }, [])

  const propertyIndex = screen.screen === 'listing' ? null : screen.propertyIndex
  const propertyModal = screen.screen === 'property' ? screen.modal : undefined

  const onPropertyModalChange = useCallback(
    (modal?: PropertyModal) => {
      if (propertyIndex === null) return
      setPropertyModal(propertyIndex, modal)
    },
    [propertyIndex, setPropertyModal],
  )

  if (screen.screen === 'company' || screen.screen === 'parent-company') {
    const property = propertyRows[screen.propertyIndex]
    if (!property) {
      openListing()
      return null
    }
    return (
      <>
        <CompanyDetailPage
          companyId={screen.screen === 'company' ? screen.companyId : undefined}
          parentName={screen.screen === 'parent-company' ? screen.parentName : undefined}
          property={property}
          onBackToProperty={() => openProperty(screen.propertyIndex)}
          onBackToListing={openListing}
        />
        <PrototypeScreenLinks />
      </>
    )
  }

  if (screen.screen === 'property') {
    const property = propertyRows[screen.propertyIndex]
    if (!property) {
      openListing()
      return null
    }
    return (
      <>
        <PropertyDetailPage
          property={property}
          propertyModal={propertyModal}
          onBack={openListing}
          onPropertyModalChange={onPropertyModalChange}
          companyHref={(companyId) =>
            prototypeScreenToHash({ screen: 'company', propertyIndex: screen.propertyIndex, companyId })
          }
          parentCompanyHref={(parentName) =>
            prototypeScreenToHash({ screen: 'parent-company', propertyIndex: screen.propertyIndex, parentName })
          }
        />
        <PrototypeScreenLinks />
      </>
    )
  }

  return (
    <>
      <LocationListingPage onSelectProperty={(index) => openProperty(index)} />
      <PrototypeScreenLinks />
    </>
  )
}

export default App
