"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { TooltipProvider } from "@hackhyre/ui/components/tooltip";
import { Separator } from "@hackhyre/ui/components/separator";
import { Avatar, AvatarFallback } from "@hackhyre/ui/components/avatar";
import { Sheet, SheetContent, SheetTitle } from "@hackhyre/ui/components/sheet";
import {
  ArrowLeft,
  ArrowRight,
  LogoutCurve,
  SearchNormal,
} from "@hackhyre/ui/icons";
import { cn } from "@hackhyre/ui/lib/utils";

import { SidebarNavItem } from "./sidebar-nav-item";
import { useCandidateSidebar } from "@/hooks/use-candidate-sidebar";
import { MOCK_CANDIDATE_USER } from "@/lib/candidate-mock-data";
import Link from "next/link";
import {
  CANDIDATE_NAV_ITEMS,
  CANDIDATE_BOTTOM_ITEMS,
} from "@/lib/candidate-constants";
import {
  SIDEBAR_WIDTH_EXPANDED,
  SIDEBAR_WIDTH_COLLAPSED,
} from "@/lib/constants";

function CandidateSidebarContent({
  isCollapsed,
}: {
  isCollapsed: boolean;
}) {
  const pathname = usePathname();
  const toggle = useCandidateSidebar((s) => s.toggle);

  const initials = MOCK_CANDIDATE_USER.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-full flex-col">
      {/* Logo area */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center px-5",
          isCollapsed && "justify-center px-0"
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
                  Talent
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick action — Browse Jobs */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-4 pb-2"
          >
            <Link
              href="/jobs-listing"
              className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 flex items-center gap-2 rounded-xl border border-dashed px-3 py-2 text-[13px] font-medium transition-colors"
            >
              <SearchNormal size={18} variant="Linear" />
              Browse Jobs
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Separator className="mx-4 w-auto" />

      {/* Main nav */}
      <nav
        className={cn(
          "flex-1 space-y-1 overflow-y-auto py-4",
          isCollapsed ? "px-2" : "px-3"
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

        {CANDIDATE_NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            badge={item.badge}
            isCollapsed={isCollapsed}
            isActive={
              item.href === "/talent/dashboard"
                ? pathname === "/talent/dashboard" || pathname === "/talent"
                : pathname.startsWith(item.href)
            }
          />
        ))}

        <div className="py-2">
          <Separator className={isCollapsed ? "mx-1" : "mx-2"} />
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground mb-2 px-3 text-[10px] font-semibold tracking-widest uppercase"
            >
              Account
            </motion.p>
          )}
        </AnimatePresence>

        {CANDIDATE_BOTTOM_ITEMS.map((item) => (
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

      {/* User profile section at bottom */}
      <div
        className={cn(
          "shrink-0 border-t p-3",
          isCollapsed && "flex flex-col items-center p-2"
        )}
      >
        {/* User card */}
        <div
          className={cn(
            "flex items-center rounded-xl transition-colors",
            isCollapsed ? "justify-center p-1" : "hover:bg-accent gap-3 p-2"
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
                <p className="truncate text-[13px] font-semibold">
                  {MOCK_CANDIDATE_USER.name}
                </p>
                <p className="text-muted-foreground truncate text-[11px]">
                  {MOCK_CANDIDATE_USER.headline}
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
                onClick={() => {}}
                className="text-muted-foreground hover:text-foreground shrink-0 rounded-lg p-1 transition-colors"
              >
                <LogoutCurve size={16} variant="Linear" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className={cn(
            "text-muted-foreground hover:bg-accent hover:text-foreground mt-1 flex w-full items-center rounded-lg text-[12px] font-medium transition-colors",
            isCollapsed ? "justify-center p-2" : "gap-2 px-3 py-1.5"
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
  );
}

export function CandidateSidebar() {
  const isCollapsed = useCandidateSidebar((s) => s.isCollapsed);
  const isMobileOpen = useCandidateSidebar((s) => s.isMobileOpen);
  const closeMobile = useCandidateSidebar((s) => s.closeMobile);

  return (
    <>
      <TooltipProvider>
        <motion.aside
          animate={{
            width: isCollapsed
              ? SIDEBAR_WIDTH_COLLAPSED
              : SIDEBAR_WIDTH_EXPANDED,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="bg-card hidden h-full shrink-0 overflow-hidden border-r lg:block"
        >
          <CandidateSidebarContent isCollapsed={isCollapsed} />
        </motion.aside>
      </TooltipProvider>

      {/* Mobile sidebar */}
      <Sheet
        open={isMobileOpen}
        onOpenChange={(open) => !open && closeMobile()}
      >
        <SheetContent side="left" className="w-70 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <TooltipProvider>
            <CandidateSidebarContent isCollapsed={false} />
          </TooltipProvider>
        </SheetContent>
      </Sheet>
    </>
  );
}
