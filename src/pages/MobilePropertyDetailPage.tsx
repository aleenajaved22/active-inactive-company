import { useMemo, useState } from 'react'
import { affiliationsToBadges } from '../components/switchCompanyTypes'
import { ContractProposalNotice } from '../components/ContractProposalNotice'
import { INACTIVE_BANNER, PENDING_BANNER } from '../data/companyAtPropertyCopy'
import { leadActivityTabs } from '../data/leadActivities'
import { formatPropertyTitle, type PropertyRow } from '../data/properties'
import { getPropertyCompany } from '../data/propertyCompanies'
import {
  billingAddressPanelData,
  franchiseAssociatedPanelData,
  propertyDetailsPanelData,
} from '../data/propertyDetailSidePanel'
import { initialSpaceAssociations, spaceLabelOf } from '../data/propertySpaceAssociations'
import { MobileAccordion, MobileDetailRow } from '../mobile/MobileAccordion'
import { MobileBottomNav } from '../mobile/MobileBottomNav'
import { MobileCompanyToggle } from '../mobile/MobileCompanyToggle'
import { MobileFrame } from '../mobile/MobileFrame'
import {
  IconAdd,
  IconAlert,
  IconChevronDown,
  IconChevronLeft,
  IconEdit,
  IconLocation,
  IconNavigate,
  IconRepeat,
} from '../mobile/MobileIcons'
import { MobileStageRail, type MobileStage } from '../mobile/MobileStageRail'
import { MobileStatusBar } from '../mobile/MobileStatusBar'
import {
  MobileAffiliationBadges,
  MobileListStatusBadge,
  MobilePendingBadge,
} from '../mobile/MobileStatusPills'
import { MobileCompaniesSheet } from '../mobile/MobileCompaniesSheet'
import { MobileTabs } from '../mobile/MobileTabs'
import { useMobileCompanyActions } from '../mobile/useMobileCompanyActions'

/** The web app's property stages. */
const stageSteps = ['Discovery', 'Qualified', 'Needs Assessment']
const currentStage = 'Needs Assessment'

/** Mobile folds the web app's left details panel into an Information tab. */
const detailTabs = ['Information', ...leadActivityTabs] as const
type DetailTab = (typeof detailTabs)[number]

const pad2 = (value: number) => String(value).padStart(2, '0')

