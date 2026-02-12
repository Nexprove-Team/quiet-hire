"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@hackhyre/ui/components/button";
import { Input } from "@hackhyre/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@hackhyre/ui/components/popover";
import { Separator } from "@hackhyre/ui/components/separator";
import {
  Avatar,
  AvatarFallback,
} from "@hackhyre/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@hackhyre/ui/components/dropdown-menu";
import {
  SearchNormal,
  Notification,
  Category,
  ArrowRight,
  TickCircle,
  Clock,
  Profile,
  Setting,
  LogoutCurve,
} from "@hackhyre/ui/icons";
import { cn } from "@hackhyre/ui/lib/utils";
import { useCandidateSidebar } from "@/hooks/use-candidate-sidebar";
import { CANDIDATE_BREADCRUMB_MAP } from "@/lib/candidate-constants";
import {
  MOCK_CANDIDATE_USER,
  MOCK_CANDIDATE_NOTIFICATIONS,
} from "@/lib/candidate-mock-data";

function CandidateBreadcrumbs() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [
    { label: "Dashboard", href: "/talent/dashboard" },
  ];

  let accumulated = "";
  for (const seg of segments) {
    accumulated += `/${seg}`;
    const label =
      CANDIDATE_BREADCRUMB_MAP[accumulated] ??
      seg.charAt(0).toUpperCase() + seg.slice(1);
    crumbs.push({ label, href: accumulated });
  }

  // Remove duplicate "Dashboard" if we're on /talent/dashboard
  if (crumbs.length > 1 && crumbs[1]?.label === "Dashboard") {
    crumbs.splice(0, 1);
  }

  if (crumbs.length === 1) return null;

  return (
    <nav className="hidden items-center gap-1 text-sm md:flex">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && (
              <ArrowRight
                size={12}
                variant="Linear"
                className="text-muted-foreground/50 mx-0.5"
              />
            )}
            {isLast ? (
              <span className="text-foreground text-[13px] font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground text-[13px] transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function CandidateNotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Notification size={18} variant="Linear" />
          <span className="bg-primary absolute right-1 top-1 h-2 w-2 rounded-full ring-2 ring-background" />
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <button className="text-primary text-xs font-medium hover:underline">
            Mark all read
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {MOCK_CANDIDATE_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex gap-3 border-b px-4 py-3 transition-colors last:border-0 hover:bg-accent/50",
                !n.read && "bg-primary/[0.02]"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  !n.read ? "bg-primary/10" : "bg-muted"
                )}
              >
                {!n.read ? (
                  <TickCircle
                    size={14}
                    variant="Bold"
                    className="text-primary"
                  />
                ) : (
                  <Clock
                    size={14}
                    variant="Linear"
                    className="text-muted-foreground"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-[13px] leading-tight",
                    !n.read && "font-medium"
                  )}
                >
                  {n.title}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[12px] leading-tight">
                  {n.desc}
                </p>
                <p className="text-muted-foreground/60 mt-1 text-[11px]">
                  {n.time}
                </p>
              </div>
              {!n.read && (
                <span className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CandidateUserNav() {
  const initials = MOCK_CANDIDATE_USER.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-ring flex items-center gap-2 rounded-xl p-1.5 outline-none transition-colors hover:bg-accent focus-visible:ring-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {MOCK_CANDIDATE_USER.name}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {MOCK_CANDIDATE_USER.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="gap-2 text-[13px]">
          <Link href="/talent/profile">
            <Profile size={15} variant="Linear" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-2 text-[13px]">
          <Link href="/talent/settings">
            <Setting size={15} variant="Linear" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive gap-2 text-[13px]">
          <LogoutCurve size={15} variant="Linear" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CandidateHeader() {
  const openMobile = useCandidateSidebar((s) => s.openMobile);

  return (
    <header className="bg-card/80 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur-sm">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 lg:hidden"
        onClick={openMobile}
      >
        <Category size={18} variant="Linear" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Breadcrumbs */}
      <CandidateBreadcrumbs />

      {/* Search */}
      <div className="relative ml-auto max-w-xs flex-1 md:max-w-sm">
        <SearchNormal
          size={15}
          variant="Linear"
          className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
        />
        <Input
          placeholder="Search jobs..."
          className="bg-muted/50 h-9 rounded-xl border-0 pl-9 text-[13px] focus-visible:bg-background"
        />
      </div>

      <Separator
        orientation="vertical"
        className="mx-1 hidden h-6 md:block"
      />

      {/* Notifications & user */}
      <div className="flex items-center gap-1">
        <CandidateNotificationsPopover />
        <CandidateUserNav />
      </div>
    </header>
  );
}
