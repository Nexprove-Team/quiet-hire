'use client'

import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@hackhyre/ui/components/button'
import { Badge } from '@hackhyre/ui/components/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hackhyre/ui/components/select'
import { Filter } from '@hackhyre/ui/icons'
import { useDebounce } from 'use-debounce'

import SearchFilter from './(components)/search-filter'
import { FiltersSidebar } from './(components)/filters-sidebar'
import { FeaturedSidebar } from './(components)/featured-sidebar'
import { JobCard } from './(components)/job-card'
import { useJobListingFilter } from './(components)/use-job-listing-filter'
import { useSavedJobIds, useToggleSaveJob } from '@/hooks/use-saved-jobs'
import { toDisplayJob } from './(components)/mock-data'
import { usePublicJobs } from '@/hooks/use-jobs'
import type { JobFilters } from '@/actions/jobs'

// ── Main Page ──────────────────────────────────────────────────────────

const PAGE_SIZE = 6

export default function JobsPage() {
  const [filters, setFilters] = useJobListingFilter()
  const { data: savedIds = [] } = useSavedJobIds()
  const { mutate: toggleSave } = useToggleSaveJob()
  const savedSet = useMemo(() => new Set(savedIds), [savedIds])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [sort, setSort] = useState<'updated' | 'salary-high' | 'salary-low'>(
    'updated'
  )

  // Debounce the search query by 300ms
  const [debouncedQuery] = useDebounce(filters.q, 300)

  // Build server-side filter params
  const serverFilters: JobFilters = useMemo(
    () => ({
      q: debouncedQuery || undefined,
      location:
        filters.location && filters.location !== 'any'
          ? filters.location
          : undefined,
      experience:
        filters.experience && filters.experience !== 'any'
          ? filters.experience
          : undefined,
      salaryMin: filters.salary[0] ?? undefined,
      salaryMax: filters.salary[1] ?? undefined,
      recruiter: filters.recruiter || undefined,
      sort,
    }),
    [debouncedQuery, filters.location, filters.experience, filters.salary, filters.recruiter, sort]
  )

  const { data: rawJobs, isLoading } = usePublicJobs(serverFilters)

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [serverFilters])

  // Map server data to display shape + apply client-side schedule/employment filters
  const displayJobs = useMemo(() => {
    if (!rawJobs) return []

    let mapped = rawJobs.map((item, i) => toDisplayJob(item, i))

    // Client-side schedule filter
    if (filters.schedule.length > 0) {
      mapped = mapped.filter((job) =>
        job.workingSchedule.some((s) => filters.schedule.includes(s))
      )
    }

    // Client-side employment type filter
    if (filters.employment.length > 0) {
      mapped = mapped.filter((job) =>
        job.employmentType.some((t) => filters.employment.includes(t))
      )
    }

    return mapped
  }, [rawJobs, filters.schedule, filters.employment])

  // Add save state to jobs
  const jobsWithSaveState = displayJobs.map((job) => ({
    ...job,
    saved: savedSet.has(job.id),
  }))

  const visibleJobs = jobsWithSaveState.slice(0, visibleCount)
  const hasMore = visibleCount < jobsWithSaveState.length

  // Intersection observer for infinite scroll
  const loadMore = useCallback(() => {
    setVisibleCount((prev) =>
      Math.min(prev + PAGE_SIZE, jobsWithSaveState.length)
    )
  }, [jobsWithSaveState.length])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return (
    <div className="bg-white text-neutral-900">
      <SearchFilter />

      <div className="mx-auto mt-6 flex max-w-360 gap-6 px-4 pb-12 sm:px-6 lg:px-8">
        <div className="hidden lg:block">
          <FiltersSidebar />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-mono text-xl font-bold">Recommended jobs</h2>
              <Badge
                variant="outline"
                className="rounded-lg border-neutral-200 bg-white px-2.5 py-1 text-[12px] font-semibold text-neutral-900"
              >
                {jobsWithSaveState.length}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden text-[13px] text-neutral-500 sm:inline">
                Sort by:
              </span>
              <Select
                value={sort}
                onValueChange={(v) =>
                  setSort(v as 'updated' | 'salary-high' | 'salary-low')
                }
              >
                <SelectTrigger className="h-8 w-auto gap-1.5 border-0 bg-white px-2 text-[13px] font-semibold text-neutral-900 shadow-none focus-visible:ring-0 dark:bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-neutral-200 bg-white">
                  <SelectItem
                    value="updated"
                    className="text-neutral-700 focus:bg-neutral-100 focus:text-neutral-900"
                  >
                    Last updated
                  </SelectItem>
                  <SelectItem
                    value="salary-high"
                    className="text-neutral-700 focus:bg-neutral-100 focus:text-neutral-900"
                  >
                    Salary: High to Low
                  </SelectItem>
                  <SelectItem
                    value="salary-low"
                    className="text-neutral-700 focus:bg-neutral-100 focus:text-neutral-900"
                  >
                    Salary: Low to High
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-neutral-400"
              >
                <Filter size={16} variant="Linear" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 animate-pulse rounded-2xl border border-neutral-200 bg-neutral-50"
                />
              ))}
            </div>
          ) : visibleJobs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {visibleJobs.map((job) => (
                <JobCard key={job.id} job={job} onToggleSave={toggleSave} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
              <p className="text-lg font-semibold text-neutral-400">
                No jobs found
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                Try adjusting your filters or search query
              </p>
            </div>
          )}

          {/* Infinite scroll sentinel */}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-8">
              <span className="text-sm text-neutral-400">Loading more...</span>
            </div>
          )}
        </div>

        {/* Right — Featured Jobs + Top Recruiters (self-contained) */}
        <FeaturedSidebar />
      </div>
    </div>
  )
}
