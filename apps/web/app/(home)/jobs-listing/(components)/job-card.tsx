import Link from 'next/link'
import { cn } from '@hackhyre/ui/lib/utils'
import { Button } from '@hackhyre/ui/components/button'
import { Badge } from '@hackhyre/ui/components/badge'
import { Bookmark } from '@hackhyre/ui/icons'
import type { PublicJob } from './mock-data'
import { shrinkString } from '@/lib/shrink-string'

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
          <span className="text-sm font-bold">{job.logoLetter}</span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {job.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="rounded-full border-neutral-200 bg-white/60 px-2.5 py-0.5 text-[10.5px] font-medium text-black"
          >
            {shrinkString({
              text: tag,
              prefixLength: 5,
              afterLength: 4,
              useDot: true,
              shrinkHolderNo: 3,
            })}
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
        <span className="text-xs font-bold">{job.logoLetter}</span>
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
              {shrinkString({
                text: tag,
                prefixLength: 5,
                afterLength: 4,
                useDot: true,
                shrinkHolderNo: 3,
              })}
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
