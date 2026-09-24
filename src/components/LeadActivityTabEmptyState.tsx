import detailEmptyClick from '../assets/detail-empty-click.svg'
import detailEmptyHandshake from '../assets/detail-empty-handshake.svg'
import detailEmptyHistory from '../assets/detail-empty-history.svg'
import detailEmptyLink from '../assets/detail-empty-link.svg'
import detailEmptyTask from '../assets/detail-empty-task.svg'
import detailPlus from '../assets/detail-plus.svg'
import notesIcon from '../assets/notes-icon.svg'
import tablePlus from '../assets/table-plus.svg'
import { mainPanelPrimaryButtonClass } from './mainPanelReadOnlyStyles'
import type { LeadActivityTab } from '../data/leadActivities'

type EmptyStateConfig = {
  title: string
  description: string
  actionLabel?: string
  icon: 'history' | 'notes' | 'link' | 'task' | 'deal' | 'handshake'
}

const emptyStateByTab: Record<LeadActivityTab, EmptyStateConfig> = {
  Deals: {
    title: 'No deals added',
    description: "You haven't added any deals yet.",
    actionLabel: 'New deal',
    icon: 'deal',
  },
  Billing: {
    title: 'No billing information',
    description: 'Billing details will appear here once a deal is active.',
    icon: 'handshake',
  },
  Contacts: {
    title: 'No contacts added',
    description: "You haven't added any contacts yet.",
    actionLabel: 'Add Contact',
    icon: 'handshake',
  },
  Notes: {
    title: 'No Notes Added',
    description: "You haven't added any notes yet.",
    actionLabel: 'Add Note',
    icon: 'notes',
  },
  Tasks: {
    title: 'No Task added',
    description: "You haven't added any tasks yet.",
    actionLabel: 'Add Task',
    icon: 'task',
  },
  Emails: {
    title: 'Connect your Email',
    description: 'Connect with your email account to start sending mails.',
    actionLabel: 'Connect Email',
    icon: 'link',
  },
  Meetings: {
    title: 'Connect your Email',
    description: 'Connect with your email account to start sending mails.',
    actionLabel: 'Connect Email',
    icon: 'link',
  },
  Questions: {
    title: 'No questions available',
    description: 'Questions for this property will appear here when configured.',
    icon: 'handshake',
  },
  Activity: {
    title: 'No activity',
    description: "You haven't performed any activity on this lead yet.",
    icon: 'history',
  },
}

const emptyStateIconClass = 'size-[79px] max-w-none'

function EmptyStateIcon({ type }: { type: EmptyStateConfig['icon'] }) {
  if (type === 'deal') {
    return <img alt="" className={emptyStateIconClass} src={detailEmptyClick} />
  }
  if (type === 'handshake') {
    return <img alt="" className={emptyStateIconClass} src={detailEmptyHandshake} />
  }
  if (type === 'notes') {
    return (
      <img
        alt=""
        className={`${emptyStateIconClass} brightness-0 opacity-[0.12]`}
        src={notesIcon}
      />
    )
  }
  if (type === 'history') {
    return <img alt="" className={emptyStateIconClass} src={detailEmptyHistory} />
  }
  if (type === 'link') {
    return <img alt="" className={emptyStateIconClass} src={detailEmptyLink} />
  }
  if (type === 'task') {
    return <img alt="" className={emptyStateIconClass} src={detailEmptyTask} />
  }
  return null
}

type LeadActivityTabEmptyStateProps = {
  tab: LeadActivityTab
  readOnly?: boolean
}

export function LeadActivityTabEmptyState({ tab, readOnly = false }: LeadActivityTabEmptyStateProps) {
  const config = emptyStateByTab[tab]
  const showPlus = config.actionLabel?.startsWith('Add') || config.actionLabel === 'New deal'

  return (
    <div className="flex min-h-[360px] flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <EmptyStateIcon type={config.icon} />
      <div className="flex max-w-[420px] flex-col gap-2">
        <p className="text-lg font-bold leading-7 text-[#262527]">{config.title}</p>
        <p className="text-sm leading-5 text-[#86868b]">{config.description}</p>
      </div>
      {config.actionLabel ? (
        <button type="button" className={`h-9 ${mainPanelPrimaryButtonClass(readOnly, 'filled')}`}>
          {showPlus ? (
            <span className="relative size-4">
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={config.actionLabel === 'New deal' ? tablePlus : detailPlus}
              />
            </span>
          ) : null}
          {config.actionLabel}
        </button>
      ) : null}
    </div>
  )
}
