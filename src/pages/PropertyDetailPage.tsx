import { useState } from 'react'
import detailChevronSm from '../assets/detail-chevron-sm.svg'
import detailDividerH from '../assets/detail-divider-h.svg'
import detailEdit from '../assets/detail-edit.svg'
import detailPlus from '../assets/detail-plus.svg'
import detailPropertyPhoto from '../assets/detail-property-photo.png'
import detailStageApproved from '../assets/detail-stage-approved.svg'
import detailStageApprovedReadonly from '../assets/detail-stage-approved-readonly.svg'
import detailStageDefault from '../assets/detail-stage-default.svg'
import detailStageLast from '../assets/detail-stage-last.svg'
import { AppHeader } from '../components/AppHeader'
import { CompaniesPanelToggle } from '../components/CompaniesPanelToggle'
import { CompanyListingPanel } from '../components/CompanyListingPanel'
import { EditDealDrawer } from '../components/EditDealDrawer'
import { PropertyDetailSideSections } from '../components/PropertyDetailSideSections'
import { PropertyDetailCompanyHeader } from '../components/PropertyDetailCompanyHeader'
import { mainPanelLinkClass } from '../components/mainPanelReadOnlyStyles'
import { PropertyLeadActivities } from '../components/PropertyLeadActivities'
import { SidebarNavigation } from '../components/SidebarNavigation'
import { getPropertyCompany } from '../data/propertyCompanies'
import { initialSpaceAssociations, spaceLabelOf, type SpaceAssociation } from '../data/propertySpaceAssociations'
import { affiliationsToBadges } from '../components/switchCompanyTypes'
import type { PropertyModal } from '../prototype/screenLinks'
import { formatPropertyTitle, type PropertyRow } from '../data/properties'

const stageSteps = ['Discovery', 'Qualified', 'Needs Assessment']

type PropertyDetailPageProps = {
  property: PropertyRow
  propertyModal?: PropertyModal
  onBack: () => void
  onPropertyModalChange?: (modal?: PropertyModal) => void
  companyHref?: (companyId: string) => string
  parentCompanyHref?: (parentName: string) => string
}

