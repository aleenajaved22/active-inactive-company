import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { PropertyModal } from '../prototype/screenLinks'
import type { CompanyAffiliationBadge } from '../data/propertyDetailSidePanel'
import { PendingStatusBadge } from './PendingStatusBadge'
import { EditCompanyModal } from './EditCompanyModal'
import { SwitchCompanyModal } from './SwitchCompanyModal'
import {
  propertyAffiliationOptions,
  type CompanyAssociation,
  type PropertyAffiliation,
  type SwitchCompanySubmitPayload,
} from './switchCompanyTypes'
import detailCompanyMenu from '../assets/detail-company-menu.svg'
import detailContactMail from '../assets/detail-contact-mail.svg'
import detailReferredUser from '../assets/detail-referred-user.svg'
import detailRowDivider from '../assets/detail-row-divider.svg'
import detailSectionIcon from '../assets/detail-section-icon.svg'
import detailSectionIconExpanded from '../assets/detail-section-icon-expanded.svg'
import tableSync from '../assets/table-sync.svg'
import {
  getPropertyCompany,
  propertyCompanies,
  type PropertyCompany,
  type PropertyCompanySelection,
} from '../data/propertyCompanies'
import {
  attachmentsPanelData,
  franchiseAssociatedPanelData,
  propertyDetailSectionOrder,
  propertyDetailSectionTitles,
  type DetailSectionId,
  propertyDetailsPanelData,
} from '../data/propertyDetailSidePanel'

type PropertyDetailSideSectionsProps = {
  selectedCompanyId: string
  onSelectCompany: (selection: PropertyCompanySelection) => void
  propertyModal?: PropertyModal
  onPropertyModalChange?: (modal?: PropertyModal) => void
}

function SectionChevron({ expanded }: { expanded: boolean }) {
  if (expanded) {
    return (
      <span className="relative block size-[22px] shrink-0">
        <img alt="" className="block size-full max-w-none rotate-180" src={detailSectionIconExpanded} />
      </span>
    )
  }
  return (
    <span className="relative block size-[22px] shrink-0">
      <img alt="" className="block size-full max-w-none" src={detailSectionIcon} />
    </span>
  )
}