type MobilePropertyDetailPageProps = {
  property: PropertyRow
  onBack?: () => void
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#f6f6f8] px-3 ${
        disabled ? 'text-[#86868b]' : 'text-black'
      }`}
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

  const stages: MobileStage[] = stageSteps.map((label, index) => {
    const currentIndex = stageSteps.indexOf(currentStage)
    return {
      label,
      state: index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming',
    }
  })

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
                {formatPropertyTitle(property.name)}
              </h1>
              <button
                type="button"
                aria-label="Open in maps"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e8f1ff] text-[#146dff]"
              >
                <IconNavigate size={18} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 pl-7 pt-1">
              <IconLocation size={16} className="shrink-0 text-[#6a6a70]" />
              <span className="min-w-0 truncate text-sm leading-5 text-[#6a6a70]">
                {property.address}
              </span>
            </div>

            <div className="flex gap-2 pt-3">
              <ActionButton icon={<IconAdd size={18} />} label="Make a Deal" disabled={readOnly} />
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
            <div className="w-full pb-4">
              <MobileStageRail stages={stages} />
            </div>
            <div className="w-full">
              <MobileTabs tabs={detailTabs} active={activeTab} onChange={setActiveTab} />
            </div>
          </div>
        </div>

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto" style={{ paddingBottom: 160 }}>
          <div className="flex flex-col gap-3 px-4 pt-4">
            <ContractProposalNotice tillDate={selectedAssociation.endDate} />

            {activeTab === 'Information' ? (
              <>
                {showBanner && (
                  <div className="flex items-start gap-2 rounded-lg bg-[#e5f6ff] p-3">
                    <IconAlert size={16} className="mt-px shrink-0 text-[#146dff]" />
                    <p className="min-w-0 flex-1 text-sm font-medium leading-5 text-[#262527]">
                      {listStatus === 'Pending' ? PENDING_BANNER : INACTIVE_BANNER}
                    </p>
                  </div>
                )}

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
                      <MobileDetailRow
                        key={row.label}
                        label={row.label}
                        value={
                          'referral' in row && row.referral ? (
                            <span className="flex min-w-0 flex-col">
                              <span>{row.value as string}</span>
                              <span className="text-[#1c1c1c]">{row.referral.name}</span>
                              {/* The 0.25px tracking pushes a full email onto a second line. */}
                              <span className="leading-5 tracking-normal">{row.referral.email}</span>
                              <span className="leading-5 tracking-normal">{row.referral.phone}</span>
                            </span>
                          ) : (
                            (row.value as string)
                          )
                        }
                      />
                    ))}
                  </div>
                </MobileAccordion>

                <MobileAccordion
                  title={`Company • ${pad2(currentAssociations.length)}`}
                  summary={company.name}
                >
                  <div className="mb-3 flex flex-col rounded-lg bg-[#f6f6f8] px-3 py-2">
                    <MobileDetailRow label="Industry Vertical" value={company.industryVertical} />
                    <MobileDetailRow label="Parent Company" value={company.parentCompany ?? 'Not set'} />
                    <MobileDetailRow label="Assignee" value={selectedAssociation.assignee} />
                    {selectedAssociation.supervisor && (
                      <MobileDetailRow label="Supervisor" value={selectedAssociation.supervisor} />
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    {currentAssociations.map((association) => {
                      const item = getPropertyCompany(association.companyId)
                      const selected = association.id === selectedAssociation.id
                      return (
                        <button
                          key={association.id}
                          type="button"
                          onClick={() => setSelectedAssociationId(association.id)}
                          className={`flex w-full flex-col items-start gap-1.5 rounded-lg p-2 text-left ${
                            selected ? 'bg-[#eff4fd]' : ''
                          }`}
                        >
                          <span className="flex w-full items-center justify-between gap-2">
                            <span className="min-w-0 truncate text-sm font-medium leading-5 text-[#262527]">
                              {item.name}
                            </span>
                            {association.status === 'Pending' ? (
                              <MobilePendingBadge effectiveDate={association.effectiveDate} />
                            ) : (
                              <MobileListStatusBadge status={association.status} />
                            )}
                          </span>
                          <span className="text-xs leading-[18px] text-[#86868b]">
                            {spaceLabelOf(association)}
                            {item.parentCompany ? ` · ${item.parentCompany}` : ''}
                          </span>
                          <MobileAffiliationBadges
                            badges={affiliationsToBadges(association.affiliations)}
                          />
                        </button>
                      )
                    })}
                  </div>
                </MobileAccordion>

                <MobileAccordion
                  title={`Deals • ${pad2(company.deals.length)}`}
                  summary={company.deals[0]?.name ?? 'No deals yet'}
                >
                  <div className="flex flex-col gap-3">
                    {company.deals.map((deal) => (
                      <div key={deal.id} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 truncate text-sm font-medium leading-5 text-[#262527]">
                            {deal.name}
                          </span>
                          <span className="shrink-0 text-sm leading-5 text-[#262527]">
                            {deal.amount}
                          </span>
                        </div>
                        <span className="text-xs leading-[18px] text-[#86868b]">
                          {deal.stage} · {deal.date}
                        </span>
                      </div>
                    ))}
                    {company.deals.length === 0 && (
                      <p className="text-sm leading-5 text-[#86868b]">No deals yet.</p>
                    )}
                  </div>
                </MobileAccordion>

                <MobileAccordion
                  title="Billing Address"
                  summary={billingAddressPanelData.contact}
                >
                  <div className="flex flex-col">
                    <MobileDetailRow label="Contact" value={billingAddressPanelData.contact} />
                    <MobileDetailRow label="Address" value={billingAddressPanelData.address} />
                    <MobileDetailRow label="Country" value={billingAddressPanelData.country} />
                    <MobileDetailRow label="State" value={billingAddressPanelData.state} />
                    <MobileDetailRow label="City" value={billingAddressPanelData.city} />
                    <MobileDetailRow label="Zipcode" value={billingAddressPanelData.zipcode} />
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
            ) : (
              <TabPlaceholder tab={activeTab} />
            )}
          </div>
        </div>

        <MobileCompanyToggle
          companyName={company.name}
          position={currentIndex === -1 ? null : currentIndex + 1}
          total={currentAssociations.length}
          onClick={() => setSwitcherOpen(true)}
        />

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