export function PropertyDetailPage({
  property,
  propertyModal,
  onBack,
  onPropertyModalChange,
  companyHref,
  parentCompanyHref,
}: PropertyDetailPageProps) {
  const title = formatPropertyTitle(property.name)
  const [associations, setAssociations] = useState<SpaceAssociation[]>(initialSpaceAssociations)
  const [selectedAssociationId, setSelectedAssociationId] = useState(initialSpaceAssociations[0].id)
  const selectedAssociation =
    associations.find((item) => item.id === selectedAssociationId) ?? associations[0]
  const listStatus = selectedAssociation.status
  const selectedCompany = getPropertyCompany(selectedAssociation.companyId)
  const [editDealOpen, setEditDealOpen] = useState(false)
  const [companiesPanelOpen, setCompaniesPanelOpen] = useState(true)
  const mainPanelReadOnly = listStatus === 'Inactive' || listStatus === 'Pending'
  const mainPanelEmptyStates = listStatus === 'Pending'

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <SidebarNavigation />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppHeader propertyName={property.name} onNavigateProperties={onBack} />
        <main className="flex min-h-0 flex-1 overflow-hidden">
          <aside className="flex w-[22.5vw] shrink-0 flex-col overflow-y-auto border-r border-[#e6e6e7] bg-white py-6">
            <div className="flex flex-col gap-5 px-8">
              <div className="flex items-start gap-2">
                <img alt="" className="size-[50px] shrink-0 rounded object-cover" height={50} src={detailPropertyPhoto} width={50} />
                <h1 className="min-w-0 flex-1 text-xl font-bold leading-7 text-[#262527]">{title}</h1>
                <button
                  type="button"
                  aria-label="Edit property"
                  onClick={() => setEditDealOpen(true)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-[#f5f5f6]"
                >
                  <img alt="" className="size-4 max-w-none" src={detailEdit} />
                </button>
              </div>
              <div className="flex flex-col gap-2 text-sm leading-5 text-[#6a6a70]">
                <p>{property.address}</p>
                <p>{property.metaLine}</p>
              </div>
            </div>
            <div className="my-4 px-8">
              <img alt="" className="block w-full max-w-none" src={detailDividerH} />
            </div>
            <div className="flex flex-col gap-1.5 px-5">
              <div className="flex items-center justify-between rounded-[82px] bg-white px-3 py-1.5">
                <span className="text-sm leading-5 text-primary">Level</span>
                <span className="flex items-center gap-2 text-sm leading-5 text-[#6a6a70]">
                  2 ($10k/month)
                  <span className="relative h-1 w-2">
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={detailChevronSm} />
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5">
                <span className="text-sm leading-5 text-primary">Assigned to</span>
                <button type="button" className="text-sm leading-5 text-primary underline">
                  Assign User
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5">
                <span className="text-sm leading-5 text-primary">Linked Franchise</span>
                <span className="flex items-center gap-2 text-sm leading-5 text-[#6a6a70]">
                  Select Franchise
                  <span className="relative h-1 w-2">
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={detailChevronSm} />
                  </span>
                </span>
              </div>
            </div>
            <div className="my-4 px-8">
              <img alt="" className="block w-full max-w-none" src={detailDividerH} />
            </div>
            <PropertyDetailSideSections />
          </aside>

          <CompanyListingPanel
            associations={associations}
            onAssociationsChange={setAssociations}
            selectedAssociationId={selectedAssociation.id}
            onSelectAssociation={setSelectedAssociationId}
            propertyModal={propertyModal}
            onPropertyModalChange={onPropertyModalChange}
            collapsed={!companiesPanelOpen}
            companyHref={companyHref}
          />
          <CompaniesPanelToggle open={companiesPanelOpen} onToggle={() => setCompaniesPanelOpen((open) => !open)} />

          <section className="flex min-w-0 flex-1 flex-col overflow-y-auto border-l border-[#e6e6e7]">
            {listStatus === 'Pending' ? (
              <div
                className="flex items-start gap-2 border-b border-primary/20 bg-[#e5f6ff] px-8 py-3"
                role="status"
              >
                <span className="relative mt-0.5 size-4 shrink-0 text-primary" aria-hidden>
                  <svg className="block size-full" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 10.6667V8M8 5.33333H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="text-sm font-medium leading-5 text-[#262527]">
                  All features will become available once the effective date arrives
                </p>
              </div>
            ) : null}
            <PropertyDetailCompanyHeader
              companyName={selectedCompany.name}
              companyHref={companyHref?.(selectedCompany.id)}
              spaceLabel={spaceLabelOf(selectedAssociation)}
              listStatus={listStatus}
              ownerName={selectedCompany.companyOwner}
              parentCompany={selectedCompany.parentCompany}
              parentCompanyHref={
                selectedCompany.parentCompany ? parentCompanyHref?.(selectedCompany.parentCompany) : undefined
              }
              affiliations={affiliationsToBadges(selectedAssociation.affiliations)}
              pendingEffectiveDate={listStatus === 'Pending' ? selectedAssociation.effectiveDate : undefined}
              pendingTooltipId={`pending-effective-date-header-${selectedAssociation.id}`}
            />
            <div className="border-b border-[#e6e6e7] px-8 py-5">
              <div className="mb-2 flex items-start justify-between">
                <p className="text-sm font-bold leading-5 text-[#262527]">Property Stages</p>
                <button
                  type="button"
                  className={`flex items-center gap-1 text-sm font-medium leading-5 ${mainPanelLinkClass(mainPanelReadOnly)}`}
                >
                  <span className="relative size-4">
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={detailPlus} />
                  </span>
                  Mark stage as Completed
                </button>
              </div>
              <div className="flex w-full">
                <div className="relative h-9 min-w-0 flex-1">
                  <img
                    alt=""
                    className="absolute inset-0 block size-full max-w-none"
                    src={mainPanelReadOnly ? detailStageApprovedReadonly : detailStageApproved}
                  />
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-sm leading-5 ${
                      mainPanelReadOnly ? 'font-medium text-white' : 'font-bold text-white'
                    }`}
                  >
                    Approved
                  </span>
                </div>
                {stageSteps.slice(0, 2).map((stage) => (
                  <button key={stage} type="button" className="relative h-9 min-w-0 flex-1">
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={detailStageDefault} />
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-sm leading-5 ${
                        mainPanelReadOnly ? 'text-[#86868b]' : 'text-[#5b5b5f]'
                      }`}
                    >
                      {stage}
                    </span>
                  </button>
                ))}
                <button type="button" className="relative h-9 min-w-0 flex-1">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-full w-full -scale-x-100">
                      <img alt="" className="block size-full max-w-none" src={detailStageLast} />
                    </div>
                  </div>
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-sm leading-5 ${
                      mainPanelReadOnly ? 'text-[#86868b]' : 'text-[#5b5b5f]'
                    }`}
                  >
                    Needs Assessment
                  </span>
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-8 pb-5 pt-6">
              <PropertyLeadActivities
                key={selectedAssociation.id}
                company={selectedCompany}
                readOnly={mainPanelReadOnly}
                showEmptyStates={mainPanelEmptyStates}
              />
            </div>
          </section>
        </main>
      </div>
      <EditDealDrawer open={editDealOpen} onClose={() => setEditDealOpen(false)} />
    </div>
  )
}
