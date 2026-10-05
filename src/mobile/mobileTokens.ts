/**
 * Design tokens for the mobile app, taken from the mobile Figma file.
 * Kept in one place so every mobile screen stays on the same language.
 */
export const mobile = {
  /** Basic/Blue — primary action + active tab */
  blue: '#004fe3',
  /** Blue/500 — inline links, follow-up state */
  blue500: '#146dff',
  /** Alert red — reused from the web app palette */
  red: '#e43f32',
  black: '#000000',
  white: '#ffffff',
  /** Cool Grey/700 — body copy */
  grey700: '#4d4d51',
  /** Cool Grey/500 — icons */
  grey500: '#6a6a70',
  /** Cool Grey/400 — placeholders, inactive tabs */
  grey400: '#86868b',
  /** Cool Grey/100 (P) — hairlines */
  grey100: '#e6e6e7',
  /** Light Grey — search field, filter chips */
  lightGrey: '#f6f6f8',
} as const

/** iPhone X frame used across every mobile screen. */
export const MOBILE_FRAME = {
  width: 375,
  height: 812,
  /** Status bar + title + search + filters */
  topNavHeight: 210,
  /** Bottom nav + home indicator */
  bottomNavHeight: 80,
} as const

/**
 * Filter chips on the property listing. The first four follow the mobile design;
 * the rest map to columns and fields the web listing already filters on.
 */
export const propertyFilters = [
  'Stage',
  'Sites',
  'Affiliation',
  'Location',
  'Industry Vertical',
  'Parent Company',
  'Deals Count',
]
