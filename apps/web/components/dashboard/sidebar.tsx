'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { TooltipProvider } from '@hackhyre/ui/components/tooltip'
import { Separator } from '@hackhyre/ui/components/separator'
import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import { Sheet, SheetContent, SheetTitle } from '@hackhyre/ui/components/sheet'
import {
  ArrowLeft,
  ArrowRight,
  LogoutCurve,
  AddCircle,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { SidebarNavItem } from './sidebar-nav-item'
import { useSidebar } from '@/hooks/use-sidebar'
import Link from 'next/link'
import {
  SIDEBAR_NAV_ITEMS,
  SIDEBAR_BOTTOM_ITEMS,
  SIDEBAR_WIDTH_EXPANDED,
  SIDEBAR_WIDTH_COLLAPSED,
} from '@/lib/constants'
import { Session, User } from '@hackhyre/db/auth'
import { authClient } from '@/lib/auth-client'

function SidebarContent({
  isCollapsed,
  user,
}: {
  isCollapsed: boolean
  user?: User
}) {
  const pathname = usePathname()
  const toggle = useSidebar((s) => s.toggle)
  const router = useRouter()

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          'flex h-16 shrink-0 items-center px-5',
          isCollapsed && 'justify-center px-0'
        )}
      >
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="icon"
              initial={{ opacity: 0, rotate: -8 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 8 }}
              transition={{ duration: 0.15 }}
              className="bg-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
            >
              <span className="text-sm font-extrabold text-white">H</span>
            </motion.div>
          ) : (
            <motion.div
              key="full"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5"
            >
              <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-sm">
                <span className="text-sm font-extrabold text-white">H</span>
              </div>
              <div>
                <p className="font-mono text-[15px] leading-none font-bold tracking-tight">
                  Hack<span className="text-primary">Hyre</span>
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px] font-medium tracking-widest uppercase">
                  Recruiter
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-4 pb-2"
          >
            <Link
              href="/recuriter/jobs/create"
              className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 flex items-center gap-2 rounded-xl border border-dashed px-3 py-2 text-[13px] font-medium transition-colors"
            >
              <AddCircle size={18} variant="Bulk" />
              New Job Listing
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Separator className="mx-4 w-auto" />

      <nav
        className={cn(
          'flex-1 space-y-1 overflow-y-auto py-4',
          isCollapsed ? 'px-2' : 'px-3'
        )}
      >
        <AnimatePresence>
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground mb-2 px-3 text-[10px] font-semibold tracking-widest uppercase"
            >
              Menu
            </motion.p>
          )}
        </AnimatePresence>

        {SIDEBAR_NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            badge={item.badge}
            isCollapsed={isCollapsed}
            isActive={
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)
            }
          />
        ))}

        <div className="py-2">
          <Separator className={isCollapsed ? 'mx-1' : 'mx-2'} />
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground mb-2 px-3 text-[10px] font-semibold tracking-widest uppercase"
            >
              System
            </motion.p>
          )}
        </AnimatePresence>

        {SIDEBAR_BOTTOM_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isCollapsed={isCollapsed}
            isActive={pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      <div
        className={cn(
          'shrink-0 border-t p-3',
          isCollapsed && 'flex flex-col items-center p-2'
        )}
      >
        <div
          className={cn(
            'flex items-center rounded-xl transition-colors',
            isCollapsed ? 'justify-center p-1' : 'hover:bg-accent gap-3 p-2'
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.12 }}
                className="min-w-0 flex-1"
              >
                <p className="truncate text-[13px] font-semibold capitalize">
                  {user?.name}
                </p>
                <p className="text-muted-foreground truncate text-[11px] capitalize">
                  {user?.companyName}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push('/')
                      },
                    },
                  })
                }}
                className="text-muted-foreground hover:text-foreground shrink-0 rounded-lg p-1 transition-colors"
              >
                <LogoutCurve size={16} variant="Linear" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={toggle}
          className={cn(
            'text-muted-foreground hover:bg-accent hover:text-foreground mt-1 flex w-full items-center rounded-lg text-[12px] font-medium transition-colors',
            isCollapsed ? 'justify-center p-2' : 'gap-2 px-3 py-1.5'
          )}
        >
          {isCollapsed ? (
            <ArrowRight size={16} variant="Linear" />
          ) : (
            <>
              <ArrowLeft size={16} variant="Linear" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export function Sidebar(props: { session: Session | null }) {
  const isCollapsed = useSidebar((s) => s.isCollapsed)
  const isMobileOpen = useSidebar((s) => s.isMobileOpen)
  const closeMobile = useSidebar((s) => s.closeMobile)

  return (
    <>
      <TooltipProvider>
        <motion.aside
          animate={{
            width: isCollapsed
              ? SIDEBAR_WIDTH_COLLAPSED
              : SIDEBAR_WIDTH_EXPANDED,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="bg-card hidden h-full shrink-0 overflow-hidden border-r lg:block"
        >
          <SidebarContent
            isCollapsed={isCollapsed}
            user={props.session?.user}
          />
        </motion.aside>
      </TooltipProvider>
      <Sheet
        open={isMobileOpen}
        onOpenChange={(open) => !open && closeMobile()}
      >
        <SheetContent side="left" className="w-70 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <TooltipProvider>
            <SidebarContent isCollapsed={false} user={props.session?.user} />
          </TooltipProvider>
        </SheetContent>
      </Sheet>
    </>
  )
}
