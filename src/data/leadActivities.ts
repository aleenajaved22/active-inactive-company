import contactAvatarAleena from '../assets/contacts/avatar-aleena.png'
import contactAvatarDarrell from '../assets/contacts/avatar-darrell.png'
import contactAvatarJohn from '../assets/contacts/avatar-john.png'
import contactAvatarSavannah from '../assets/contacts/avatar-savannah.png'

export const leadActivityTabs = [
  'Deals',
  'Billing',
  'Contacts',
  'Notes',
  'Tasks',
  'Emails',
  'Meetings',
  'Questions',
  'Activity',
] as const
export type LeadActivityTab = (typeof leadActivityTabs)[number]

export type ActivityFeedItem = {
  id: string
  iconBg: string
  icon?: 'task' | 'phone' | 'mail' | 'note' | 'meeting'
  title: string
  subtitle?: string
  showSeeMore?: boolean
  timestamp: string
}

export type NoteItem = {
  id: string
  title: string
  timestamp: string
  body: string
}

export type EmailItem = {
  id: string
  sender: string
  subject: string
  preview: string
  time: string
  unread?: boolean
  shaded?: boolean
}

export type TaskItem = {
  id: string
  done: boolean
  title: string
  description: string
  dueDate: string
  overdue?: boolean
  createdBy: string
  priority: 'High' | 'Medium' | 'Low'
  type: 'To do' | 'Email' | 'Call' | 'LinkedIn'
}

export type MeetingDay = {
  date: number
  inMonth: boolean
  isToday?: boolean
  events: string[]
  moreCount?: number
}

export const activityFeed: ActivityFeedItem[] = [
  {
    id: '1',
    iconBg: '#fef0c7',
    icon: 'task',
    title: 'Follow-up added!',
    subtitle: 'Follow has been added',
    timestamp: '12-21-2023 02:45 AM',
  },
  {
    id: '2',
    iconBg: '#fbeeed',
    icon: 'mail',
    title: 'Email sent by John Doe',
    subtitle: 'Contract Sign Meeting - Expressed interest in attending a product demo...',
    showSeeMore: true,
    timestamp: '12-21-2023 02:45 AM',
  },
  {
    id: '3',
    iconBg: '#e6ebf6',
    icon: 'note',
    title: 'Note added by John Doe',
    subtitle: 'Expressed interest in attending a product demo and exploring pricing options...',
    showSeeMore: true,
    timestamp: '12-21-2023 02:45 AM',
  },
  {
    id: '4',
    iconBg: '#f6ecfe',
    icon: 'meeting',
    title: 'Logged Meeting by John Doe',
    subtitle: 'Meeting scheduled to review contract terms and pricing structure...',
    showSeeMore: true,
    timestamp: '12-21-2023 02:45 AM',
  },
  {
    id: '5',
    iconBg: '#eff8ef',
    icon: 'task',
    title: 'Logged Task by Aleena',
    subtitle: 'Prepare follow-up materials for the Costco Wholesale location visit...',
    showSeeMore: true,
    timestamp: '12-21-2023 02:45 AM',
  },
  {
    id: '6',
    iconBg: '#e5f6ff',
    icon: 'phone',
    title: 'Logged Call by Aleena',
    subtitle: 'The client showed enthusiasm for a property tour and requested detailed pricing information...',
    showSeeMore: true,
    timestamp: '12-21-2023 02:45 AM',
  },
  {
    id: '7',
    iconBg: '#fef0c7',
    icon: 'task',
    title: 'First Visit by Mike Ross (Intern)',
    subtitle: 'Arrived at location but unable to meet with the location representative.',
    showSeeMore: true,
    timestamp: '12-21-2023 02:45 AM',
  },
  {
    id: '8',
    iconBg: '#fef0c7',
    icon: 'task',
    title: 'Location synced from Hubspot',
    subtitle: 'Costco Wholesale - Boys Town location synced from hubspot',
    showSeeMore: true,
    timestamp: '12-21-2023 02:45 AM',
  },
]

export type PropertyContactRole =
  | 'Decision Maker'
  | 'End user'
  | 'Billing'
  | 'Blocker'
  | 'Influencer'

export type PropertyContactItem = {
  id: string
  name: string
  email: string
  phone: string
  avatarSrc: string
  roles: PropertyContactRole[]
}

export const propertyContactsFeed: PropertyContactItem[] = [
  {
    id: 'c1',
    name: 'Aleena Javed',
    email: 'aleena@teamsignal.com',
    phone: '773-159-3746',
    avatarSrc: contactAvatarAleena,
    roles: ['Decision Maker', 'End user', 'Billing', 'Blocker'],
  },
  {
    id: 'c2',
    name: 'John Doe',
    email: 'john@teamsignal.com',
    phone: '721-763-5810',
    avatarSrc: contactAvatarJohn,
    roles: ['Decision Maker', 'Billing'],
  },
  {
    id: 'c3',
    name: 'Savannah Nguyen',
    email: 'savannah@teamsignal.com',
    phone: '717-482-9307',
    avatarSrc: contactAvatarSavannah,
    roles: ['Billing'],
  },
  {
    id: 'c4',
    name: 'Darrell Steward',
    email: 'darrell@teamsignal.com',
    phone: '719-294-6501',
    avatarSrc: contactAvatarDarrell,
    roles: ['End user', 'Billing'],
  },
]

