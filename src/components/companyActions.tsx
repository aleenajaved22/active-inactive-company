import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import detailCompanyMenu from '../assets/detail-company-menu.svg'
import {
  associationToSpaceFields,
  buildOccupants,
  buildSpaceOptions,
  spaceFieldsToAssociation,
} from '../data/companyAssociation'
import { getPropertyCompany } from '../data/propertyCompanies'
import { spaceKeyOf, type SpaceAssociation } from '../data/propertySpaceAssociations'
import type { PropertyModal } from '../prototype/screenLinks'
import { ActionMenuIcon, type ActionMenuIconName } from './ActionMenuIcon'
import { EditCompanyModal } from './EditCompanyModal'
import type { SpaceFieldsValue } from './PropertySpaceFields'
import { SwitchCompanyModal } from './SwitchCompanyModal'
import type {
  PropertyAffiliation,
  SwitchCompanyFormValues,
  SwitchCompanySubmitPayload,
} from './switchCompanyTypes'

export type ActionMenuIcon = ActionMenuIconName
export type ActionMenuItem = {
  label: string
  icon?: ActionMenuIcon
  onSelect: () => void
  /** Styled red, for an action that removes something. */
  destructive?: boolean
}

/**
 * ⋮ button with a small menu; used on company rows and on contacts.
 *
 * The menu is portalled and positioned from the button, because it is opened
 * inside scrolling tables and panels that would otherwise clip it, and flips
 * above the button when there is no room below.
 */
export function ActionMenu({ label, items }: { label: string; items: ActionMenuItem[] }) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; right: number; above: boolean } | null>(null)
  const open = position !== null

  const openMenu = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    // Two or three items fit in about 120px; flip when that would run off the bottom.
    const above = window.innerHeight - rect.bottom < 140
    setPosition({
      top: above ? rect.top - 4 : rect.bottom + 4,
      right: window.innerWidth - rect.right,
      above,
    })
  }
  const close = () => setPosition(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return
      close()
    }
    const closeOnKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnKey)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      document.removeEventListener('keydown', closeOnKey)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  if (items.length === 0) return null

  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => (open ? close() : openMenu())}
        className="flex size-7 items-center justify-center rounded-lg hover:bg-[#e6e6e7]/60"
      >
        <img alt="" className="size-4 max-w-none" src={detailCompanyMenu} />
      </button>
      {position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: 'fixed',
              right: position.right,
              top: position.top,
              transform: position.above ? 'translateY(-100%)' : undefined,
              zIndex: 70,
            }}
            className="min-w-[160px] rounded-lg border border-[#e6e6e7] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  close()
                  item.onSelect()
                }}
                className={`flex w-full items-center gap-2 whitespace-nowrap px-3 py-2 text-left text-sm leading-5 hover:bg-[#f5f5f6] ${
                  item.destructive ? 'text-[#b32318]' : 'text-[#262527]'
                }`}
              >
                {item.icon && (
                  <ActionMenuIcon icon={item.icon} className={item.destructive ? 'text-[#b32318]' : 'text-[#6a6a70]'} />
                )}
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
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
  openAddCompany: () => void
  dialogs: ReactNode
} {
  const [switchSpaceKey, setSwitchSpaceKey] = useState<string | undefined>()
  const [switchTargetCompanyId, setSwitchTargetCompanyId] = useState<string | undefined>()
  const [editPendingId, setEditPendingId] = useState<string | null>(null)
  const [editAffiliationsId, setEditAffiliationsId] = useState<string | null>(null)

  const spaceOptions = useMemo(() => buildSpaceOptions(associations), [associations])
  // Who holds what on the property, so occupancy clashes can name the company.
  const occupants = useMemo(() => buildOccupants(associations), [associations])
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
            assignee: editingPending.assignee,
            supervisor: editingPending.supervisor,
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
                assignee: payload.assignee,
                supervisor: payload.supervisor,
              }
            : item,
        ),
      )
      onSelectAssociation(payload.associationId)
      return
    }

    const [spaceType, spaceNumber = ''] = payload.spaceKey.split('|') as [
      SpaceAssociation['spaceType'],
      string,
    ]
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
        assignee: payload.assignee,
        supervisor: payload.supervisor,
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

  const handleSaveCompany = ({
    affiliations,
    endDate,
    spaceFields,
    assignee,
    supervisor,
  }: {
    affiliations: PropertyAffiliation[]
    endDate: string
    spaceFields: SpaceFieldsValue
    assignee: string
    supervisor?: string
  }) => {
    if (!editAffiliationsId) return
    onAssociationsChange(
      associations.map((item) =>
        item.id === editAffiliationsId
          ? {
              ...item,
              affiliations,
              endDate,
              assignee,
              supervisor,
              ...spaceFieldsToAssociation(spaceFields),
            }
          : item,
      ),
    )
    setEditAffiliationsId(null)
  }

  const menuItemsFor = (association: SpaceAssociation): ActionMenuItem[] => {
    if (association.status === 'Active') {
      return [
        { label: 'Switch company', icon: 'switch', onSelect: () => openSwitch(spaceKeyOf(association)) },
        { label: 'Edit company', icon: 'edit', onSelect: () => setEditAffiliationsId(association.id) },
      ]
    }
    if (association.status === 'Pending') {
      return [{ label: 'Edit switch', icon: 'edit', onSelect: () => setEditPendingId(association.id) }]
    }
    // Bring a past company back onto the space it used to hold.
    return [
      {
        label: 'Make active',
        icon: 'activate',
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
        occupants={occupants}
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
        // Remounts per company, so the fields seed from that company's record.
        key={editAffiliationsId ?? 'none'}
        open={editingAffiliations !== undefined}
        company={editingAffiliations ? getPropertyCompany(editingAffiliations.companyId) : null}
        initialAffiliations={editingAffiliations?.affiliations ?? []}
        initialEndDate={editingAffiliations?.endDate ?? ''}
        initialSpaceFields={
          editingAffiliations
            ? (associationToSpaceFields(editingAffiliations) as SpaceFieldsValue)
            : undefined
        }
        occupants={occupants}
        initialAssignee={editingAffiliations?.assignee ?? ''}
        initialSupervisor={editingAffiliations?.supervisor}
        effectiveDate={editingAffiliations?.effectiveDate ?? ''}
        nextCompany={editingNextCompany}
        onClose={() => setEditAffiliationsId(null)}
        onSave={handleSaveCompany}
      />
    </>
  )

  // Adding a company reuses the switch flow with no space preselected, so the user picks the space.
  const openAddCompany = () => openSwitch()

  return { menuItemsFor, openAddCompany, dialogs }
}
