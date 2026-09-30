import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import detailCompanyMenu from '../assets/detail-company-menu.svg'
import { getPropertyCompany } from '../data/propertyCompanies'
import { spaceKeyOf, spaceLabelOf, type SpaceAssociation } from '../data/propertySpaceAssociations'
import type { PropertyModal } from '../prototype/screenLinks'
import { EditCompanyModal } from './EditCompanyModal'
import { SwitchCompanyModal } from './SwitchCompanyModal'
import type {
  PropertyAffiliation,
  SwitchCompanyFormValues,
  SwitchCompanySubmitPayload,
  SwitchSpaceOption,
} from './switchCompanyTypes'

export type ActionMenuItem = { label: string; onSelect: () => void }

/** ⋮ button with a small menu; used on company rows and in the company header. */
export function ActionMenu({ label, items }: { label: string; items: ActionMenuItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [open])

  if (items.length === 0) return null

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
        className="flex size-7 items-center justify-center rounded-lg hover:bg-[#e6e6e7]/60"
      >
        <img alt="" className="size-4 max-w-none" src={detailCompanyMenu} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 min-w-[160px] rounded-lg border border-[#e6e6e7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
              className="w-full whitespace-nowrap px-3 py-2 text-left text-sm leading-5 text-[#262527] hover:bg-[#f5f5f6]"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Builds one switch target per space, with its current and pending company. */
function buildSpaceOptions(associations: SpaceAssociation[]): SwitchSpaceOption[] {
  const options = new Map<string, SwitchSpaceOption>()
  for (const association of associations) {
    const key = spaceKeyOf(association)
    const option = options.get(key) ?? { key, label: spaceLabelOf(association) }
    const companyName = getPropertyCompany(association.companyId).name
    if (association.status === 'Active') {
      option.currentCompanyId = association.companyId
      option.currentCompanyName = companyName
      option.currentContractEndDate = association.endDate || undefined
    } else if (association.status === 'Pending') {
      option.pendingAssociationId = association.id
      option.pendingCompanyName = companyName
    }
    options.set(key, option)
  }
  return [...options.values()].sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }))
}

type UseCompanyActionsOptions = {
  associations: SpaceAssociation[]
  onAssociationsChange: (next: SpaceAssociation[]) => void
  onSelectAssociation: (id: string) => void
  propertyModal?: PropertyModal
  onPropertyModalChange?: (modal?: PropertyModal) => void
}

/**
 * Switch, edit-switch and edit-affiliation actions for a property's companies.
 * Returns the menu items for any association plus the dialogs to render once.
 */
