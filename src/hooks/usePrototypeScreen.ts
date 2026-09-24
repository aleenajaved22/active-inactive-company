import { useCallback, useEffect, useState } from 'react'
import {
  prototypeScreenToHash,
  readPrototypeScreenFromLocation,
  writePrototypeScreenToLocation,
  type PropertyModal,
  type PrototypeScreen,
} from '../prototype/screenLinks'

export function usePrototypeScreen() {
  const [screen, setScreen] = useState<PrototypeScreen>(() => readPrototypeScreenFromLocation())

  useEffect(() => {
    const syncFromHash = () => setScreen(readPrototypeScreenFromLocation())
    window.addEventListener('hashchange', syncFromHash)
    window.addEventListener('popstate', syncFromHash)
    syncFromHash()
    return () => {
      window.removeEventListener('hashchange', syncFromHash)
      window.removeEventListener('popstate', syncFromHash)
    }
  }, [])

  const navigate = useCallback((next: PrototypeScreen, replace = false) => {
    const nextHash = prototypeScreenToHash(next)
    if (window.location.hash === nextHash) {
      setScreen(next)
      return
    }
    if (replace) {
      writePrototypeScreenToLocation(next, true)
      setScreen(next)
      return
    }
    window.location.hash = nextHash
  }, [])

  const openListing = useCallback(() => navigate({ screen: 'listing' }), [navigate])

  const openProperty = useCallback(
    (propertyIndex: number, modal?: PropertyModal) => {
      navigate({ screen: 'property', propertyIndex, modal })
    },
    [navigate],
  )

  const setPropertyModal = useCallback(
    (propertyIndex: number, modal?: PropertyModal) => {
      navigate({ screen: 'property', propertyIndex, modal }, true)
    },
    [navigate],
  )

  return {
    screen,
    navigate,
    openListing,
    openProperty,
    setPropertyModal,
  }
}
