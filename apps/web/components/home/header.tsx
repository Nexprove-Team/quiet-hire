'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@hackhyre/ui/lib/utils'
import { Button } from '@hackhyre/ui/components/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@hackhyre/ui/components/avatar'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
} from '@hackhyre/ui/components/sheet'
import { Separator } from '@hackhyre/ui/components/separator'
import {
  Briefcase,
  Messages,
  People,
  Location,
  Setting,
  Notification,
  Home,
  InfoCircle,
  LoginCurve,
  ArrowRight,
  HambergerMenu,
  Icon,
  Logo as LogoIcon,
} from '@hackhyre/ui/icons'
import { Logo } from '../global/logo'
import { User } from '@hackhyre/db/auth'
import type { Geo } from '@vercel/functions'

const NAV_ITEMS = [
  { label: 'Find Jobs', href: '/jobs-listing', icon: Briefcase },
  { label: 'Messages', href: '/messages', icon: Messages },
  { label: 'Hiring', href: '/hiring', icon: People },
  { label: 'Community', href: '/community', icon: Home },
  { label: 'FAQ', href: '/faq', icon: InfoCircle },
] as const

function NavLink({
  href,
  label,
  isActive,
  isJoblisting,
}: {
  href: string
  label: string
  isActive: boolean
  isJoblisting?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative px-1 py-1 text-[13.5px] font-medium transition-colors',
        isActive
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground',
        isActive && href.includes('/jobs-listing') && isJoblisting
          ? 'text-white'
          : '',
        isJoblisting && !isActive ? 'text-white/80 hover:text-white' : ''
      )}
    >
      {label}
      <span
        className={cn(
          'bg-primary absolute -bottom-4.75 left-0 h-0.5 rounded-full transition-all duration-200',
          isActive ? 'w-full' : 'w-0'
        )}
      />
    </Link>
  )
}

function MobileNavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onClose,
}: {
  href: string
  label: string
  icon: Icon
  isActive: boolean
  onClose: () => void
}) {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        onClick={onClose}
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors',
          isActive
            ? 'bg-primary/5 text-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
      >
        <Icon size={20} variant={isActive ? 'Bold' : 'Linear'} />
        {label}
        {isActive && (
          <span className="bg-primary ml-auto h-1.5 w-1.5 rounded-full" />
        )}
      </Link>
    </SheetClose>
  )
}

function AuthenticatedActions({
  user,
  isJoblisting,
}: {
  user: User
  isJoblisting?: boolean
}) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/dashboard"
        className="ring-primary/20 hover:ring-primary/40 rounded-full ring-2 transition-all"
      >
        <Avatar className="h-8 w-8">
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-xl"
        asChild
      >
        <Link href="/settings">
          <Setting size={18} variant="Linear" />
          <span className="sr-only">Settings</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground relative h-9 w-9 rounded-xl"
      >
        <Notification size={18} variant="Linear" />
        <span className="sr-only">Notifications</span>
        <span className="bg-primary absolute top-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-white" />
      </Button>
    </div>
  )
}

function UnauthenticatedActions() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground text-[13.5px] font-medium"
        asChild
      >
        <Link href="/sign-in">
          <LoginCurve size={16} variant="Linear" />
          Sign In
        </Link>
      </Button>
      <Button
        className="rounded-xl text-[13.5px] font-semibold shadow-sm"
        size="default"
        asChild
      >
        <Link href="/sign-up">
          Get Started
          <ArrowRight size={16} variant="Linear" />
        </Link>
      </Button>
    </div>
  )
}

export function Header({ user, geo }: { user?: User; geo?: Geo }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const locationLabel = geo?.city
    ? `${geo.city}${geo.region ? `, ${geo.region}` : ''}`
    : undefined

  const isJobListingPage = pathname.includes('/jobs-listing')

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ease-in-out',
        isJobListingPage
          ? 'border-[oklch(0.26_0.02_270)] bg-black'
          : 'bg-card/80'
      )}
    >
      <div className="mx-auto flex h-16 max-w-375 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo isJobListing={isJobListingPage} />

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={pathname.startsWith(item.href)}
              isJoblisting={isJobListingPage}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {locationLabel && (
            <div className="text-muted-foreground mr-2 hidden items-center gap-1.5 xl:flex">
              <Location size={16} variant="Outline" className="text-primary" />
              <span
                className={cn(
                  'text-[13px] font-medium',
                  isJobListingPage ? 'text-white/80' : ''
                )}
              >
                {locationLabel}
              </span>
            </div>
          )}

          {locationLabel && (
            <Separator
              orientation="vertical"
              className={cn(
                'mx-2 hidden h-5 xl:block',
                isJobListingPage ? 'bg-[oklch(0.26_0.02_270)]' : 'bg-border'
              )}
            />
          )}

          <div className="hidden lg:flex">
            {user ? (
              <AuthenticatedActions
                user={user}
                isJoblisting={isJobListingPage}
              />
            ) : (
              <UnauthenticatedActions />
            )}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <HambergerMenu size={20} variant="Linear" />
              <span className="sr-only">Open menu</span>
            </Button>

            <SheetContent side="right" className="w-80 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>

              <div className="flex items-center gap-3 border-b px-5 py-4">
                <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-sm">
                  <span className="text-sm font-extrabold text-white">H</span>
                </div>
                <div>
                  <p className="font-mono text-[15px] leading-none font-bold tracking-tight">
                    Hack<span className="text-primary">Hyre</span>
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[10px] font-medium tracking-widest uppercase">
                    Job Platform
                  </p>
                </div>
              </div>

              <nav className="flex flex-col gap-1 px-3 py-4">
                {NAV_ITEMS.map((item) => (
                  <MobileNavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isActive={pathname.startsWith(item.href)}
                    onClose={() => setMobileOpen(false)}
                  />
                ))}
              </nav>

              <Separator className="mx-4 w-auto" />

              {locationLabel && (
                <div className="text-muted-foreground flex items-center gap-2 px-5 py-3">
                  <Location size={14} variant="Bold" className="text-primary" />
                  <span className="text-[12px]">{locationLabel}</span>
                </div>
              )}

              <div className="px-4 py-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="bg-accent/50 flex items-center gap-3 rounded-xl p-3">
                      <Avatar className="h-10 w-10">
                        {user.image ? (
                          <AvatarImage src={user.image} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold">
                          {user.name}
                        </p>
                        <p className="text-muted-foreground truncate text-[11px]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl text-[12px]"
                          asChild
                        >
                          <Link href="/settings">
                            <Setting size={14} variant="Linear" />
                            Settings
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl text-[12px]"
                          asChild
                        >
                          <Link href="/dashboard">
                            <Notification size={14} variant="Linear" />
                            Notifications
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <Button
                        className="w-full rounded-xl text-[13px] font-semibold"
                        asChild
                      >
                        <Link href="/sign-up">
                          Get Started
                          <ArrowRight size={16} variant="Linear" />
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl text-[13px] font-medium"
                        asChild
                      >
                        <Link href="/sign-in">
                          <LoginCurve size={16} variant="Linear" />
                          Sign In
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
