import { useState } from 'react'
import activityChevron from '../assets/activity-chevron.svg'
import activityPhone from '../assets/activity-phone.svg'
import activityTask from '../assets/activity-task.svg'
import notesDelete from '../assets/notes-delete.svg'
import notesEdit from '../assets/notes-edit.svg'
import notesIcon from '../assets/notes-icon.svg'
import notesPlus from '../assets/notes-plus.svg'
import notesView from '../assets/notes-view.svg'
import questionsChevronDown from '../assets/questions-chevron-down.svg'
import tablePlus from '../assets/table-plus.svg'
import tableSearch from '../assets/table-search.svg'
import contactTableMoreVert from '../assets/contacts/table-more-vert.svg'
import paginationChevronLeft from '../assets/pagination-chevron-left.svg'
import paginationChevronRight from '../assets/pagination-chevron-right.svg'
import {
  activityFeed,
  buildJanuary2025Calendar,
  emailsFeed,
  leadActivityTabs,
  notesFeed,
  propertyContactsFeed,
  type LeadActivityTab,
  type PropertyContactRole,
} from '../data/leadActivities'
import type { PropertyCompany, PropertyCompanyListStatus } from '../data/propertyCompanies'
import { LeadActivityTabEmptyState } from './LeadActivityTabEmptyState'
import { mainPanelLinkClass, mainPanelPrimaryButtonClass } from './mainPanelReadOnlyStyles'
import { BillingAddressTabPanel, DealsTabPanel } from './PropertyDealsBillingPanels'
import { PropertyQuestionsPanel } from './PropertyQuestionsPanel'

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT']

function ActivityIcon({ type, bg }: { type?: string; bg: string }) {
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg p-3" style={{ backgroundColor: bg }}>
      {type === 'phone' ? (
        <span className="relative size-4">
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={activityPhone} />
        </span>
      ) : (
        <span className="relative size-4">
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={activityTask} />
        </span>
      )}
    </div>
  )
}

