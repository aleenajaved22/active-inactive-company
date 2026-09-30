import { AppHeader } from '../components/AppHeader'
import { SidebarNavigation } from '../components/SidebarNavigation'
import { getPropertyCompany } from '../data/propertyCompanies'
import { formatPropertyTitle, type PropertyRow } from '../data/properties'

type CompanyDetailPageProps = {
  /** A company record, or a parent company known only by name. */
  companyId?: string
  parentName?: string
  property: PropertyRow
  onBackToProperty: () => void
  onBackToListing: () => void
}

/** Placeholder until the company detail page is designed. */
export function CompanyDetailPage({
  companyId,
  parentName,
  property,
  onBackToProperty,
  onBackToListing,
}: CompanyDetailPageProps) {
  const name = parentName ?? getPropertyCompany(companyId ?? '').name
  const description = parentName
    ? 'The parent company page is coming soon. It will show its details and the companies it owns.'
    : "The company detail page is coming soon. It will show this company's details, the property occupancies it holds and its deals."

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <SidebarNavigation />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppHeader
          propertyName={property.name}
          onNavigateProperties={onBackToListing}
          companyName={name}
          onNavigateProperty={onBackToProperty}
        />
        <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          {parentName && <p className="text-xs font-medium leading-[18px] text-[#86868b]">Parent Company</p>}
          <p className="text-xl font-bold leading-7 text-[#262527]">{name}</p>
          <p className="max-w-[360px] text-sm leading-5 text-[#6a6a70]">{description}</p>
          <button
            type="button"
            onClick={onBackToProperty}
            className="mt-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2 text-sm font-medium leading-5 text-[#444446] hover:bg-[#f5f5f6]"
          >
            Back to {formatPropertyTitle(property.name)}
          </button>
        </main>
      </div>
    </div>
  )
}
