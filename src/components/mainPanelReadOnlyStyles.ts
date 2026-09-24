/** Grey 400 (#86868b) visual-only “disabled” look (Inactive / Pending). Controls stay interactive for dev. */
export const MAIN_PANEL_PRIMARY_BUTTON_BASE =
  'flex items-center gap-1 rounded-lg border px-3.5 text-sm font-medium leading-5'

/** Tint embedded PNG icons to grey 400 (outline read-only buttons). */
export const MAIN_PANEL_READONLY_ICON_CLASS = '[&_img]:brightness-0 [&_img]:opacity-[0.54]'

export type MainPanelPrimaryButtonReadOnlyVariant = 'filled' | 'outline'

export function mainPanelPrimaryButtonClass(
  readOnly: boolean,
  readOnlyVariant: MainPanelPrimaryButtonReadOnlyVariant = 'outline',
): string {
  if (!readOnly) {
    return `${MAIN_PANEL_PRIMARY_BUTTON_BASE} border-primary bg-primary text-white`
  }
  if (readOnlyVariant === 'filled') {
    return `${MAIN_PANEL_PRIMARY_BUTTON_BASE} border-[#86868b] bg-[#86868b] text-white`
  }
  return `${MAIN_PANEL_PRIMARY_BUTTON_BASE} border-[#86868b] bg-white text-[#86868b] ${MAIN_PANEL_READONLY_ICON_CLASS}`
}

export function mainPanelLinkClass(readOnly: boolean): string {
  return readOnly ? `text-[#86868b] ${MAIN_PANEL_READONLY_ICON_CLASS}` : 'text-[#146dff]'
}
