import { useCallback, useEffect } from 'react'
import type { PropertyModal } from './prototype/screenLinks'
import { PrototypeScreenLinks } from './components/PrototypeScreenLinks'
import { propertyRows } from './data/properties'
import { usePrototypeScreen } from './hooks/usePrototypeScreen'
import { writePrototypeScreenToLocation } from './prototype/screenLinks'
import { LocationListingPage } from './pages/LocationListingPage'
import { PropertyDetailPage } from './pages/PropertyDetailPage'

function App() {
  const { screen, openListing, openProperty, setPropertyModal } = usePrototypeScreen()

  useEffect(() => {
    if (!window.location.hash) {
      writePrototypeScreenToLocation({ screen: 'listing' }, true)
    }
  }, [])

  const propertyIndex = screen.screen === 'property' ? screen.propertyIndex : null
  const propertyModal = screen.screen === 'property' ? screen.modal : undefined

  const onPropertyModalChange = useCallback(
    (modal?: PropertyModal) => {
      if (propertyIndex === null) return
      setPropertyModal(propertyIndex, modal)
    },
    [propertyIndex, setPropertyModal],
  )

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
