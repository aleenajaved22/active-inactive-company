export type PropertyModal = 'switch-company' | 'create-company'

export type PrototypeScreen =
  | { screen: 'listing' }
  | { screen: 'mobile-listing' }
  | { screen: 'mobile-create-property' }
  | { screen: 'mobile-request-sent' }
  | { screen: 'mobile-property'; propertyIndex: number }
  | { screen: 'fo-email'; tenant: 'Signal' | 'Filtergo' }
  | { screen: 'property'; propertyIndex: number; modal?: PropertyModal }
  | { screen: 'company'; propertyIndex: number; companyId: string }
  | { screen: 'parent-company'; propertyIndex: number; parentName: string }

export const prototypeScreenCatalog: { label: string; screen: PrototypeScreen }[] = [
  { label: 'Property listing', screen: { screen: 'listing' } },
  { label: 'Property detail', screen: { screen: 'property', propertyIndex: 0 } },
  { label: 'Switch company', screen: { screen: 'property', propertyIndex: 0, modal: 'switch-company' } },
  { label: 'Create company', screen: { screen: 'property', propertyIndex: 0, modal: 'create-company' } },
  { label: 'Mobile — Property listing', screen: { screen: 'mobile-listing' } },
  { label: 'Mobile — Create property', screen: { screen: 'mobile-create-property' } },
  { label: 'Mobile — Request sent', screen: { screen: 'mobile-request-sent' } },
  { label: 'Mobile — Property detail', screen: { screen: 'mobile-property', propertyIndex: 0 } },
  { label: 'FO email — Filtergo', screen: { screen: 'fo-email', tenant: 'Filtergo' } },
  { label: 'FO email — Signal', screen: { screen: 'fo-email', tenant: 'Signal' } },
]

export function prototypeScreenToHash(screen: PrototypeScreen): string {
  if (screen.screen === 'listing') return '#/listing'
  if (screen.screen === 'mobile-listing') return '#/mobile/listing'
  if (screen.screen === 'mobile-create-property') return '#/mobile/create-property'
  if (screen.screen === 'mobile-request-sent') return '#/mobile/request-sent'
  if (screen.screen === 'mobile-property') return `#/mobile/property/${screen.propertyIndex}`
  if (screen.screen === 'fo-email') {
    return screen.tenant === 'Signal' ? '#/email/franchise-owner/signal' : '#/email/franchise-owner'
  }
  if (screen.screen === 'company') return `#/property/${screen.propertyIndex}/company/${screen.companyId}`
  if (screen.screen === 'parent-company') {
    return `#/property/${screen.propertyIndex}/parent/${encodeURIComponent(screen.parentName)}`
  }
  const base = `#/property/${screen.propertyIndex}`
  if (!screen.modal) return base
  return `${base}/${screen.modal}`
}

export function parsePrototypeHash(rawHash: string): PrototypeScreen {
  const hash = rawHash.replace(/^#\/?/, '').trim()
  if (!hash || hash === 'listing') {
    return { screen: 'listing' }
  }

  if (hash === 'mobile' || hash === 'mobile/listing') {
    return { screen: 'mobile-listing' }
  }

  if (hash === 'mobile/create-property') {
    return { screen: 'mobile-create-property' }
  }

  if (hash === 'mobile/request-sent') {
    return { screen: 'mobile-request-sent' }
  }

  if (hash === 'email/franchise-owner') {
    return { screen: 'fo-email', tenant: 'Filtergo' }
  }

  if (hash === 'email/franchise-owner/signal') {
    return { screen: 'fo-email', tenant: 'Signal' }
  }

  const mobilePropertyMatch = /^mobile\/property\/(\d+)\/?$/.exec(hash)
  if (mobilePropertyMatch) {
    const index = Number(mobilePropertyMatch[1])
    if (!Number.isNaN(index)) return { screen: 'mobile-property', propertyIndex: index }
  }

  const companyMatch = /^property\/(\d+)\/company\/([\w-]+)\/?$/.exec(hash)
  if (companyMatch) {
    return { screen: 'company', propertyIndex: Number(companyMatch[1]), companyId: companyMatch[2] }
  }

  const parentMatch = /^property\/(\d+)\/parent\/([^/]+)\/?$/.exec(hash)
  if (parentMatch) {
    return {
      screen: 'parent-company',
      propertyIndex: Number(parentMatch[1]),
      parentName: decodeURIComponent(parentMatch[2]),
    }
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
