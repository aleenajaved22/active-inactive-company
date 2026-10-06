import { useMemo, useState } from 'react'
import { StagePill } from '../components/StagePill'
import { stageBadgeClass } from '../components/PropertyDealsBillingPanels'
import { INACTIVE_BANNER, PENDING_BANNER } from '../data/companyAtPropertyCopy'
import { formatShortDate } from '../data/dateFormat'
import { leadActivityTabs } from '../data/leadActivities'
import { formatPropertyTitle, type PropertyRow } from '../data/properties'
import { getPropertyCompany, type PropertyCompany } from '../data/propertyCompanies'
import { initialReachedStages, propertyStageLabels } from '../data/propertyStages'
import { franchiseAssociatedPanelData, propertyDetailsPanelData } from '../data/propertyDetailSidePanel'
import { initialSpaceAssociations, spaceLabelOf } from '../data/propertySpaceAssociations'
import { MobileAccordion, MobileDetailRow } from '../mobile/MobileAccordion'
import { MobileBottomNav } from '../mobile/MobileBottomNav'
import { MobileCompanyStrip } from '../mobile/MobileCompanyStrip'
import { MobileFrame } from '../mobile/MobileFrame'
import {
  IconAdd,
  IconAlert,
  IconChevronDown,
  IconChevronLeft,
  IconEdit,
  IconNavigate,
  IconRepeat,
} from '../mobile/MobileIcons'
import { MobileStatusBar } from '../mobile/MobileStatusBar'
import { MobileCompaniesSheet } from '../mobile/MobileCompaniesSheet'
import { MobileTabs } from '../mobile/MobileTabs'
import { useMobileCompanyActions } from '../mobile/useMobileCompanyActions'

/** Mobile folds the web app's left details panel into an Information tab. */
const detailTabs = ['Information', ...leadActivityTabs] as const
type DetailTab = (typeof detailTabs)[number]