export function useCompanyActions({
  associations,
  onAssociationsChange,
  onSelectAssociation,
  propertyModal,
  onPropertyModalChange,
}: UseCompanyActionsOptions): {
  menuItemsFor: (association: SpaceAssociation) => ActionMenuItem[]
  dialogs: ReactNode
} {
  const [switchSpaceKey, setSwitchSpaceKey] = useState<string | undefined>()
  const [switchTargetCompanyId, setSwitchTargetCompanyId] = useState<string | undefined>()
  const [editPendingId, setEditPendingId] = useState<string | null>(null)
  const [editAffiliationsId, setEditAffiliationsId] = useState<string | null>(null)

  const spaceOptions = useMemo(() => buildSpaceOptions(associations), [associations])
  const editingPending = associations.find((item) => item.id === editPendingId)
  const editingAffiliations = associations.find((item) => item.id === editAffiliationsId)
  const editingNextPending =
    editingAffiliations?.status === 'Active'
      ? associations.find(
          (item) => item.status === 'Pending' && spaceKeyOf(item) === spaceKeyOf(editingAffiliations),
        )
      : undefined
  const editingNextCompany = editingNextPending
    ? { name: getPropertyCompany(editingNextPending.companyId).name, effectiveDate: editingNextPending.effectiveDate }
    : undefined

  const pendingInitialForm = useMemo<SwitchCompanyFormValues | undefined>(
    () =>
      editingPending
        ? {
            spaceKey: spaceKeyOf(editingPending),
            companyId: editingPending.companyId,
            effectiveDate: editingPending.effectiveDate,
            cutOffDate: editingPending.endDate,
            affiliations: editingPending.affiliations,
          }
        : undefined,
    [editingPending],
  )

  const switchModalOpen = propertyModal !== undefined || editPendingId !== null

  const openSwitch = (spaceKey?: string, targetCompanyId?: string) => {
    setSwitchSpaceKey(spaceKey)
    setSwitchTargetCompanyId(targetCompanyId)
    onPropertyModalChange?.('switch-company')
  }

  const closeSwitch = () => {
    setEditPendingId(null)
    setSwitchSpaceKey(undefined)
    setSwitchTargetCompanyId(undefined)
    onPropertyModalChange?.(undefined)
  }

  const handleConfirm = (payload: SwitchCompanySubmitPayload) => {
    if (payload.mode === 'edit' && payload.associationId) {
      onAssociationsChange(
        associations.map((item) =>
          item.id === payload.associationId
            ? {
                ...item,
                companyId: payload.companyId,
                effectiveDate: payload.effectiveDate,
                endDate: payload.cutOffDate,
                affiliations: payload.affiliations,
              }
            : item,
        ),
      )
      onSelectAssociation(payload.associationId)
      return
    }

    const [spaceType, spaceNumber] = payload.spaceKey.split('|') as [SpaceAssociation['spaceType'], string]
    const id = `pending-${Date.now()}`
    onAssociationsChange([
      ...associations,
      {
        id,
        spaceType,
        spaceNumber,
        companyId: payload.companyId,
        status: 'Pending',
        effectiveDate: payload.effectiveDate,
        endDate: payload.cutOffDate,
        affiliations: payload.affiliations,
      },
    ])
    onSelectAssociation(id)
  }

  const handleRevert = (associationId: string) => {
    const reverted = associations.find((item) => item.id === associationId)
    const next = associations.filter((item) => item.id !== associationId)
    onAssociationsChange(next)
    // Return to the company that stays active on the same space.
    const fallback =
      next.find((item) => item.status === 'Active' && reverted && spaceKeyOf(item) === spaceKeyOf(reverted)) ??
      next.find((item) => item.status === 'Active') ??
      next[0]
    if (fallback) onSelectAssociation(fallback.id)
  }

  const handleSaveCompany = ({ affiliations, endDate }: { affiliations: PropertyAffiliation[]; endDate: string }) => {
    if (!editAffiliationsId) return
    onAssociationsChange(
      associations.map((item) => (item.id === editAffiliationsId ? { ...item, affiliations, endDate } : item)),
    )
    setEditAffiliationsId(null)
  }

  const menuItemsFor = (association: SpaceAssociation): ActionMenuItem[] => {
    if (association.status === 'Active') {
      return [
        { label: 'Switch company', onSelect: () => openSwitch(spaceKeyOf(association)) },
        { label: 'Edit company', onSelect: () => setEditAffiliationsId(association.id) },
      ]
    }
    if (association.status === 'Pending') {
      return [{ label: 'Edit switch', onSelect: () => setEditPendingId(association.id) }]
    }
    // Bring a past company back onto the space it used to hold.
    return [
      {
        label: 'Switch to this company',
        onSelect: () => openSwitch(spaceKeyOf(association), association.companyId),
      },
    ]
  }

  const dialogs = (
    <>
      <SwitchCompanyModal
        open={switchModalOpen}
        mode={editingPending ? 'edit' : 'switch'}
        spaces={spaceOptions}
        initialSpaceKey={editingPending ? undefined : switchSpaceKey}
        targetCompanyId={editingPending ? undefined : switchTargetCompanyId}
        initialForm={pendingInitialForm}
        initialCreateCompany={propertyModal === 'create-company'}
        associationId={editPendingId ?? undefined}
        onClose={closeSwitch}
        onConfirm={handleConfirm}
        onRevertPending={handleRevert}
        onFlowChange={(flow) => {
          if (flow === null) closeSwitch()
          else onPropertyModalChange?.(flow)
        }}
      />
      <EditCompanyModal
        open={editingAffiliations !== undefined}
        company={editingAffiliations ? getPropertyCompany(editingAffiliations.companyId) : null}
        initialAffiliations={editingAffiliations?.affiliations ?? []}
        initialEndDate={editingAffiliations?.endDate ?? ''}
        effectiveDate={editingAffiliations?.effectiveDate ?? ''}
        nextCompany={editingNextCompany}
        onClose={() => setEditAffiliationsId(null)}
        onSave={handleSaveCompany}
      />
    </>
  )

  return { menuItemsFor, dialogs }
}
