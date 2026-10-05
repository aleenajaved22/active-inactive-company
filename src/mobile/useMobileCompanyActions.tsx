import { useMemo, useState, type ReactNode } from 'react'
import type { SwitchCompanyFormValues, SwitchCompanySubmitPayload } from '../components/switchCompanyTypes'
import {
  associationToSpaceFields,
  buildOccupants,
  buildSpaceOptions,
  spaceFieldsToAssociation,
} from '../data/companyAssociation'
import type { OccupancyFieldsValue } from '../data/propertyOccupancy'
import { getPropertyCompany } from '../data/propertyCompanies'
import { spaceKeyOf, spaceLabelOf, type SpaceAssociation } from '../data/propertySpaceAssociations'
import type { PropertyAffiliation } from '../components/switchCompanyTypes'
import { MobileEditCompanySheet } from './MobileEditCompanySheet'
import { MobileActionSheet, type MobileActionItem } from './MobileSheet'
import { MobileCreateCompanyScreen } from './MobileCreateCompanyScreen'
import { MobileSwitchCompanyScreen, type SwitchCompanyMode } from './MobileSwitchCompanyScreen'

type Flow =
  | { kind: 'none' }
  | {
      kind: 'switch'
      mode: SwitchCompanyMode
      spaceKey?: string
      targetCompanyId?: string
      initialForm?: SwitchCompanyFormValues
      associationId?: string
    }

/**
 * Switch, add, make-active and edit-switch flows for a property's companies —
 * the mobile counterpart of the web app's useCompanyActions.
 */
export function useMobileCompanyActions({
  associations,
  onAssociationsChange,
  onSelectAssociation,
  onFlowOpen,
}: {
  associations: SpaceAssociation[]
  onAssociationsChange: (next: SpaceAssociation[]) => void
  onSelectAssociation: (id: string) => void
  /** Lets the host dismiss the companies drawer once a flow takes over. */
  onFlowOpen?: () => void
}): {
  actionsFor: (association: SpaceAssociation) => MobileActionItem[]
  openAddCompany: () => void
  showActions: (association: SpaceAssociation, items: MobileActionItem[]) => void
  screens: ReactNode
} {
  const [flow, setFlow] = useState<Flow>({ kind: 'none' })
  const [createCompanyOpen, setCreateCompanyOpen] = useState(false)
  const [editAffiliationsId, setEditAffiliationsId] = useState<string | null>(null)
  const [actionSheet, setActionSheet] = useState<{ title: string; items: MobileActionItem[] } | null>(
    null,
  )

  const spaces = useMemo(() => buildSpaceOptions(associations), [associations])
  // Who holds what on the property, so occupancy clashes can name the company.
  const occupants = useMemo(() => buildOccupants(associations), [associations])

  const openFlow = (next: Flow) => {
    onFlowOpen?.()
    setFlow(next)
  }

  const closeFlow = () => setFlow({ kind: 'none' })

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
      next.find(
        (item) => item.status === 'Active' && reverted && spaceKeyOf(item) === spaceKeyOf(reverted),
      ) ??
      next.find((item) => item.status === 'Active') ??
      next[0]
    if (fallback) onSelectAssociation(fallback.id)
  }

  const handleSaveCompany = ({
    affiliations: next,
    endDate,
    spaceFields,
    assignee,
    supervisor,
  }: {
    affiliations: PropertyAffiliation[]
    endDate: string
    spaceFields: OccupancyFieldsValue
    assignee: string
    supervisor?: string
  }) => {
    if (!editAffiliationsId) return
    onAssociationsChange(
      associations.map((item) =>
        item.id === editAffiliationsId
          ? {
              ...item,
              affiliations: next,
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

  const editingAffiliations = associations.find((item) => item.id === editAffiliationsId)
  // An active company's end date must land before the pending company takes over.
  const editingNextPending =
    editingAffiliations?.status === 'Active'
      ? associations.find(
          (item) =>
            item.status === 'Pending' && spaceKeyOf(item) === spaceKeyOf(editingAffiliations),
        )
      : undefined

  const actionsFor = (association: SpaceAssociation): MobileActionItem[] => {
    if (association.status === 'Active') {
      return [
        {
          label: 'Switch company',
          onSelect: () =>
            openFlow({ kind: 'switch', mode: 'switch', spaceKey: spaceKeyOf(association) }),
        },
        {
          label: 'Edit company',
          onSelect: () => {
            onFlowOpen?.()
            setEditAffiliationsId(association.id)
          },
        },
      ]
    }
    if (association.status === 'Pending') {
      return [
        {
          label: 'Edit switch',
          onSelect: () =>
            openFlow({
              kind: 'switch',
              mode: 'edit',
              associationId: association.id,
              initialForm: {
                spaceKey: spaceKeyOf(association),
                companyId: association.companyId,
                effectiveDate: association.effectiveDate,
                cutOffDate: association.endDate,
                affiliations: association.affiliations,
                assignee: association.assignee,
                supervisor: association.supervisor,
              },
            }),
        },
      ]
    }
    // Bring a past company back onto the space it used to hold.
    return [
      {
        label: 'Make active',
        onSelect: () =>
          openFlow({
            kind: 'switch',
            mode: 'make-active',
            spaceKey: spaceKeyOf(association),
            targetCompanyId: association.companyId,
          }),
      },
    ]
  }

  const screens = (
    <>
      {flow.kind === 'switch' && (
        <MobileSwitchCompanyScreen
          mode={flow.mode}
          spaces={spaces}
          occupants={occupants}
          initialSpaceKey={flow.spaceKey}
          targetCompanyId={flow.targetCompanyId}
          initialForm={flow.initialForm}
          associationId={flow.associationId}
          onClose={closeFlow}
          onConfirm={handleConfirm}
          onRevertPending={handleRevert}
          onCreateCompany={() => setCreateCompanyOpen(true)}
        />
      )}

      {createCompanyOpen && (
        <MobileCreateCompanyScreen
          onClose={() => setCreateCompanyOpen(false)}
          onCreate={() => {
            window.alert('Company created (prototype)')
            setCreateCompanyOpen(false)
          }}
        />
      )}

      {editingAffiliations && (
        <MobileEditCompanySheet
          open
          companyName={getPropertyCompany(editingAffiliations.companyId).name}
          companyId={editingAffiliations.companyId}
          initialAffiliations={editingAffiliations.affiliations}
          initialEndDate={editingAffiliations.endDate}
          initialSpaceFields={associationToSpaceFields(editingAffiliations)}
          occupants={occupants}
          initialAssignee={editingAffiliations.assignee}
          initialSupervisor={editingAffiliations.supervisor}
          effectiveDate={editingAffiliations.effectiveDate}
          nextCompany={
            editingNextPending
              ? {
                  name: getPropertyCompany(editingNextPending.companyId).name,
                  effectiveDate: editingNextPending.effectiveDate,
                }
              : undefined
          }
          onClose={() => setEditAffiliationsId(null)}
          onSave={handleSaveCompany}
        />
      )}

      <MobileActionSheet
        open={actionSheet !== null}
        title={actionSheet?.title}
        items={actionSheet?.items ?? []}
        onClose={() => setActionSheet(null)}
      />
    </>
  )

  return {
    actionsFor,
    // Adding reuses the switch flow with no space preselected, so the user picks the space.
    openAddCompany: () => openFlow({ kind: 'switch', mode: 'add' }),
    showActions: (association, items) =>
      setActionSheet({
        title: `${getPropertyCompany(association.companyId).name} · ${spaceLabelOf(association)}`,
        items,
      }),
    screens,
  }
}
