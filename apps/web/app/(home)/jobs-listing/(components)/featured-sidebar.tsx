'use client'

import { cn } from '@hackhyre/ui/lib/utils'
import { Star, TrendUp } from '@hackhyre/ui/icons'
import { FeaturedJobCard } from './job-card'
import { useJobListingFilter } from './use-job-listing-filter'
import { useSavedJobIds, useToggleSaveJob } from '@/hooks/use-saved-jobs'
import { toDisplayJob, toDisplayRecruiter } from './mock-data'
import { useFeaturedJobs, useTopCompanies } from '@/hooks/use-jobs'

// ── Featured Sidebar ───────────────────────────────────────────────────

export function FeaturedSidebar() {
  const [filters, setFilters] = useJobListingFilter()
  const { data: savedIds = [] } = useSavedJobIds()
  const { mutate: toggle } = useToggleSaveJob()
  const savedSet = new Set(savedIds)

  const { data: rawFeatured, isLoading: featuredLoading } = useFeaturedJobs()
  const { data: rawCompanies, isLoading: companiesLoading } = useTopCompanies()

  const featuredJobs = (rawFeatured ?? [])
    .map((item, i) => toDisplayJob(item, i))
    .map((job) => ({
      ...job,
      saved: savedSet.has(job.id),
    }))

  const topRecruiters = (rawCompanies ?? []).map(toDisplayRecruiter)

  const activeRecruiter = filters.recruiter || null

  const handleRecruiterClick = (name: string) => {
    setFilters({ recruiter: activeRecruiter === name ? '' : name })
  }

  return (
    <aside className="hidden w-70 shrink-0 space-y-6 xl:block">
      {/* Featured Jobs */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Star size={16} variant="Bold" className="text-amber-500" />
          <h3 className="text-sm font-semibold text-neutral-900">
            Featured Jobs
          </h3>
        </div>
        {featuredLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {featuredJobs.map((job) => (
              <FeaturedJobCard key={job.id} job={job} onToggleSave={toggle} />
            ))}
          </div>
        )}
      </div>

      {/* Top Recruiters */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <TrendUp size={16} variant="Bold" className="text-primary" />
          <h3 className="text-sm font-semibold text-neutral-900">
            Top Recruiters
          </h3>
        </div>
        {companiesLoading ? (
          <div className="space-y-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-xl bg-neutral-50"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {topRecruiters.map((recruiter) => (
              <button
                key={recruiter.id}
                onClick={() => handleRecruiterClick(recruiter.name)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                  activeRecruiter === recruiter.name
                    ? 'bg-primary/5 ring-primary/20 ring-1'
                    : 'hover:bg-neutral-50'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white',
                    recruiter.logoColor
                  )}
                >
                  <span className="text-[11px] font-bold">
                    {recruiter.logoLetter}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-neutral-900">
                    {recruiter.name}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {recruiter.jobCount} open positions
                  </p>
                </div>
                {activeRecruiter === recruiter.name && (
                  <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
