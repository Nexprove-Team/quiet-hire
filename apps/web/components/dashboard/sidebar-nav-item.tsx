'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@hackhyre/ui/components/tooltip'
import { cn } from '@hackhyre/ui/lib/utils'
import type { Icon } from '@hackhyre/ui/icons'
import { toast } from 'sonner'

interface SidebarNavItemProps {
  icon: Icon
  label: string
  href: string
  badge?: number
  isCollapsed: boolean
  isActive: boolean
  disabled?: boolean
}

export function SidebarNavItem({
  icon: Icon,
  label,
  href,
  badge,
  isCollapsed,
  isActive,
  disabled = false,
}: SidebarNavItemProps) {
  const inner = (
    <Link
      href={disabled ? '#' : href}
      className={cn(
        'group/item relative flex items-center rounded-xl transition-all duration-200',
        isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      )}
      onClick={() => {
        if (disabled) {
          toast.info('route currently in progress')
          return
        }
      }}
    >
      {/* Active left border indicator */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className={cn(
            'bg-primary absolute top-1/2 left-0 -translate-y-1/2 rounded-r-full',
            isCollapsed ? 'h-4 w-0.5' : 'h-5 w-0.75'
          )}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}

      <div className="relative shrink-0">
        <Icon
          size={20}
          variant={isActive ? 'Bold' : 'Linear'}
          className="transition-transform duration-200 group-hover/item:scale-105"
        />
      </div>

      <AnimatePresence mode="popLayout">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="truncate text-[13px] font-medium"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge */}
      <AnimatePresence>
        {badge !== undefined && badge > 0 && !isCollapsed && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={cn(
              'ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums',
              isActive
                ? 'bg-primary/20 text-primary'
                : 'bg-primary/10 text-primary'
            )}
          >
            {badge}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Collapsed badge dot */}
      {badge !== undefined && badge > 0 && isCollapsed && (
        <span
          className={cn(
            'absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2',
            'bg-primary border-card'
          )}
        />
      )}
    </Link>
  )

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={8}
          className="flex items-center gap-2 font-medium"
        >
          {label}
          {badge !== undefined && badge > 0 && (
            <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-bold">
              {badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    )
  }

  return inner
}
