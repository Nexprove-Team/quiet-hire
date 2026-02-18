import type { Icon } from '@hackhyre/ui/icons'
import {
  Home,
  Briefcase,
  People,
  DocumentText,
  Calendar,
  Chart,
  Setting,
} from '@hackhyre/ui/icons'

export interface NavItem {
  label: string
  href: string
  icon: Icon
  badge?: number
  isDisabled?: boolean
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/recuriter/dashboard', icon: Home },
  { label: 'Jobs', href: '/recuriter/jobs', icon: Briefcase, badge: 3 },
  { label: 'Candidates', href: '/recuriter/candidates', icon: People },
  {
    label: 'Applications',
    href: '/recuriter/applications',
    icon: DocumentText,
    badge: 12,
  },
  { label: 'Interviews', href: '/recuriter/interviews', icon: Calendar },
  { label: 'Analytics', href: '/recuriter/analytics', icon: Chart },
]

export const SIDEBAR_BOTTOM_ITEMS: NavItem[] = [
  { label: 'Settings', href: '/recuriter/settings', icon: Setting },
]

export const JOB_STATUS_CONFIG: Record<
  string,
  { label: string; variant: string; className?: string }
> = {
  draft: { label: 'Draft', variant: 'secondary' },
  open: {
    label: 'Open',
    variant: 'default',
    className: 'bg-primary/15 text-primary border-primary/20',
  },
  paused: { label: 'Paused', variant: 'outline' },
  filled: {
    label: 'Filled',
    variant: 'secondary',
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
}

export const APPLICATION_STATUS_CONFIG: Record<
  string,
  { label: string; variant: string; className?: string }
> = {
  not_reviewed: { label: 'New', variant: 'secondary' },
  under_review: { label: 'Reviewing', variant: 'outline' },
  interviewing: {
    label: 'Interview',
    variant: 'default',
    className: 'bg-blue-500/15 text-blue-600 border-blue-500/20',
  },
  rejected: {
    label: 'Rejected',
    variant: 'secondary',
    className: 'bg-red-500/10 text-red-600 border-red-500/20',
  },
  hired: {
    label: 'Hired',
    variant: 'default',
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
}

export const SIDEBAR_WIDTH_EXPANDED = 240
export const SIDEBAR_WIDTH_COLLAPSED = 68