export const notesFeed: NoteItem[] = [
  {
    id: '1',
    title: 'Note by Mike Ross',
    timestamp: '12-21-2023 02:45 AM',
    body: 'Expressed interest in attending a product demo and exploring pricing options. Requested additional information on data encryption capabilities and compliance standards.',
  },
  {
    id: '2',
    title: 'Meeting with Client',
    timestamp: '12-21-2023 02:45 AM',
    body: 'Expressed interest in attending a product demo and exploring pricing options. Requested additional information on data encryption capabilities and compliance standards.',
  },
  {
    id: '3',
    title: 'Note by Mike Ross',
    timestamp: '12-21-2023 02:45 AM',
    body: 'Expressed interest in attending a product demo and exploring pricing options. Requested additional information on data encryption capabilities and compliance standards.',
  },
]

export const emailsFeed: EmailItem[] = [
  {
    id: '1',
    sender: 'Ethan Brooks',
    subject: 'Contract Sign for Costco',
    preview: 'Expressed interest in attending a product demo and exploring pricing options.',
    time: '5:56 PM',
    unread: true,
  },
  {
    id: '2',
    sender: 'Aleena Javed',
    subject: 'Exciting Updates Coming Your Way!',
    preview: "I'm interested in learning more about your security services.",
    time: '4:56 PM',
    shaded: true,
  },
  {
    id: '3',
    sender: 'Ahmad',
    subject: '(no subject)',
    preview: 'Expressed interest in attending a product demo and exploring pricing options.',
    time: '3:56 PM',
  },
  {
    id: '4',
    sender: 'Ahmad',
    subject: '(no subject)',
    preview: 'Expressed interest in attending a product demo and exploring pricing options.',
    time: '2:56 PM',
    shaded: true,
  },
  {
    id: '5',
    sender: 'Ethan Brooks',
    subject: 'Contract Sign for Costco',
    preview: 'Expressed interest in attending a product demo and exploring pricing options.',
    time: '1:56 PM',
    unread: true,
  },
  {
    id: '6',
    sender: 'Aleena Javed',
    subject: 'Exciting Updates Coming Your Way!',
    preview: "I'm interested in learning more about your security services.",
    time: 'May 24',
    shaded: true,
  },
]

export const tasksFeed: TaskItem[] = [
  {
    id: '1',
    done: false,
    title: 'Meeting',
    description: 'Upcoming Ac...',
    dueDate: '01/18/2024',
    overdue: true,
    createdBy: 'Hubspot',
    priority: 'High',
    type: 'To do',
  },
  {
    id: '2',
    done: true,
    title: 'Contract Sign',
    description: 'Engaging in a...',
    dueDate: '01/17/2024',
    createdBy: 'Aleena Javed',
    priority: 'Medium',
    type: 'Email',
  },
  {
    id: '3',
    done: false,
    title: 'Follow Up',
    description: 'Schedule a...',
    dueDate: '01/16/2024',
    createdBy: 'Jane Cooper',
    priority: 'Low',
    type: 'Call',
  },
  {
    id: '4',
    done: false,
    title: 'LinkedIn Outreach',
    description: 'Connect with...',
    dueDate: '01/15/2024',
    createdBy: 'Aleena Javed',
    priority: 'Medium',
    type: 'LinkedIn',
  },
]

const jan2025Events: Record<number, { events: string[]; moreCount?: number }> = {
  2: { events: ['Contract Sign Meeting', 'Proposal', 'Project Overview'], moreCount: 5 },
  3: { events: ['Contract Sign Meeting', 'Proposal'] },
  6: { events: ['Contract Sign Meeting'] },
  9: { events: ['Proposal', 'Project Overview'] },
  12: { events: ['Contract Sign Meeting'] },
  15: { events: ['Project Overview'] },
  19: { events: ['Contract Sign Meeting', 'Proposal'] },
  22: { events: ['Contract Sign Meeting'] },
  24: { events: ['Proposal'] },
  27: { events: ['Project Overview', 'Contract Sign Meeting'] },
}

export function buildJanuary2025Calendar(): MeetingDay[] {
  const days: MeetingDay[] = []
  // Jan 2025 starts on Wednesday — pad with late Dec
  for (let i = 29; i <= 31; i++) {
    days.push({ date: i, inMonth: false, events: [] })
  }
  for (let d = 1; d <= 31; d++) {
    const meta = jan2025Events[d]
    days.push({
      date: d,
      inMonth: true,
      isToday: d === 19,
      events: meta?.events ?? [],
      moreCount: meta?.moreCount,
    })
  }
  // Feb padding to fill grid
  for (let d = 1; d <= 8; d++) {
    days.push({
      date: d,
      inMonth: false,
      events: d === 2 || d === 3 ? ['Contract Sign Meeting'] : [],
    })
  }
  return days
}
