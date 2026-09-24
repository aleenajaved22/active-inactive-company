export type PropertyModal = 'switch-company' | 'create-company'

export type PrototypeScreen =
  | { screen: 'listing' }
  | { screen: 'property'; propertyIndex: number; modal?: PropertyModal }

export const prototypeScreenCatalog: { label: string; screen: PrototypeScreen }[] = [
  { label: 'Location listing', screen: { screen: 'listing' } },
  { label: 'Property detail', screen: { screen: 'property', propertyIndex: 0 } },
  { label: 'Switch company', screen: { screen: 'property', propertyIndex: 0, modal: 'switch-company' } },
  { label: 'Create company', screen: { screen: 'property', propertyIndex: 0, modal: 'create-company' } },
]

export function prototypeScreenToHash(screen: PrototypeScreen): string {
  if (screen.screen === 'listing') return '#/listing'
  const base = `#/property/${screen.propertyIndex}`
  if (!screen.modal) return base
  return `${base}/${screen.modal}`
}

export function parsePrototypeHash(rawHash: string): PrototypeScreen {
  const hash = rawHash.replace(/^#\/?/, '').trim()
  if (!hash || hash === 'listing') {
    return { screen: 'listing' }
  }

  const match = /^property\/(\d+)(?:\/(switch-company|create-company))?\/?$/.exec(hash)
  if (!match) {
    return { screen: 'listing' }
  }

  const propertyIndex = Number(match[1])
  const modal = match[2] as PropertyModal | undefined
  if (Number.isNaN(propertyIndex)) {
    return { screen: 'listing' }
  }

  return modal
    ? { screen: 'property', propertyIndex, modal }
    : { screen: 'property', propertyIndex }
}

export function readPrototypeScreenFromLocation(): PrototypeScreen {
  return parsePrototypeHash(window.location.hash)
}

export function writePrototypeScreenToLocation(screen: PrototypeScreen, replace = false) {
  const nextHash = prototypeScreenToHash(screen)
  if (window.location.hash === nextHash) return
  const url = `${window.location.pathname}${window.location.search}${nextHash}`
  if (replace) {
    window.history.replaceState(null, '', url)
  } else {
    window.history.pushState(null, '', url)
  }
}
