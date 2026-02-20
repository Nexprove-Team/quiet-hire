import type { PublicJobListItem, TopCompany } from '@/actions/jobs'

export interface PublicJob {
  id: string
  date: string
  company: string
  title: string
  logoColor: string
  logoLetter: string
  tags: string[]
  salary: string
  salaryNumeric: number
  location: string
  locationType: 'remote' | 'onsite' | 'hybrid'
  experienceLevel: string
  workingSchedule: string[]
  employmentType: string[]
  cardColor: string
  dateBadgeColor: string
  saved: boolean
}

export interface Recruiter {
  id: string
  name: string
  logoColor: string
  logoLetter: string
  jobCount: number
}

const CARD_STYLES = [
  {
    cardColor: 'bg-orange-50/70',
    dateBadgeColor: 'bg-orange-100 text-orange-700',
  },
  {
    cardColor: 'bg-emerald-50/70',
    dateBadgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    cardColor: 'bg-purple-50/70',
    dateBadgeColor: 'bg-purple-100 text-purple-700',
  },
  { cardColor: 'bg-sky-50/70', dateBadgeColor: 'bg-sky-100 text-sky-700' },
  { cardColor: 'bg-rose-50/70', dateBadgeColor: 'bg-rose-100 text-rose-700' },
  { cardColor: 'bg-zinc-50/70', dateBadgeColor: 'bg-zinc-100 text-zinc-600' },
  {
    cardColor: 'bg-amber-50/70',
    dateBadgeColor: 'bg-amber-100 text-amber-700',
  },
  { cardColor: 'bg-teal-50/70', dateBadgeColor: 'bg-teal-100 text-teal-700' },
  {
    cardColor: 'bg-indigo-50/70',
    dateBadgeColor: 'bg-indigo-100 text-indigo-700',
  },
]

const LOGO_COLORS = [
  'bg-blue-500',
  'bg-rose-500',
  'bg-indigo-600',
  'bg-green-600',
  'bg-violet-600',
  'bg-sky-500',
  'bg-pink-500',
  'bg-amber-600',
  'bg-teal-600',
  'bg-red-600',
  'bg-zinc-800',
  'bg-purple-700',
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export const WORKING_SCHEDULE_OPTIONS = [
  { label: 'Full time', defaultChecked: true },
  { label: 'Part time', defaultChecked: true },
  { label: 'Internship', defaultChecked: false },
  { label: 'Project work', defaultChecked: false },
  { label: 'Volunteering', defaultChecked: false },
]

export const EMPLOYMENT_TYPE_OPTIONS = [
  { label: 'Full day', defaultChecked: true },
  { label: 'Flexible schedule', defaultChecked: true },
  { label: 'Shift work', defaultChecked: false },
  { label: 'Distant work', defaultChecked: true },
  { label: 'Shift method', defaultChecked: false },
]


export const EXPERIENCE_MAP: Record<string, string[]> = {
  entry: ['Junior level', 'Entry level'],
  mid: ['Middle level', 'Mid level'],
  senior: ['Senior level'],
  lead: ['Lead level'],
}

const EMPLOYMENT_TYPE_LABELS: Record<string, { schedule: string; type: string[] }> = {
  full_time: { schedule: 'Full time', type: ['Full day'] },
  part_time: { schedule: 'Part time', type: ['Flexible schedule'] },
  contract: { schedule: 'Project work', type: ['Distant work'] },
  internship: { schedule: 'Internship', type: ['Full day'] },
}

const EXPERIENCE_LABELS: Record<string, string> = {
  entry: 'Entry level',
  mid: 'Mid level',
  senior: 'Senior level',
  lead: 'Lead level',
  executive: 'Executive level',
}

function formatDate(date: Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatSalary(
  min: number | null,
  max: number | null,
  currency: string
): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n)

  if (min && max) return `${fmt(min)} - ${fmt(max)}`
  if (max) return `Up to ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return 'Competitive'
}

export function toDisplayJob(
  item: PublicJobListItem,
  index: number
): PublicJob {
  const companyName = item.company?.name ?? 'Unknown'
  const hash = hashString(companyName)
  const empInfo = EMPLOYMENT_TYPE_LABELS[item.employmentType] ?? {
    schedule: 'Full time',
    type: ['Full day'],
  }
  const expLabel = EXPERIENCE_LABELS[item.experienceLevel] ?? 'Mid level'

  const tags = [
    empInfo.schedule,
    expLabel,
    ...item.skills.slice(0, 2),
  ]

  if (item.isRemote) tags.push('Remote')

  const style = CARD_STYLES[index % CARD_STYLES.length]!

  return {
    id: item.id,
    date: formatDate(item.createdAt),
    company: companyName,
    title: item.title,
    logoColor: LOGO_COLORS[hash % LOGO_COLORS.length]!,
    logoLetter: companyName.charAt(0).toUpperCase(),
    tags,
    salary: formatSalary(item.salaryMin, item.salaryMax, item.salaryCurrency),
    salaryNumeric: item.salaryMax ?? item.salaryMin ?? 0,
    location: item.location ?? (item.isRemote ? 'Remote' : 'Unknown'),
    locationType: item.isRemote ? 'remote' : 'onsite',
    experienceLevel: item.experienceLevel,
    workingSchedule: [empInfo.schedule],
    employmentType: item.isRemote
      ? [...empInfo.type, 'Distant work']
      : empInfo.type,
    ...style,
    saved: false,
  }
}

export function toDisplayRecruiter(company: TopCompany): Recruiter {
  const hash = hashString(company.name)
  return {
    id: company.id,
    name: company.name,
    logoColor: LOGO_COLORS[hash % LOGO_COLORS.length]!,
    logoLetter: company.name.charAt(0).toUpperCase(),
    jobCount: company.jobCount,
  }
}