function ActivityPanel() {
  return (
    <div className="mt-6 flex flex-col gap-5 overflow-y-auto pb-6">
      <div className="flex h-6 items-center justify-center rounded-lg bg-[#f5f5f6]">
        <span className="text-sm leading-5 text-[#86868b]">July, 2023</span>
      </div>
      <div className="flex flex-col gap-6">
        {activityFeed.map((item) => (
          <div key={item.id} className="flex gap-4">
            <ActivityIcon type={item.icon} bg={item.iconBg} />
            <div className="flex min-w-0 flex-1 justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-5 text-[#262527]">{item.title}</p>
                {item.subtitle && (
                  <p className="truncate text-sm leading-5 text-[#86868b]">{item.subtitle}</p>
                )}
                {item.showSeeMore && (
                  <button type="button" className="mt-1 flex items-center gap-1 text-xs font-medium leading-[18px] text-[#86868b]">
                    See more
                    <span className="relative size-3.5">
                      <img alt="" className="absolute inset-0 block size-full max-w-none" src={activityChevron} />
                    </span>
                  </button>
                )}
              </div>
              <span className="shrink-0 text-xs leading-[18px] text-[#86868b]">{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const contactRoleBadgeStyles: Record<PropertyContactRole, { bg: string; text: string }> = {
  'Decision Maker': { bg: '#f4edfd', text: '#9747ff' },
  'End user': { bg: '#e5f6ff', text: '#146dff' },
  Billing: { bg: '#eff8ef', text: '#2e964b' },
  Blocker: { bg: '#fef0c7', text: '#f4780b' },
  Influencer: { bg: '#ffeed4', text: '#ef5c07' },
}

function ContactsPanel({ readOnly = false }: { readOnly?: boolean }) {
  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col gap-6 pb-6">
      <div className="flex w-full items-center justify-between gap-3">
        <label className="flex h-10 w-[252px] shrink-0 items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5">
          <span className="relative size-5 shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableSearch} />
          </span>
          <span className="text-sm leading-[18px] text-[#86868b]">Search by name/email</span>
        </label>
        <button
          type="button"
          onClick={() => window.alert('Add contact (prototype)')}
          className={`h-9 ${mainPanelPrimaryButtonClass(readOnly, 'filled')}`}
        >
          <span className="relative size-4">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={tablePlus} />
          </span>
          Add Contact
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="overflow-x-auto border-t border-[#e6e6e7]">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-white">
              <tr className="border-b border-[#e6e6e7]">
                {['Name', 'Email', 'Phone no.', 'Labels', ''].map((header) => (
                  <th
                    key={header || 'actions'}
                    className="whitespace-nowrap px-6 py-3 text-xs font-medium leading-[18px] text-[#5b5b5f]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {propertyContactsFeed.map((contact) => (
                <tr key={contact.id} className="border-b border-[#e6e6e7]">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        alt=""
                        className="size-6 shrink-0 rounded-full object-cover"
                        src={contact.avatarSrc}
                        width={24}
                        height={24}
                      />
                      <span className="font-medium leading-5 text-[#444446]">{contact.name}</span>
                    </div>
                  </td>
                  <td className="max-w-[220px] truncate px-6 py-4 font-medium leading-5 text-[#86868b]">
                    {contact.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium leading-5 text-[#86868b]">
                    {contact.phone}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex max-w-md flex-wrap gap-1">
                      {contact.roles.map((role) => (
                        <span
                          key={role}
                          className="rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px]"
                          style={{
                            backgroundColor: contactRoleBadgeStyles[role].bg,
                            color: contactRoleBadgeStyles[role].text,
                          }}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-2 py-4 text-right">
                    <button
                      type="button"
                      aria-label={`Actions for ${contact.name}`}
                      onClick={() => window.alert(`Contact actions: ${contact.name} (prototype)`)}
                      className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-[#f5f5f6]"
                    >
                      <span className="relative size-5">
                        <img alt="" className="absolute inset-0 block size-full max-w-none" src={contactTableMoreVert} />
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex h-14 items-center justify-end gap-6 border-t border-[#e6e6e7] px-6">
          <div className="flex items-center gap-0.5 text-sm leading-5 text-[#444446]">
            <span>Rows per page: 15</span>
            <span className="relative size-3.5">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={questionsChevronDown} />
            </span>
          </div>
          <span className="text-sm leading-5 text-[#444446]">1-15 of 12,345</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous page"
              className="flex size-8 items-center justify-center rounded-full border border-[#d0cfd2] bg-white"
            >
              <span className="relative size-5">
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={paginationChevronLeft} />
              </span>
            </button>
            <button
              type="button"
              aria-label="Next page"
              className="flex size-8 items-center justify-center rounded-full border border-[#d0cfd2] bg-white"
            >
              <span className="relative size-5">
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={paginationChevronRight} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotesPanel({ readOnly = false }: { readOnly?: boolean }) {
  return (
    <div className="mt-6 flex flex-col gap-5 overflow-y-auto pb-6">
      <div className="flex justify-end">
        <button type="button" className={`py-2 ${mainPanelPrimaryButtonClass(readOnly, 'filled')}`}>
          <span className="relative size-4">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={notesPlus} />
          </span>
          New Note
        </button>
      </div>
      <div className="flex h-6 items-center justify-center rounded-lg bg-[#f5f5f6]">
        <span className="text-sm leading-5 text-[#86868b]">June, 2023</span>
      </div>
      <div className="flex flex-col gap-6">
        {notesFeed.map((note) => (
          <div key={note.id} className="flex gap-5">
            <div className="flex min-w-0 flex-1 gap-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e6ebf6] p-3">
                <span className="relative size-4">
                  <img alt="" className="absolute inset-0 block size-full max-w-none" src={notesIcon} />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-5 text-[#262527]">{note.title}</p>
                <p className="text-xs leading-[18px] text-[#86868b]">{note.timestamp}</p>
                <p className="mt-1 text-sm leading-5 text-[#86868b]">{note.body}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-start gap-5">
              <button type="button" className="flex items-center gap-2 text-sm leading-5 text-[#5b5b5f]">
                <span className="relative size-4">
                  <img alt="" className="absolute inset-0 block size-full max-w-none" src={notesView} />
                </span>
                View Note
              </button>
              <button
                type="button"
                className={`flex items-center gap-2 text-sm leading-5 ${readOnly ? mainPanelLinkClass(true) : 'text-primary'}`}
              >
                <span className="relative size-4">
                  <img alt="" className="absolute inset-0 block size-full max-w-none" src={notesEdit} />
                </span>
                Edit
              </button>
              <button
                type="button"
                className={`flex items-center gap-1 text-sm leading-5 ${readOnly ? mainPanelLinkClass(true) : 'text-[#b32318]'}`}
              >
                <span className="relative size-4">
                  <img alt="" className="absolute inset-0 block size-full max-w-none" src={notesDelete} />
                </span>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmailsPanel({ readOnly = false }: { readOnly?: boolean }) {
  return (
    <div className="mt-6 flex flex-col gap-4 overflow-y-auto pb-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-9 min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5 py-2">
          <span className="relative size-5 shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableSearch} />
          </span>
          <span className="text-sm text-[#86868b]">Search mail</span>
        </label>
        <button type="button" className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5 text-sm text-[#262527]">
          Sent
          <span className="relative size-4">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={questionsChevronDown} />
          </span>
        </button>
        <button type="button" className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5 text-sm text-[#262527]">
          All Emails
          <span className="relative size-4">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={questionsChevronDown} />
          </span>
        </button>
        <button type="button" className={`h-9 ${mainPanelPrimaryButtonClass(readOnly, 'filled')}`}>
          <span className="relative size-4">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={tablePlus} />
          </span>
          New Email
        </button>
      </div>
      <div className="divide-y divide-[#e6e6e7] border-y border-[#e6e6e7]">
        {emailsFeed.map((email) => (
          <button
            key={email.id}
            type="button"
            className={`flex w-full gap-6 px-6 py-4 text-left ${email.shaded ? 'bg-[#f6f8fa]' : 'bg-white'}`}
          >
            <span className={`w-[180px] shrink-0 text-sm leading-5 ${email.unread ? 'font-medium text-[#262527]' : 'text-[#262527]'}`}>
              {email.sender}
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-sm leading-5">
              <span className={email.unread ? 'shrink-0 font-medium text-[#262527]' : 'shrink-0 text-[#262527]'}>
                {email.subject}
              </span>
              <span className="shrink-0 text-[#5b5b5f]">-</span>
              <span className="truncate text-[#5b5b5f]">{email.preview}</span>
            </span>
            <span className="w-16 shrink-0 text-right text-xs leading-[18px] text-[#86868b]">{email.time}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const priorityColors = {
  High: 'text-[#e43f32]',
  Medium: 'text-[#f4780b]',
  Low: 'text-primary',
}

const typeStyles = {
  'To do': 'bg-[#fef0c7] text-[#f4780b]',
  Email: 'bg-[#eff8ef] text-[#2e964b]',
  Call: 'bg-[#e5f6ff] text-primary',
  LinkedIn: 'bg-[#e5f6ff] text-primary',
}

function TasksPanel({ tasks, readOnly = false }: { tasks: PropertyCompany['tasks']; readOnly?: boolean }) {
  return (
    <div className="mt-6 flex flex-col gap-4 overflow-y-auto pb-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-9 min-w-[180px] flex-1 items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5">
          <span className="relative size-5 shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={tableSearch} />
          </span>
          <span className="text-sm text-[#86868b]">Search by title</span>
        </label>
        <div className="flex items-center gap-0.5">
          {['Type', 'Priority', 'All Tasks'].map((label) => (
            <button
              key={label}
              type="button"
              className="flex h-9 items-center gap-2 rounded-lg bg-white px-3.5 text-sm text-[#262527]"
            >
              {label}
              <span className="relative size-4">
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={questionsChevronDown} />
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e6e7] bg-white px-3.5 text-sm text-[#262527]">
          01/14/2024 - 01/18/2024
        </button>
        <button type="button" className={`h-9 ${mainPanelPrimaryButtonClass(readOnly, 'filled')}`}>
          <span className="relative size-4">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={tablePlus} />
          </span>
          New task
        </button>
      </div>
      <div className="overflow-x-auto border-y border-[#e6e6e7]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="border-b border-[#e6e6e7] bg-white">
            <tr>
              {['', 'Title', 'Task Description', 'Due Date ↓', 'Created by', 'Priority', 'Type', ''].map((h) => (
                <th key={h || 'actions'} className="whitespace-nowrap px-4 py-3 text-xs font-medium text-[#5b5b5f]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t border-[#e6e6e7]">
                <td className="px-4 py-3">
                  <span
                    className={`inline-block size-4 rounded-full border ${task.done ? 'border-[#2e964b] bg-[#2e964b]' : 'border-[#d0cfd2]'}`}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-[#262527]">{task.title}</td>
                <td className="max-w-[120px] truncate px-4 py-3 text-[#86868b]">{task.description}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[#86868b]">
                  {task.dueDate}
                  {task.overdue && <span className="ml-1 text-[#e43f32]">!</span>}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#86868b]">{task.createdBy}</td>
                <td className={`whitespace-nowrap px-4 py-3 ${priorityColors[task.priority]}`}>● {task.priority}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-2xl px-2 py-0.5 text-xs font-medium ${typeStyles[task.type]}`}>{task.type}</span>
                </td>
                <td className="px-4 py-3 text-[#86868b]">⋮</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MeetingsPanel({ readOnly = false }: { readOnly?: boolean }) {
  const [view, setView] = useState<'Month' | 'Week'>('Month')
  const days = buildJanuary2025Calendar()

  return (
    <div className="mt-6 flex flex-col gap-4 overflow-y-auto pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-[#e6e6e7] p-0.5">
          {(['Week', 'Month'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              className={`rounded-md px-4 py-1.5 text-sm ${view === mode ? 'bg-primary text-white' : 'text-[#262527]'}`}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="flex items-center gap-2 rounded-lg border border-[#e6e6e7] px-4 py-2 text-sm font-medium text-[#262527]">
            ‹ Jan 2025 ›
          </button>
          <button type="button" className={`py-2 ${mainPanelPrimaryButtonClass(readOnly, 'filled')}`}>
            <span className="relative size-4">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={tablePlus} />
            </span>
            New Meeting
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 border border-[#e6e6e7]">
        {weekDays.map((d) => (
          <div key={d} className="border-b border-r border-[#e6e6e7] bg-[#f5f5f6] px-2 py-2 text-center text-xs font-medium text-[#86868b] last:border-r-0">
            {d}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={`${day.date}-${index}`}
            className={`min-h-[88px] border-b border-r border-[#e6e6e7] p-2 last:border-r-0 ${day.isToday ? 'bg-[#e5f6ff]' : 'bg-white'}`}
          >
            <div className="mb-1 flex justify-start">
              {day.isToday ? (
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-white">{day.date}</span>
              ) : (
                <span className={`text-xs ${day.inMonth ? 'text-[#262527]' : 'text-[#86868b]'}`}>{day.date}</span>
              )}
            </div>
            <div className="space-y-0.5">
              {day.events.slice(0, 2).map((event) => (
                <p key={event} className="flex items-center gap-1 truncate text-[10px] leading-3 text-[#262527]">
                  <span className="size-1 shrink-0 rounded-full bg-primary" />
                  {event}
                </p>
              ))}
              {day.moreCount && (
                <button type="button" className="text-[10px] font-medium text-primary">
                  + {day.moreCount} more
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CompanyListStatusBadge({
  status,
  size = 'default',
}: {
  status: PropertyCompanyListStatus
  size?: 'default' | 'lg'
}) {
  const className =
    status === 'Active'
      ? 'bg-[#eff8ef] text-[#2e964b]'
      : status === 'Pending'
        ? 'bg-[#fff4d8] text-[#f6a300]'
        : 'bg-[#ececed] text-[#5b5b5f]'

  const sizeClass =
    size === 'lg'
      ? 'inline-flex h-[26px] w-fit items-center rounded-2xl px-2.5 text-xs font-medium leading-[18px]'
      : 'inline-flex w-fit rounded-2xl px-2 py-0.5 text-xs font-medium leading-[18px]'

  return <span className={`shrink-0 ${sizeClass} ${className}`}>{status}</span>
}

type PropertyLeadActivitiesProps = {
  company: PropertyCompany
  readOnly?: boolean
  showEmptyStates?: boolean
}

export function PropertyLeadActivities({
  company,
  readOnly = false,
  showEmptyStates = false,
}: PropertyLeadActivitiesProps) {
  const [activeTab, setActiveTab] = useState<LeadActivityTab>('Deals')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-[#e6e6e7]">
        <div className="flex gap-4 overflow-x-auto">
          {leadActivityTabs.map((tab) => {
            const active = tab === activeTab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`-mb-px shrink-0 border-b-2 px-1 pb-3.5 text-sm leading-5 ${
                  active ? 'border-primary font-normal text-primary' : 'border-transparent text-[#5b5b5f]'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {showEmptyStates ? (
          <LeadActivityTabEmptyState tab={activeTab} readOnly={readOnly} />
        ) : (
          <>
            {activeTab === 'Questions' && <PropertyQuestionsPanel readOnly={readOnly} />}
            {activeTab === 'Activity' && <ActivityPanel />}
            {activeTab === 'Notes' && <NotesPanel readOnly={readOnly} />}
            {activeTab === 'Emails' && <EmailsPanel readOnly={readOnly} />}
            {activeTab === 'Tasks' && <TasksPanel tasks={company.tasks} readOnly={readOnly} />}
            {activeTab === 'Meetings' && <MeetingsPanel readOnly={readOnly} />}
            {activeTab === 'Deals' && (
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-visible">
                <DealsTabPanel company={company} readOnly={readOnly} />
              </div>
            )}
            {activeTab === 'Billing' && <BillingAddressTabPanel company={company} readOnly={readOnly} />}
            {activeTab === 'Contacts' && <ContactsPanel readOnly={readOnly} />}
          </>
        )}
      </div>
    </div>
  )
}