type MobilePropertyDetailPageProps = {
  property: PropertyRow
  onBack?: () => void
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  primary,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
  /** The action this row leads with. */
  primary?: boolean
}) {
  const tone = disabled
    ? 'bg-[#f6f6f8] text-[#86868b]'
    : primary
      ? 'bg-[#e8f1ff] text-[#146dff]'
      : 'bg-[#f6f6f8] text-black'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 ${tone}`}
    >
      {icon}
      <span className="truncate text-sm font-medium leading-5">{label}</span>
    </button>
  )
}

function InlineValueRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-1 py-1.5">
      <span className="shrink-0 text-sm leading-5 text-[#146dff]">{label}</span>
      {children}
    </div>
  )
}

/** The selected company's deals, with the same fields as the web table. */
function MobileDealsTab({ company }: { company: PropertyCompany }) {
  if (company.deals.length === 0) {
    return (
      <p className="rounded-lg bg-white px-4 py-8 text-center text-sm leading-5 text-[#86868b] shadow-[0px_4px_12px_rgba(0,0,0,0.04)]">
        No deals added yet
      </p>
    )
  }
  return (
    <ul className="flex flex-col gap-3">
      {company.deals.map((deal) => (
        <li
          key={deal.id}
          className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="min-w-0 text-sm font-medium leading-5 text-[#262527]">{deal.name}</span>
            <span className="shrink-0 text-sm leading-5 text-[#6a6a70]">{deal.amount}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className={`rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px] ${stageBadgeClass(deal.stage)}`}>
              {deal.stage}
            </span>
            <span className="text-xs leading-[18px] text-[#86868b]">Created {formatShortDate(deal.date)}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

/** The selected company's billing address, from the same record the web tab reads. */
function MobileBillingTab({ company }: { company: PropertyCompany }) {
  const billing = company.billingAddress
  return (
    <div className="flex flex-col rounded-lg bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)]">
      <p className="pb-2 text-sm font-semibold leading-5 text-[#262527]">Billing Address</p>
      <MobileDetailRow label="Contact" value={billing.contact} />
      <MobileDetailRow label="Address" value={billing.address} />
      <MobileDetailRow label="Country" value={billing.country} />
      <MobileDetailRow label="State" value={billing.state} />
      <MobileDetailRow label="City" value={billing.city} />
      <MobileDetailRow label="Zipcode" value={billing.zipcode} />
    </div>
  )
}

function TabPlaceholder({ tab }: { tab: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-white px-6 py-10 text-center shadow-[0px_4px_12px_rgba(0,0,0,0.04)]">
      <p className="text-sm font-medium leading-5 text-[#262527]">{tab}</p>
      <p className="text-sm leading-5 text-[#86868b]">
        This tab has no mobile design yet. It exists in the web app.
      </p>
    </div>
  )
}

export function MobilePropertyDetailPage({ property, onBack }: MobilePropertyDetailPageProps) {
  const [associations, setAssociations] = useState(initialSpaceAssociations)
  const [selectedAssociationId, setSelectedAssociationId] = useState(initialSpaceAssociations[0].id)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<DetailTab>('Information')

  const { actionsFor, openAddCompany, showActions, screens: companyScreens } =
    useMobileCompanyActions({
      associations,
      onAssociationsChange: setAssociations,
      onSelectAssociation: setSelectedAssociationId,
      onFlowOpen: () => setSwitcherOpen(false),
    })

  const selectedAssociation = useMemo(
    () => associations.find((item) => item.id === selectedAssociationId) ?? associations[0],
    [associations, selectedAssociationId],
  )
  const company = getPropertyCompany(selectedAssociation.companyId)
  const listStatus = selectedAssociation.status

  // Mirrors the web app: a pending company can be prepared, so only an inactive
  // one is read-only. Publishing a contract is what waits for the effective date.
  const readOnly = listStatus === 'Inactive'
  const showBanner = listStatus !== 'Active'

  // The toggle counts companies currently on the property, not the inactive history.
  const currentAssociations = associations.filter(
    (item) => item.status === 'Active' || item.status === 'Pending',
  )
  const currentIndex = currentAssociations.findIndex((item) => item.id === selectedAssociation.id)

  // The same stages, at the same progress, as the web app's property column.
  const stages = propertyStageLabels.map((label, index) => ({ label, reached: index < initialReachedStages }))

  return (
    <MobileFrame caption="Mobile — Property detail">
      <div className="relative flex size-full flex-col overflow-hidden bg-[#f6f6f8]">
        {/* Top chrome — sized by its content so a wrapped title cannot clip the list */}
        <div className="z-20 shrink-0 bg-white">
          <MobileStatusBar />

          <div className="px-4 pb-3">
            <div className="flex items-start gap-2">
              <button type="button" aria-label="Back" onClick={onBack} className="-ml-1 mt-0.5 text-black">
                <IconChevronLeft size={24} />
              </button>
              <h1 className="line-clamp-2 min-w-0 flex-1 text-xl font-bold leading-7 text-black">
                {property.address}
              </h1>
              <button
                type="button"
                aria-label="Open in maps"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e8f1ff] text-[#146dff]"
              >
                <IconNavigate size={18} />
              </button>
            </div>

            <p className="truncate pl-7 pt-1 text-sm leading-5 text-[#6a6a70]">
              {formatPropertyTitle(property.name)}
            </p>

            <div className="flex gap-2 pt-3">
              <ActionButton primary icon={<IconAdd size={18} />} label="Make a Deal" disabled={readOnly} />
              <ActionButton icon={<IconRepeat size={16} />} label="Follow Up" disabled={readOnly} />
              <button
                type="button"
                aria-label="Edit property"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f6f6f8] text-black"
              >
                <IconEdit size={18} />
              </button>
            </div>
          </div>

          <div className="h-2.5 w-full bg-[#eaecee]" />

          <div className="flex flex-col items-start bg-white px-4 pt-2.5">
            <div className="w-full pb-3">
              <StagePill size="sm" stages={stages} />
            </div>
            <div className="w-full pb-2">
              <MobileCompanyStrip
                companyName={company.name}
                status={listStatus}
                spaceLabel={spaceLabelOf(selectedAssociation)}
                assignee={selectedAssociation.assignee}
                position={currentIndex === -1 ? null : currentIndex + 1}
                total={currentAssociations.length}
                onClick={() => setSwitcherOpen(true)}
              />
            </div>
            <div className="w-full">
              <MobileTabs tabs={detailTabs} active={activeTab} onChange={setActiveTab} />
            </div>
          </div>
        </div>

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto" style={{ paddingBottom: 112 }}>
          <div className="flex flex-col gap-3 px-4 pt-4">
            {/* What state the company is in comes first, then what that means
                for its contracts. Both sit outside the tabs, as on the web. */}
            {showBanner && (
              <div className="flex items-start gap-2 rounded-lg bg-[#e5f6ff] p-3">
                <IconAlert size={16} className="mt-px shrink-0 text-[#146dff]" />
                <p className="min-w-0 flex-1 text-sm font-medium leading-5 text-[#262527]">
                  {listStatus === 'Pending' ? PENDING_BANNER : INACTIVE_BANNER}
                </p>
              </div>
            )}

            {activeTab === 'Information' ? (
              <>

                {/* Level / Assigned to / Linked Franchise */}
                <div className="flex flex-col rounded-lg bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)]">
                  <InlineValueRow label="Level">
                    <span className="flex items-center gap-2 text-sm leading-5 text-[#6a6a70]">
                      2 ($10k/month)
                      <IconChevronDown size={18} className="text-[#6a6a70]" />
                    </span>
                  </InlineValueRow>
                  <InlineValueRow label="Linked Franchise">
                    <span className="flex items-center gap-2 text-sm leading-5 text-[#6a6a70]">
                      Select Franchise
                      <IconChevronDown size={18} className="text-[#6a6a70]" />
                    </span>
                  </InlineValueRow>
                </div>

                <MobileAccordion
                  title="Property Details"
                  summary={propertyDetailsPanelData.rows[0].value as string}
                >
                  <div className="flex flex-col">
                    {propertyDetailsPanelData.rows.map((row) => (
                      <MobileDetailRow key={row.label} label={row.label} value={row.value} />
                    ))}
                  </div>
                </MobileAccordion>

                <MobileAccordion
                  title="Franchise Associated"
                  summary={franchiseAssociatedPanelData.nameLines[0]}
                >
                  <div className="flex flex-col">
                    <MobileDetailRow
                      label="Name"
                      value={franchiseAssociatedPanelData.nameLines.join(', ')}
                    />
                    <MobileDetailRow label="Email" value={franchiseAssociatedPanelData.email} />
                    <MobileDetailRow label="Phone" value={franchiseAssociatedPanelData.phone} />
                    <MobileDetailRow label="Address" value={franchiseAssociatedPanelData.address} />
                  </div>
                </MobileAccordion>

                <MobileAccordion title="Attachments • 00" summary="No attachments">
                  <p className="py-2 text-sm leading-5 text-[#86868b]">No attachments yet.</p>
                </MobileAccordion>
              </>
            ) : activeTab === 'Deals' ? (
              <MobileDealsTab company={company} />
            ) : activeTab === 'Billing' ? (
              <MobileBillingTab company={company} />
            ) : (
              <TabPlaceholder tab={activeTab} />
            )}
          </div>
        </div>

        <MobileBottomNav active="properties" />

        {/*
          Unmounted when closed so search and the inactive drill-down start
          fresh each time. The web panel is always on screen and keeps its state;
          a reopened sheet showing a stale filter reads as missing companies.
        */}
        {switcherOpen && (
        <MobileCompaniesSheet
          open
          associations={associations}
          selectedAssociationId={selectedAssociationId}
          onSelectAssociation={setSelectedAssociationId}
          onClose={() => setSwitcherOpen(false)}
          onAddCompany={openAddCompany}
          actionsFor={actionsFor}
          // The action drawer opens on top of this one, so the list stays put.
          onShowActions={showActions}
        />
        )}

        {companyScreens}
      </div>
    </MobileFrame>
  )
}