function DetailLabelValueRow({
  label,
  value,
  multiline,
}: {
  label: string
  value: string | string[]
  multiline?: boolean
}) {
  const valueContent = Array.isArray(value) ? value : [value]
  return (
    <div className={`flex gap-6 ${multiline ? 'items-start' : 'items-center'}`}>
      <p className="w-[114px] shrink-0 text-sm leading-6 tracking-[0.25px] text-[#262527]">{label}</p>
      <div className="min-w-0 flex-1 text-sm leading-6 tracking-[0.25px] text-[#86868b]">
        {valueContent.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  )
}

const sidebarCompanyPickerList = propertyCompanies.slice(0, 2)

const affiliationBadgeStyles: Record<PropertyAffiliation, { bg: string; text: string }> = {
  Headquarters: { bg: '#fff4d8', text: '#f6a300' },
  Managed: { bg: '#e5f6ff', text: '#146dff' },
  Owned: { bg: '#f4edfd', text: '#9747ff' },
  Shared: { bg: '#fbeeed', text: '#d9534f' },
  'Regional Office': { bg: '#eff8ef', text: '#2e964b' },
  Tenant: { bg: '#ffeed4', text: '#ef5c07' },
}

function affiliationsToBadges(affiliations: PropertyAffiliation[]): CompanyAffiliationBadge[] {
  return affiliations.map((label) => ({
    label,
    bg: affiliationBadgeStyles[label].bg,
    text: affiliationBadgeStyles[label].text,
  }))
}

function badgesToAffiliations(badges: CompanyAffiliationBadge[]): PropertyAffiliation[] {
  return badges
    .map((badge) => badge.label)
    .filter((label): label is PropertyAffiliation =>
      (propertyAffiliationOptions as readonly string[]).includes(label),
    )
}

function CompanySidebarDetails({
  company,
  showScore = false,
}: {
  company: PropertyCompany
  showScore?: boolean
}) {
  return (
    <div className="flex flex-col gap-3 px-3 pb-3 pt-1">
      <div className="flex flex-col gap-0 text-sm leading-6 tracking-[0.25px]">
        <DetailLabelValueRow label="Owner" value={company.companyOwner} />
        <DetailLabelValueRow label="Phone" value={company.phone} />
        <DetailLabelValueRow label="SP Status" value={company.spStatus} />
        {showScore ? <DetailLabelValueRow label="Score" value={company.score} /> : null}
      </div>
    </div>
  )
}

function CompanyListStatusBadge({ status }: { status: 'Active' | 'Inactive' | 'Pending' }) {
  const className =
    status === 'Active'
      ? 'bg-[#eff8ef] text-[#2e964b]'
      : status === 'Pending'
        ? 'bg-[#fff4d8] text-[#f6a300]'
        : 'bg-[#ececed] text-[#5b5b5f]'

  return (
    <span className={`shrink-0 rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px] ${className}`}>
      {status}
    </span>
  )
}

function PendingAssociationMenu({ onEdit }: { onEdit: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="More actions"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex size-8 items-center justify-center rounded-lg hover:bg-[#e6e6e7]/60"
        onClick={(event) => {
          event.stopPropagation()
          setOpen((prev) => !prev)
        }}
      >
        <img alt="" className="size-4 max-w-none" src={detailCompanyMenu} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 min-w-[120px] rounded-lg border border-[#e6e6e7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full px-3 py-2 text-left text-sm leading-5 text-[#262527] hover:bg-[#f5f5f6]"
            onClick={(event) => {
              event.stopPropagation()
              setOpen(false)
              onEdit()
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  )
}

function CompanyAssociationCard({
  name,
  status,
  selected,
  onSelect,
  pendingEffectiveDate,
  pendingTooltipId,
  onEditPending,
  onEdit,
  children,
}: {
  name: string
  status: 'Active' | 'Inactive' | 'Pending'
  selected: boolean
  onSelect: () => void
  pendingEffectiveDate?: string
  pendingTooltipId?: string
  onEditPending?: () => void
  onEdit?: () => void
  children?: ReactNode
}) {
  return (
    <div
      className={
        selected
          ? 'overflow-hidden rounded-lg border border-primary/30 bg-blue-50'
          : 'overflow-hidden rounded-lg border border-[#e6e6e7] bg-transparent hover:border-primary/30 hover:bg-blue-50'
      }
    >
      <div
        className={`flex w-full items-center gap-0.5 px-3 transition-colors ${
          selected ? 'bg-blue-50' : 'bg-transparent hover:bg-blue-50'
        }`}
      >
        <button
          type="button"
          aria-expanded={selected}
          onClick={onSelect}
          className={`min-w-0 flex-1 cursor-pointer truncate py-2.5 text-left text-sm leading-5 text-[#262527] ${
            selected ? 'font-semibold' : 'font-medium'
          }`}
        >
          {name}
        </button>
        {status === 'Pending' && pendingEffectiveDate !== undefined ? (
          <PendingStatusBadge
            effectiveDate={pendingEffectiveDate}
            tooltipId={pendingTooltipId ?? 'pending-effective-date-tooltip'}
          />
        ) : (
          <CompanyListStatusBadge status={status} />
        )}
        {status === 'Pending' && onEditPending ? (
          <PendingAssociationMenu onEdit={onEditPending} />
        ) : status === 'Active' && onEdit ? (
          <PendingAssociationMenu onEdit={onEdit} />
        ) : null}
      </div>
      {selected && children && <div className="border-t border-[#e6e6e7] bg-blue-50">{children}</div>}
    </div>
  )
}

function CompanyPanelContent({
  selectedCompanyId,
  selectedPendingAssociationId,
  pendingAssociations,
  onSelectCompany,
  onSelectPendingAssociation,
  onEditPendingAssociation,
  onEditCompany,
}: {
  selectedCompanyId: string
  selectedPendingAssociationId: string | null
  pendingAssociations: CompanyAssociation[]
  onSelectCompany: (selection: PropertyCompanySelection) => void
  onSelectPendingAssociation: (associationId: string, selection: PropertyCompanySelection) => void
  onEditPendingAssociation: (associationId: string) => void
  onEditCompany: (companyId: string) => void
}) {
  const pendingCompanyIds = new Set(pendingAssociations.map((association) => association.companyId))
  const visibleStaticCompanies = sidebarCompanyPickerList.filter((item) => !pendingCompanyIds.has(item.id))

  return (
    <div className="flex flex-col gap-2 border-t border-[#e6e6e7] pb-3 pt-2">
      {visibleStaticCompanies.map((item) => {
        const selected = selectedPendingAssociationId === null && item.id === selectedCompanyId
        const listStatus = item.listStatus ?? 'Active'

        return (
          <CompanyAssociationCard
            key={item.id}
            name={item.name}
            status={listStatus}
            selected={selected}
            onSelect={() =>
              onSelectCompany({
                companyId: item.id,
                listStatus,
              })
            }
            onEdit={() => onEditCompany(item.id)}
          >
            <CompanySidebarDetails company={getPropertyCompany(item.id)} showScore />
          </CompanyAssociationCard>
        )
      })}
      {pendingAssociations.map((association) => {
        const company = getPropertyCompany(association.companyId)
        const selected = association.id === selectedPendingAssociationId

        return (
          <CompanyAssociationCard
            key={association.id}
            name={company.name}
            status="Pending"
            selected={selected}
            onSelect={() =>
              onSelectPendingAssociation(association.id, {
                companyId: association.companyId,
                listStatus: 'Pending',
              })
            }
            pendingEffectiveDate={association.effectiveDate}
            pendingTooltipId={`pending-effective-date-${association.id}`}
            onEditPending={() => onEditPendingAssociation(association.id)}
          >
            <CompanySidebarDetails company={company} />
          </CompanyAssociationCard>
        )
      })}
    </div>
  )
}

function PropertyDetailsPanelContent() {
  return (
    <div className="max-h-[280px] overflow-y-auto pb-3">
      <div className="flex flex-col gap-1">
        {propertyDetailsPanelData.rows.map((row) => {
          if ('referral' in row && row.referral) {
            return (
              <div key={row.label} className="flex gap-6">
                <p className="w-[114px] shrink-0 text-sm leading-6 text-[#262527]">{row.label}</p>
                <div className="min-w-0 flex-1 text-sm text-[#86868b]">
                  <p className="leading-6 tracking-[0.25px]">{row.value}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full border border-white bg-[#cfefff]">
                      <img alt="" className="size-2.5" src={detailReferredUser} />
                    </span>
                    <p className="leading-6 tracking-[0.25px]">{row.referral.name}</p>
                  </div>
                  <p className="leading-5">{row.referral.email}</p>
                  <p className="leading-5">{row.referral.phone}</p>
                </div>
              </div>
            )
          }
          return (
            <DetailLabelValueRow
              key={row.label}
              label={row.label}
              value={row.value}
              multiline={row.label === 'Address' || row.label === 'Name'}
            />
          )
        })}
      </div>
    </div>
  )
}

function FranchiseAssociatedPanelContent() {
  const { nameLines, email, phone, address } = franchiseAssociatedPanelData
  return (
    <div className="flex flex-col gap-1 pb-3">
      <DetailLabelValueRow label="Name" value={nameLines} multiline />
      <div className="flex items-center gap-6">
        <p className="w-[114px] shrink-0 text-sm leading-6 tracking-[0.25px] text-[#262527]">Email</p>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <p className="text-sm leading-5 text-primary">{email}</p>
          <button
            type="button"
            aria-label={`Email ${email}`}
            onClick={() => window.open(`mailto:${email}`, '_blank')}
            className="relative size-4 shrink-0"
          >
            <img alt="" className="block size-full max-w-none" src={detailContactMail} />
          </button>
        </div>
      </div>
      <DetailLabelValueRow label="Phone" value={phone} />
      <DetailLabelValueRow label="Address" value={address} multiline />
      <img alt="" className="mt-3 block w-full max-w-none" src={detailRowDivider} />
    </div>
  )
}

function AttachmentsPanelContent() {
  if (attachmentsPanelData.length === 0) {
    return (
      <p className="pb-3 text-sm leading-5 text-[#86868b]">
        No attachments yet.{' '}
        <button
          type="button"
          onClick={() => window.alert('Upload attachment (prototype)')}
          className="font-medium text-primary"
        >
          Upload
        </button>
      </p>
    )
  }
  return (
    <ul className="flex flex-col gap-2 pb-3">
      {attachmentsPanelData.map((file) => (
        <li key={file.id} className="flex items-center justify-between text-sm leading-5">
          <span className="font-medium text-[#262527]">{file.name}</span>
          <span className="text-[#86868b]">{file.size}</span>
        </li>
      ))}
    </ul>
  )
}

function sectionContent(
  id: DetailSectionId,
  companyPanelProps: {
    selectedCompanyId: string
    selectedPendingAssociationId: string | null
    pendingAssociations: CompanyAssociation[]
    onSelectCompany: (selection: PropertyCompanySelection) => void
    onSelectPendingAssociation: (associationId: string, selection: PropertyCompanySelection) => void
    onEditPendingAssociation: (associationId: string) => void
    onEditCompany: (companyId: string) => void
  },
) {
  switch (id) {
    case 'propertyDetails':
      return <PropertyDetailsPanelContent />
    case 'company':
      return <CompanyPanelContent {...companyPanelProps} />
    case 'franchiseAssociated':
      return <FranchiseAssociatedPanelContent />
    case 'attachments':
      return <AttachmentsPanelContent />
  }
}

function createDefaultOpen(): Record<DetailSectionId, boolean> {
  return propertyDetailSectionOrder.reduce(
    (acc, id) => {
      acc[id] = false
      return acc
    },
    {} as Record<DetailSectionId, boolean>,
  )
}

export function PropertyDetailSideSections({
  selectedCompanyId,
  onSelectCompany,
  propertyModal,
  onPropertyModalChange,
}: PropertyDetailSideSectionsProps) {
  const [openSections, setOpenSections] = useState(createDefaultOpen)
  const [pendingAssociations, setPendingAssociations] = useState<CompanyAssociation[]>([])
  const [selectedPendingAssociationId, setSelectedPendingAssociationId] = useState<string | null>(null)
  const [editAssociationId, setEditAssociationId] = useState<string | null>(null)
  const [editCompanyId, setEditCompanyId] = useState<string | null>(null)
  const [companyAffiliationOverrides, setCompanyAffiliationOverrides] = useState<
    Record<string, PropertyAffiliation[]>
  >({})

  const switchModalOpen = propertyModal !== undefined
  const editModalOpen = editAssociationId !== null
  const companyModalOpen = switchModalOpen || editModalOpen
  const editingAssociation = pendingAssociations.find((item) => item.id === editAssociationId)

  useEffect(() => {
    if (!propertyModal) return
    setOpenSections((prev) => ({ ...prev, company: true }))
  }, [propertyModal])

  const closeCompanyModal = () => {
    setEditAssociationId(null)
    onPropertyModalChange?.(undefined)
  }

  const handleRevertPendingAssociation = (associationId: string) => {
    const association = pendingAssociations.find((item) => item.id === associationId)
    const nextPending = pendingAssociations.filter((item) => item.id !== associationId)
    setPendingAssociations(nextPending)
    setSelectedPendingAssociationId(null)
    setEditAssociationId(null)

    const hiddenCompanyIds = new Set(nextPending.map((item) => item.companyId))
    const fallback =
      propertyCompanies.find(
        (company) =>
          company.id !== association?.companyId &&
          company.listStatus !== 'Inactive' &&
          !hiddenCompanyIds.has(company.id),
      ) ?? propertyCompanies.find((company) => company.listStatus !== 'Inactive')

    if (fallback) {
      onSelectCompany({
        companyId: fallback.id,
        listStatus: fallback.listStatus ?? 'Active',
      })
    }
  }

  const handleCompanyModalConfirm = (payload: SwitchCompanySubmitPayload) => {
    if (payload.mode === 'edit' && payload.associationId) {
      setPendingAssociations((prev) =>
        prev.map((item) =>
          item.id === payload.associationId
            ? {
                ...item,
                companyId: payload.companyId,
                effectiveDate: payload.effectiveDate,
                cutOffDate: payload.cutOffDate,
                affiliations: payload.affiliations,
              }
            : item,
        ),
      )
      setSelectedPendingAssociationId(payload.associationId)
      onSelectCompany({
        companyId: payload.companyId,
        listStatus: 'Pending',
        affiliationBadges: affiliationsToBadges(payload.affiliations),
        pendingEffectiveDate: payload.effectiveDate,
        pendingTooltipId: `pending-effective-date-${payload.associationId}`,
      })
      return
    }

    const id = `pending-${Date.now()}`
    const association: CompanyAssociation = {
      id,
      companyId: payload.companyId,
      effectiveDate: payload.effectiveDate,
      cutOffDate: payload.cutOffDate,
      affiliations: payload.affiliations,
    }
    setPendingAssociations((prev) => [...prev, association])
    setSelectedPendingAssociationId(id)
    onSelectCompany({
      companyId: payload.companyId,
      listStatus: 'Pending',
      affiliationBadges: affiliationsToBadges(payload.affiliations),
      pendingEffectiveDate: payload.effectiveDate,
      pendingTooltipId: `pending-effective-date-${id}`,
    })
  }

  const withAffiliationOverride = (selection: PropertyCompanySelection): PropertyCompanySelection => {
    const override = companyAffiliationOverrides[selection.companyId]
    if (!override) return selection
    return { ...selection, affiliationBadges: affiliationsToBadges(override) }
  }

  const companyPanelProps = {
    selectedCompanyId,
    selectedPendingAssociationId,
    pendingAssociations,
    onSelectCompany: (selection: PropertyCompanySelection) => {
      setSelectedPendingAssociationId(null)
      onSelectCompany(withAffiliationOverride(selection))
    },
    onSelectPendingAssociation: (associationId: string, selection: PropertyCompanySelection) => {
      setSelectedPendingAssociationId(associationId)
      const association = pendingAssociations.find((item) => item.id === associationId)
      onSelectCompany({
        ...selection,
        affiliationBadges: association
          ? affiliationsToBadges(association.affiliations)
          : selection.affiliationBadges,
        pendingEffectiveDate: association?.effectiveDate,
        pendingTooltipId: association ? `pending-effective-date-${association.id}` : undefined,
      })
    },
    onEditPendingAssociation: (associationId: string) => {
      setEditAssociationId(associationId)
    },
    onEditCompany: (companyId: string) => {
      setEditCompanyId(companyId)
    },
  }

  const editingCompany = editCompanyId ? getPropertyCompany(editCompanyId) : null
  const editingCompanyAffiliations =
    editCompanyId && companyAffiliationOverrides[editCompanyId]
      ? companyAffiliationOverrides[editCompanyId]
      : editingCompany
        ? badgesToAffiliations(editingCompany.affiliations)
        : []

  const handleEditCompanySave = (affiliations: PropertyAffiliation[]) => {
    if (!editCompanyId) return
    setCompanyAffiliationOverrides((prev) => ({ ...prev, [editCompanyId]: affiliations }))
    const company = getPropertyCompany(editCompanyId)
    const listStatus = company.listStatus ?? 'Active'
    if (selectedCompanyId === editCompanyId && selectedPendingAssociationId === null) {
      onSelectCompany({
        companyId: editCompanyId,
        listStatus,
        affiliationBadges: affiliationsToBadges(affiliations),
      })
    }
    setEditCompanyId(null)
  }

  const toggle = (id: DetailSectionId) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col">
      <EditCompanyModal
        open={editCompanyId !== null}
        company={editingCompany}
        initialAffiliations={editingCompanyAffiliations}
        onClose={() => setEditCompanyId(null)}
        onSave={handleEditCompanySave}
      />
      <SwitchCompanyModal
        open={companyModalOpen}
        mode={editModalOpen ? 'edit' : 'switch'}
        initialCreateCompany={propertyModal === 'create-company'}
        selectedCompanyId={editingAssociation?.companyId ?? selectedCompanyId}
        initialForm={
          editingAssociation
            ? {
                companyId: editingAssociation.companyId,
                effectiveDate: editingAssociation.effectiveDate,
                cutOffDate: editingAssociation.cutOffDate,
                affiliations: editingAssociation.affiliations,
              }
            : undefined
        }
        associationId={editAssociationId ?? undefined}
        onClose={closeCompanyModal}
        onConfirm={handleCompanyModalConfirm}
        onRevertPending={handleRevertPendingAssociation}
        onFlowChange={(flow) => {
          if (flow === null) closeCompanyModal()
          else onPropertyModalChange?.(flow)
        }}
      />
      {propertyDetailSectionOrder.map((id) => {
        const expanded = openSections[id]
        const title = propertyDetailSectionTitles[id]
        return (
          <div key={id} className="px-8">
            <div className={`flex w-full items-center gap-2 ${expanded ? 'pt-3' : ''}`}>
              <button
                type="button"
                onClick={() => toggle(id)}
                className="flex min-w-0 flex-1 items-center gap-2 py-3 text-left hover:bg-[#f5f5f6]"
              >
                <SectionChevron expanded={expanded} />
                <span className="text-sm font-bold leading-5 text-[#262527]">{title}</span>
              </button>
              {expanded && id === 'company' && (
                <button
                  type="button"
                  onClick={() => onPropertyModalChange?.('switch-company')}
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-transparent px-3 py-1.5 text-xs font-medium text-primary hover:bg-[#f5f5f6]"
                >
                  <span className="relative size-4 shrink-0" aria-hidden>
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableSync} />
                  </span>
                  Switch company
                </button>
              )}
              {expanded && id === 'attachments' && (
                <button
                  type="button"
                  onClick={() => window.alert('Upload attachment (prototype)')}
                  className="shrink-0 py-3 text-sm font-medium capitalize tracking-[0.4px] text-primary"
                >
                  + Upload
                </button>
              )}
            </div>
            {expanded && sectionContent(id, companyPanelProps)}
          </div>
        )
      })}
    </div>
  )
}
