import type { NavItem } from './constants'
import {
  Home,
  Briefcase,
  Bookmark,
  Messages,
  Profile,
  Setting,
} from '@hackhyre/ui/icons'

export const CANDIDATE_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Applications', href: '/applications', icon: Briefcase },
  { label: 'Saved Jobs', href: '/saved-jobs', icon: Bookmark },
  { label: 'Messages', href: '/messages', icon: Messages, isDisabled: true },
]

export const CANDIDATE_BOTTOM_ITEMS: NavItem[] = [
  { label: 'Profile', href: '/profile', icon: Profile },
  { label: 'Settings', href: '/settings', icon: Setting, isDisabled: true },
]

export const CANDIDATE_BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/applications': 'Applications',
  '/saved-jobs': 'Saved Jobs',
  '/messages': 'Messages',
  '/profile': 'Profile',
  '/settings': 'Settings',
}
