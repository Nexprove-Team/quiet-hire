import type { NavItem } from "./constants";
import {
  Home,
  Briefcase,
  Bookmark,
  Messages,
  Profile,
  Setting,
} from "@hackhyre/ui/icons";

export const CANDIDATE_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/talent/dashboard", icon: Home },
  {
    label: "Applications",
    href: "/talent/applications",
    icon: Briefcase,
    badge: 5,
  },
  { label: "Saved Jobs", href: "/talent/saved-jobs", icon: Bookmark },
  { label: "Messages", href: "/talent/messages", icon: Messages, badge: 2 },
];

export const CANDIDATE_BOTTOM_ITEMS: NavItem[] = [
  { label: "Profile", href: "/talent/profile", icon: Profile },
  { label: "Settings", href: "/talent/settings", icon: Setting },
];

export const CANDIDATE_BREADCRUMB_MAP: Record<string, string> = {
  "/talent": "Dashboard",
  "/talent/dashboard": "Dashboard",
  "/talent/applications": "Applications",
  "/talent/saved-jobs": "Saved Jobs",
  "/talent/messages": "Messages",
  "/talent/profile": "Profile",
  "/talent/settings": "Settings",
};
