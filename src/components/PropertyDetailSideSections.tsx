import { useState } from 'react'
import detailContactMail from '../assets/detail-contact-mail.svg'
import detailRowDivider from '../assets/detail-row-divider.svg'
import detailSectionIcon from '../assets/detail-section-icon.svg'
import detailSectionIconExpanded from '../assets/detail-section-icon-expanded.svg'
import {
  attachmentsPanelData,
  franchiseAssociatedPanelData,
  propertyDetailSectionOrder,
  propertyDetailSectionTitles,
  type DetailSectionId,
  propertyDetailsPanelData,
} from '../data/propertyDetailSidePanel'

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
      <p className="w-[140px] shrink-0 text-sm leading-6 tracking-[0.25px] text-[#262527]">{label}</p>
      <div className="min-w-0 flex-1 text-sm leading-6 tracking-[0.25px] text-[#86868b]">
        {valueContent.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  )
}

function PropertyDetailsPanelContent() {
  return (
    <div className="pb-3">
      <div className="flex flex-col gap-1">
        {propertyDetailsPanelData.rows.map((row) => (
          <DetailLabelValueRow
            key={row.label}
            label={row.label}
            value={row.value}
            multiline={row.label === 'Address' || row.label === 'Name'}
          />
        ))}
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
        <p className="w-[140px] shrink-0 text-sm leading-6 tracking-[0.25px] text-[#262527]">Email</p>
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

function sectionContent(id: DetailSectionId) {
  switch (id) {
    case 'propertyDetails':
      return <PropertyDetailsPanelContent />
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

export function PropertyDetailSideSections() {
  const [openSections, setOpenSections] = useState(createDefaultOpen)

  const toggle = (id: DetailSectionId) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col">
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
            {expanded && sectionContent(id)}
          </div>
        )
      })}
    </div>
  )
}
