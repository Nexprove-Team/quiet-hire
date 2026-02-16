import Link from 'next/link'
import { cn } from '@hackhyre/ui/lib/utils'
import { Button } from '@hackhyre/ui/components/button'
import { Badge } from '@hackhyre/ui/components/badge'
import { Bookmark } from '@hackhyre/ui/icons'
import type { PublicJob } from './mock-data'

// ── Apple Logo SVG ─────────────────────────────────────────────────────

function AppleLogo() {
  return (
    <svg
      width="14"
      height="17"
      viewBox="0 0 14 17"
      fill="currentColor"
      className="text-white"
    >
      <path d="M13.2 12.8c-.3.7-.7 1.3-1.1 1.8-.6.8-1.1 1.3-1.5 1.6-.6.5-1.3.7-2 .7-.5 0-1.1-.1-1.8-.4-.7-.3-1.3-.4-1.8-.4s-1.1.1-1.8.4c-.7.3-1.2.4-1.7.4-.7 0-1.4-.3-2-.8C.9 15.5.4 14.8 0 13.8c-.1-.4.1-.7.4-.9.3-.1.7 0 .8.3.3.8.7 1.4 1.2 1.8.4.3.8.5 1.2.5.3 0 .8-.1 1.4-.4.6-.3 1.2-.4 1.7-.4.5 0 1 .1 1.7.4.6.3 1.1.4 1.4.4.4 0 .9-.2 1.3-.5.4-.4.8-.9 1.1-1.6.2-.4.4-.9.5-1.3.1-.3-.1-.6-.3-.8-.8-.4-1.4-.9-1.8-1.6-.5-.7-.7-1.5-.7-2.4 0-1 .3-1.9.9-2.6.5-.5 1-.9 1.7-1.2.2-.1.5 0 .7.2.1.2.1.5-.1.6-.5.2-.9.5-1.3.9-.4.5-.6 1.2-.6 1.9 0 .8.2 1.4.6 2 .4.6.9 1 1.5 1.3.2.1.3.4.3.6 0 .1 0 .2-.1.3-.2.5-.3 1-.6 1.5z" />
      <path d="M10.1 0c.1.7-.2 1.5-.7 2.2-.6.8-1.3 1.3-2.1 1.2-.1-.7.2-1.4.7-2.1C8.6.5 9.3.1 10.1 0z" />
    </svg>
  )
}

// ── Job Card ───────────────────────────────────────────────────────────

export function JobCard({
  job,
  onToggleSave,
}: {
  job: PublicJob
  onToggleSave: (id: string) => void
}) {
  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl border border-neutral-200 p-5 transition-shadow hover:shadow-md',
        job.cardColor
      )}
    >
      {/* Top row — date + bookmark */}
      <div className="mb-4 flex items-start justify-between">
        <span
          className={cn(
            'rounded-full px-3 py-1 text-[11px] font-medium',
            job.dateBadgeColor
          )}
        >
          {job.date}
        </span>
        <button
          onClick={() => onToggleSave(job.id)}
          className={cn(
            'rounded-lg p-1 transition-colors',
            job.saved
              ? 'text-neutral-900'
              : 'text-neutral-400 hover:text-neutral-900'
          )}
        >
          <Bookmark size={18} variant={job.saved ? 'Bold' : 'Linear'} />
        </button>
      </div>

      {/* Company + title + logo */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-[12px] font-medium text-neutral-500">
            {job.company}
          </p>
          <h4 className="text-[15px] leading-snug font-semibold text-neutral-900">
            {job.title}
          </h4>
        </div>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white',
            job.logoColor
          )}
        >
          {job.company === 'Apple' ? (
            <AppleLogo />
          ) : (
            <span className="text-sm font-bold">{job.logoLetter}</span>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {job.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="rounded-full border-neutral-200 bg-white/60 px-2.5 py-0.5 text-[10.5px] font-medium text-black"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Bottom row — salary + details */}
      <div className="mt-auto flex items-end justify-between">
        <div>
          <p className="text-base font-bold text-neutral-900">{job.salary}</p>
          <p className="text-[11px] text-neutral-500">{job.location}</p>
        </div>
        <Button
          size="sm"
          className="bg-brand-charcoal hover:bg-brand-charcoal/90 rounded-full text-white"
          asChild
        >
          <Link href={`/jobs-listing/${job.id}`}>Details</Link>
        </Button>
      </div>
    </div>
  )
}

// ── Compact Job Card (for featured sidebar) ────────────────────────────

export function FeaturedJobCard({
  job,
  onToggleSave,
}: {
  job: PublicJob
  onToggleSave: (id: string) => void
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-3 transition-shadow hover:shadow-sm">
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white',
          job.logoColor
        )}
      >
        {job.company === 'Apple' ? (
          <AppleLogo />
        ) : (
          <span className="text-xs font-bold">{job.logoLetter}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-neutral-900">
          {job.title}
        </p>
        <p className="text-[11px] text-neutral-500">
          {job.company} &middot; {job.salary}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {job.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-medium text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={() => onToggleSave(job.id)}
        className={cn(
          'shrink-0 rounded-md p-0.5 transition-colors',
          job.saved
            ? 'text-neutral-900'
            : 'text-neutral-300 hover:text-neutral-900'
        )}
      >
        <Bookmark size={14} variant={job.saved ? 'Bold' : 'Linear'} />
      </button>
    </div>
  )
}
