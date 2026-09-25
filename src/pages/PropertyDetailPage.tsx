import { useState } from 'react'
import detailChevronSm from '../assets/detail-chevron-sm.svg'
import detailDividerH from '../assets/detail-divider-h.svg'
import detailDividerV from '../assets/detail-divider-v.svg'
import detailEdit from '../assets/detail-edit.svg'
import detailFollowupRepeat from '../assets/detail-followup-repeat.svg'
import detailPlus from '../assets/detail-plus.svg'
import detailPropertyPhoto from '../assets/detail-property-photo.png'
import detailStageApproved from '../assets/detail-stage-approved.svg'
import detailStageApprovedReadonly from '../assets/detail-stage-approved-readonly.svg'
import detailStageDefault from '../assets/detail-stage-default.svg'
import detailStageLast from '../assets/detail-stage-last.svg'
import { AppHeader } from '../components/AppHeader'
import { EditDealDrawer } from '../components/EditDealDrawer'
import { PropertyDetailSideSections } from '../components/PropertyDetailSideSections'
import { PropertyDetailCompanyHeader } from '../components/PropertyDetailCompanyHeader'
import { mainPanelLinkClass } from '../components/mainPanelReadOnlyStyles'
import { PropertyLeadActivities } from '../components/PropertyLeadActivities'
import { SidebarNavigation } from '../components/SidebarNavigation'
import {
  defaultPropertyCompanyId,
  getPropertyCompany,
  type PropertyCompanySelection,
} from '../data/propertyCompanies'
import type { PropertyModal } from '../prototype/screenLinks'
import { formatPropertyTitle, type PropertyRow } from '../data/properties'

const stageSteps = ['Discovery', 'Qualified', 'Needs Assessment']

type PropertyDetailPageProps = {
  property: PropertyRow
  propertyModal?: PropertyModal
  onBack: () => void
  onPropertyModalChange?: (modal?: PropertyModal) => void
}

function VerticalTabDivider() {
  return (
    <div className="flex h-[33px] w-0 shrink-0 items-center justify-center">
      <div className="h-0 w-[33px] rotate-90">
        <img alt="" className="block size-full max-w-none" src={detailDividerV} />
      </div>
    </div>
  )
}

export function PropertyDetailPage({
  property,
  propertyModal,
  onBack,
  onPropertyModalChange,
}: PropertyDetailPageProps) {
  const title = formatPropertyTitle(property.name)
  const [companySelection, setCompanySelection] = useState<PropertyCompanySelection>(() => {
    const company = getPropertyCompany(defaultPropertyCompanyId)
    return { companyId: company.id, listStatus: company.listStatus ?? 'Active' }
  })
  const selectedCompany = getPropertyCompany(companySelection.companyId)
  const [editDealOpen, setEditDealOpen] = useState(false)
  const mainPanelReadOnly =
    companySelection.listStatus === 'Inactive' || companySelection.listStatus === 'Pending'
  const mainPanelEmptyStates = companySelection.listStatus === 'Pending'

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <SidebarNavigation />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppHeader propertyName={property.name} onNavigateProperties={onBack} />
        <main className="flex min-h-0 flex-1 overflow-hidden">
          <aside className="flex w-[400px] shrink-0 flex-col overflow-y-auto border-r border-[#e6e6e7] bg-white py-6">
            <div className="flex flex-col gap-5 px-8">
              <div className="flex items-center gap-2">
                <img alt="" className="size-[50px] shrink-0 rounded object-cover" height={50} src={detailPropertyPhoto} width={50} />
                <h1 className="text-xl font-bold leading-7 text-[#262527]">{title}</h1>
              </div>
              <div className="flex flex-col gap-2 text-sm leading-5 text-[#6a6a70]">
                <p>{property.address}</p>
                <p>{property.metaLine}</p>
              </div>
              <div className="flex w-fit max-w-full items-center gap-3 self-start rounded-md border border-[#e6e6e7] bg-[#f5f5f6] px-3 py-2">
                <button
                  type="button"
                  className="text-sm font-medium leading-5 text-[#262527]"
                  onClick={() => setEditDealOpen(true)}
                >
                  Edit
                </button>
                <VerticalTabDivider />
                <button type="button" className="text-sm font-medium leading-5 text-[#262527]">
                  Make a Deal
                </button>
              </div>
              <div className="flex flex-col gap-2 rounded-lg bg-[#f5f5f6] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium leading-5 text-[#262527]">Follow-up added</p>
                    <div className="flex items-center gap-1">
                      <span className="flex size-4 items-center justify-center rounded bg-primary">
                        <span className="relative size-2.5">
                          <img alt="" className="absolute inset-0 block size-full max-w-none" src={detailFollowupRepeat} />
                        </span>
                      </span>
                      <span className="text-xs font-medium leading-[18px] text-primary">24-02-2024 • 11:30a - 2:30p</span>
                    </div>
                  </div>
                  <button type="button" aria-label="Edit follow-up" className="relative size-4 shrink-0">
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={detailEdit} />
                  </button>
                </div>
                <p className="text-xs leading-4 text-[#262527]">
                  Arrived at location but unable to meet with the location representative.{' '}
                  <span className="text-primary">See more</span>
                </p>
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
            <PropertyDetailSideSections
              selectedCompanyId={companySelection.companyId}
              onSelectCompany={setCompanySelection}
              propertyModal={propertyModal}
              onPropertyModalChange={onPropertyModalChange}
            />
          </aside>

          <section className="flex min-w-0 flex-1 flex-col overflow-y-auto border-l border-[#e6e6e7]">
            {companySelection.listStatus === 'Pending' ? (
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
              listStatus={companySelection.listStatus}
              ownerName={selectedCompany.companyOwner}
              affiliations={companySelection.affiliationBadges ?? selectedCompany.affiliations}
              pendingEffectiveDate={companySelection.pendingEffectiveDate}
              pendingTooltipId={companySelection.pendingTooltipId}
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
                key={`${selectedCompany.id}-${companySelection.listStatus}`}
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
