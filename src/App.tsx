import { useCallback, useEffect } from 'react'
import type { PropertyModal } from './prototype/screenLinks'
import { PrototypeScreenLinks } from './components/PrototypeScreenLinks'
import { propertyRows } from './data/properties'
import { usePrototypeScreen } from './hooks/usePrototypeScreen'
import { prototypeScreenToHash, writePrototypeScreenToLocation } from './prototype/screenLinks'
import { CompanyDetailPage } from './pages/CompanyDetailPage'
import { LocationListingPage } from './pages/LocationListingPage'
import { MobileCreatePropertyPage } from './pages/MobileCreatePropertyPage'
import { MobilePropertyDetailPage } from './pages/MobilePropertyDetailPage'
import { MobilePropertyListingPage } from './pages/MobilePropertyListingPage'
import { MobilePropertyRequestSentPage } from './pages/MobilePropertyRequestSentPage'
import { FranchiseOwnerEmailPage } from './pages/FranchiseOwnerEmailPage'
import { PropertyDetailPage } from './pages/PropertyDetailPage'

function App() {
  const { screen, navigate, openListing, openProperty, setPropertyModal } = usePrototypeScreen()

  useEffect(() => {
    if (!window.location.hash) {
      writePrototypeScreenToLocation({ screen: 'listing' }, true)
    }
  }, [])

  const propertyIndex =
    screen.screen === 'property' || screen.screen === 'company' || screen.screen === 'parent-company'
      ? screen.propertyIndex
      : null
  const propertyModal = screen.screen === 'property' ? screen.modal : undefined

  const onPropertyModalChange = useCallback(
    (modal?: PropertyModal) => {
      if (propertyIndex === null) return
      setPropertyModal(propertyIndex, modal)
    },
    [propertyIndex, setPropertyModal],
  )

  if (screen.screen === 'fo-email') {
    return (
      <>
        <FranchiseOwnerEmailPage />
        <PrototypeScreenLinks />
      </>
    )
  }

  if (screen.screen === 'mobile-listing') {
    return (
      <>
        <MobilePropertyListingPage
          onSelectProperty={(index) => navigate({ screen: 'mobile-property', propertyIndex: index })}
          onCreateProperty={() => navigate({ screen: 'mobile-create-property' })}
        />
        <PrototypeScreenLinks />
      </>
    )
  }

  if (screen.screen === 'mobile-property') {
    const property = propertyRows[screen.propertyIndex]
    if (!property) {
      navigate({ screen: 'mobile-listing' }, true)
      return null
    }
    return (
      <>
        <MobilePropertyDetailPage
          property={property}
          onBack={() => navigate({ screen: 'mobile-listing' })}
        />
        <PrototypeScreenLinks />
      </>
    )
  }

  if (screen.screen === 'mobile-create-property') {
    return (
      <>
        <MobileCreatePropertyPage
          onBack={() => navigate({ screen: 'mobile-listing' })}
          onSubmit={() => navigate({ screen: 'mobile-request-sent' })}
        />
        <PrototypeScreenLinks />
      </>
    )
  }

  if (screen.screen === 'mobile-request-sent') {
    return (
      <>
        <MobilePropertyRequestSentPage
          onBackToProperties={() => navigate({ screen: 'mobile-listing' })}
        />
        <PrototypeScreenLinks />
      </>
    )
  }

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
